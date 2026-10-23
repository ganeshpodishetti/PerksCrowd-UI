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

// Headers that must not be forwarded between proxies.
const HOP_BY_HOP_HEADERS = [
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'proxy-connection',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
];

const isLocalhost = (hostname: string) =>
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname === '::1' ||
  hostname === '[::1]';

/**
 * Only proxy to HTTPS upstreams. Plain HTTP is allowed for local development
 * so `API_ORIGIN_URL=http://localhost:5000` keeps working.
 */
function getApiOrigin(): string | null {
  try {
    const origin = new URL(API_ORIGIN);
    const isAllowedProtocol =
      origin.protocol === 'https:' ||
      (process.env.NODE_ENV !== 'production' && isLocalhost(origin.hostname));

    if (!isAllowedProtocol) return null;

    return origin.toString().replace(/\/+$/, '');
  } catch {
    return null;
  }
}

function hasControlCharacters(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 0x1f || code === 0x7f) return true;
  }

  return false;
}

/**
 * Reject traversal and encoded separators before the path is joined into the
 * upstream URL. Each segment is then encoded so `?`/`#` cannot alter the
 * target URL.
 */
function encodePathSegments(path: string[]): string | null {
  if (path.length === 0) return null;

  const segments: string[] = [];

  for (const segment of path) {
    if (!segment || segment === '.' || segment === '..') return null;
    if (segment.includes('/') || segment.includes('\\')) return null;
    if (hasControlCharacters(segment)) return null;
    segments.push(encodeURIComponent(segment));
  }

  return segments.join('/');
}

async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const apiOrigin = getApiOrigin();
  if (!apiOrigin) {
    return new Response('API proxy is not configured correctly', { status: 500 });
  }

  const { path } = await context.params;
  const encodedPath = encodePathSegments(path);
  if (!encodedPath) {
    return new Response('Bad Request', { status: 400 });
  }

  const incoming = new URL(req.url);

  // Reject cross-site state-changing requests. Same-origin requests (the only
  // ones this proxy is meant to serve) pass this check.
  const requestOrigin = req.headers.get('origin');
  if (BODY_METHODS.has(req.method) && requestOrigin && requestOrigin !== incoming.origin) {
    return new Response('Forbidden', { status: 403 });
  }

  const target = new URL(`${apiOrigin}/api/${encodedPath}`);
  target.search = incoming.search;

  const headers = new Headers(req.headers);

  // Let fetch set the Host header based on the target URL.
  headers.delete('host');

  // Drop hop-by-hop and client-supplied forwarding headers. The upstream must
  // not trust values a browser can spoof.
  for (const header of HOP_BY_HOP_HEADERS) {
    headers.delete(header);
  }
  headers.delete('forwarded');
  headers.delete('x-forwarded-for');
  headers.delete('x-forwarded-host');
  headers.delete('x-forwarded-port');
  headers.delete('x-forwarded-proto');
  headers.delete('x-forwarded-server');
  headers.delete('x-real-ip');

  // Cloudflare overwrites CF-Connecting-IP at the edge, so it is safe to trust
  // here. On other platforms the header is absent and the upstream simply
  // receives no client IP rather than a spoofable one.
  const clientIp = req.headers.get('cf-connecting-ip');
  if (clientIp) {
    headers.set('x-forwarded-for', clientIp);
    headers.set('x-real-ip', clientIp);
  }

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

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return new Response('Bad Gateway', { status: 502 });
  }

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

  // Never let a shared cache store authenticated responses.
  const isPrivate =
    /\/api\/auth\//.test(target.pathname) ||
    req.headers.has('cookie') ||
    req.headers.has('authorization');
  if (isPrivate) {
    responseHeaders.set('cache-control', 'no-store');
    responseHeaders.set('pragma', 'no-cache');
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
