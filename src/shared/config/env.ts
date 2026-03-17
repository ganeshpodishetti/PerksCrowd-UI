const normalizeEnv = (value: string | undefined): string => value?.trim().replace(/\/$/, '') ?? '';

// Prefer the new variable but keep NEXT_PUBLIC_API_URL as a fallback.
export const API_BASE_URL =
  normalizeEnv(process.env.NEXT_PUBLIC_API_BASE_URL) ||
  normalizeEnv(process.env.NEXT_PUBLIC_API_URL);

export const GOOGLE_AUTH_PATH = '/api/auth/google';

export const getGoogleAuthUrl = (): string => `${API_BASE_URL}${GOOGLE_AUTH_PATH}`;


