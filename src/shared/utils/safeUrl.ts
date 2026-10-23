const SAFE_PROTOCOLS = new Set(['http:', 'https:']);

/**
 * Returns a normalized http(s) URL, or undefined when the value is not a
 * safe external link. Prevents API-provided values such as `javascript:` or
 * `data:` from ending up in an href.
 */
export function getSafeExternalUrl(value?: string | null): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  try {
    const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed);
    const candidate = trimmed.startsWith('//')
      ? `https:${trimmed}`
      : hasScheme
        ? trimmed
        : `https://${trimmed}`;

    const url = new URL(candidate);
    return SAFE_PROTOCOLS.has(url.protocol) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function isSafeExternalUrl(value?: string | null): boolean {
  return getSafeExternalUrl(value) !== undefined;
}
