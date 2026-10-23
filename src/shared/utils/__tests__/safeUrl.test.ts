import { describe, expect, it } from '@jest/globals';
import { getSafeExternalUrl, isSafeExternalUrl } from '../safeUrl';

describe('getSafeExternalUrl', () => {
  it('allows http and https URLs', () => {
    expect(getSafeExternalUrl('https://example.com/deal')).toBe('https://example.com/deal');
    expect(getSafeExternalUrl('http://example.com')).toBe('http://example.com/');
  });

  it('allows protocol-relative and bare domains', () => {
    expect(getSafeExternalUrl('//example.com/deal')).toBe('https://example.com/deal');
    expect(getSafeExternalUrl('example.com/deal')).toBe('https://example.com/deal');
    expect(getSafeExternalUrl('example.com:8080/deal')).toBe('https://example.com:8080/deal');
  });

  it('rejects script, data, and other non-web protocols', () => {
    expect(getSafeExternalUrl('javascript:alert(1)')).toBeUndefined();
    expect(getSafeExternalUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined();
    expect(getSafeExternalUrl('file:///etc/passwd')).toBeUndefined();
  });

  it('rejects empty and malformed values', () => {
    expect(getSafeExternalUrl()).toBeUndefined();
    expect(getSafeExternalUrl(null)).toBeUndefined();
    expect(getSafeExternalUrl('   ')).toBeUndefined();
    expect(getSafeExternalUrl('https://')).toBeUndefined();
  });

  it('trims surrounding whitespace', () => {
    expect(getSafeExternalUrl('  https://example.com  ')).toBe('https://example.com/');
  });
});

describe('isSafeExternalUrl', () => {
  it('matches getSafeExternalUrl', () => {
    expect(isSafeExternalUrl('https://example.com')).toBe(true);
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
  });
});
