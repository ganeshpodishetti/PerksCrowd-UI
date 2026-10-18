const normalizeEnv = (value: string | undefined): string => {
  let val = value?.trim().replace(/\/$/, '') ?? '';
  // Force HTTPS for production API to avoid extra redirects/logs
  if (val && !val.startsWith('https://')) {
    try {
      const url = new URL(val.startsWith('http://') ? val : `http://${val}`);
      if (url.hostname === 'api.perkscrowd.com') {
        val = val.replace(/^http:\/\//, 'https://');
      }
    } catch {
      // Invalid URL, leave as-is
    }
  }
  return val;
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


