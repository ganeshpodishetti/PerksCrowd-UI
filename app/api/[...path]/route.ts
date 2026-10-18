import { NextRequest } from 'next/server';

/**
 * Same-origin reverse proxy for API requests.
 *
 * This replaces the Netlify `[[redirects]]` proxy rule that forwarded
 * `/api/*` to `https://api.perkscrowd.com/api/*` with status 200. Keeping API
 * calls same-origin preserves auth cookies on preview deployments (e.g.
 * `*.workers.dev`) where the browser would otherwise hit cross-origin cookie
 * restrictions.
 *
 * In production the client typically calls the API directly via
 * NEXT_PUBLIC_API_BASE_URL; this handler is only exercised when that variable
 * resolves to empty (preview deploys), exactly mirroring the previous setup.
 *
 * Configuration:
 *   API_ORIGIN_URL  - upstream API origin (default: https://api.perkscrowd.com)
 *   FORWARDED_HOST  - value sent as X-Forwarded-Host (default: perkscrowd.com)
 */

const API_ORIGIN = process.env.API_ORIGIN_URL || 'https://api.perkscrowd.com';
const FORWARDED_HOST = process.env.FORWARDED_HOST || 'perkscrowd.com';

// Methods that may carry a request body.
const BODY_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const incoming = new URL(req.url);
  const target = new URL(`${API_ORIGIN}/api/${path.join('/')}`);
  target.search = incoming.search;

  const headers = new Headers(req.headers);
  // Let fetch set the Host header based on the target URL.
  headers.delete('host');
  // Tell the upstream API which host originated the request. Matches the old
  // Netlify proxy behaviour, which hardcoded perkscrowd.com.
  headers.set('x-forwarded-host', FORWARDED_HOST);
  headers.set('x-forwarded-proto', 'https');

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual',
  };

  if (BODY_METHODS.has(req.method)) {
    // Streaming a ReadableStream body requires duplex: 'half'; drop any stale
    // content-length so the runtime uses chunked transfer encoding.
    headers.delete('content-length');
    init.body = req.body;
    // @ts-expect-error -- 'duplex' is not yet in the TS lib RequestInit types
    init.duplex = 'half';
  }

  const upstream = await fetch(target, init);

  // Pass the upstream response through, but rewrite Set-Cookie so any
  // `Domain=...` attribute is dropped. Cookies scoped to api.perkscrowd.com
  // would be rejected by the browser when served same-origin from the proxy
  // host, which would silently break auth on preview deployments.
  const responseHeaders = new Headers(upstream.headers);
  const setCookies = responseHeaders.getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    responseHeaders.delete('set-cookie');
    for (const cookie of setCookies) {
      const rewritten = cookie.replace(/\s*Domain=[^;]+;?/gi, '');
      responseHeaders.append('set-cookie', rewritten);
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
  proxy as HEAD,
};
