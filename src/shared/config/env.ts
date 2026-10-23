const isLocalhost = (hostname: string): boolean =>
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname === '::1' ||
  hostname === '[::1]';

const normalizeEnv = (value: string | undefined): string => {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return '';

  // Reject non-HTTP schemes outright (javascript:, data:, file:, etc.).
  const scheme = trimmed.match(/^([a-z][a-z0-9+.-]*):\/\//i)?.[1];
  if (scheme && !/^https?$/i.test(scheme)) return '';

  const candidate = trimmed.startsWith('//')
    ? `https:${trimmed}`
    : scheme
      ? trimmed
      : `https://${trimmed}`;

  try {
    const url = new URL(candidate);

    // API cookies are sent with every request, so never allow a plaintext
    // origin outside local development.
    if (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && isLocalhost(url.hostname))) {
      return '';
    }

    return url.toString().replace(/\/+$/, '');
  } catch {
    return '';
  }
};

// Prefer the new variable but keep NEXT_PUBLIC_API_URL as a fallback.
export const API_BASE_URL =
  normalizeEnv(process.env.NEXT_PUBLIC_API_BASE_URL) ||
  normalizeEnv(process.env.NEXT_PUBLIC_API_URL);

// Preview deploys on Netlify or Cloudflare should use same-origin `/api/*`
// proxy routes (handled by app/api/[...path]/route.ts) to preserve auth
// cookies without cross-origin restrictions.
const isPreviewHost = (hostname: string): boolean =>
  hostname.endsWith('.netlify.app') ||
  hostname.endsWith('.workers.dev') ||
  hostname.endsWith('.pages.dev');

/**
 * Preview deploys (Netlify or Cloudflare Workers/Pages) should use same-origin
 * `/api/*` proxy routes to preserve auth cookies.
 */
export const getApiBaseUrl = (hostnameOverride?: string): string => {
  const hostname = hostnameOverride ?? (typeof window !== 'undefined' ? window.location.hostname : undefined);

  if (hostname && isPreviewHost(hostname)) {
    return '';
  }

  return API_BASE_URL;
};

export const GOOGLE_AUTH_PATH = '/api/auth/google';

export const getGoogleAuthUrl = (): string => `${getApiBaseUrl()}${GOOGLE_AUTH_PATH}`;


