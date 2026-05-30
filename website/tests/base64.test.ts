import {
  decodeBase64,
  decodeBase64Url,
  encodeBase64,
  encodeBase64Url,
  isValidBase64,
} from '@toolkit/shared';
import { describe, expect, it } from 'vitest';

describe('encodeBase64', () => {
  it('encodes simple ASCII text', () => {
    expect(encodeBase64('Hello')).toBe('SGVsbG8=');
  });

  it('encodes an empty string', () => {
    expect(encodeBase64('')).toBe('');
  });

  it('encodes text with spaces', () => {
    expect(encodeBase64('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==');
  });

  it('encodes unicode text', () => {
    const encoded = encodeBase64('こんにちは');
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);
  });
});

describe('decodeBase64', () => {
  it('decodes a standard base64 string', () => {
    expect(decodeBase64('SGVsbG8=')).toBe('Hello');
  });

  it('decodes back to original text (round-trip)', () => {
    const original = 'Dev Toolkit 2024';
    expect(decodeBase64(encodeBase64(original))).toBe(original);
  });

  it('decodes unicode round-trip', () => {
    const original = 'こんにちは';
    expect(decodeBase64(encodeBase64(original))).toBe(original);
  });

  it('decodes empty string', () => {
    expect(decodeBase64('')).toBe('');
  });
});

describe('isValidBase64', () => {
  it('returns true for valid base64 string', () => {
    expect(isValidBase64('SGVsbG8=')).toBe(true);
  });

  it('returns true for base64 without padding', () => {
    // Standard base64 requires padding; strings with correct length multiple of 4
    expect(isValidBase64('AAAA')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isValidBase64('')).toBe(false);
  });

  it('returns false for strings with spaces', () => {
    expect(isValidBase64('SGVs bG8=')).toBe(false);
  });

  it('returns false for URL-safe base64 chars (- and _)', () => {
    expect(isValidBase64('SGVs-G8_')).toBe(false);
  });

  it('returns false for random non-base64 text', () => {
    expect(isValidBase64('not-valid!!!')).toBe(false);
  });
});

describe('encodeBase64Url', () => {
  it('does not contain + characters', () => {
    const encoded = encodeBase64Url('Hello, World! This is a test.');
    expect(encoded).not.toContain('+');
  });

  it('does not contain / characters', () => {
    const encoded = encodeBase64Url('Some text that might produce slashes');
    expect(encoded).not.toContain('/');
  });

  it('does not contain = padding characters', () => {
    const encoded = encodeBase64Url('Hello');
    expect(encoded).not.toContain('=');
  });

  it('only uses URL-safe characters', () => {
    const encoded = encodeBase64Url('Any arbitrary text for testing URL safe encoding');
    expect(encoded).toMatch(/^[A-Za-z0-9\-_]+$/);
  });
});

describe('decodeBase64Url', () => {
  it('decodes URL-safe base64 back to original', () => {
    const original = 'Hello, World!';
    expect(decodeBase64Url(encodeBase64Url(original))).toBe(original);
  });

  it('round-trip with unicode', () => {
    const original = 'こんにちは 🛠️';
    expect(decodeBase64Url(encodeBase64Url(original))).toBe(original);
  });

  it('round-trip empty string', () => {
    expect(decodeBase64Url(encodeBase64Url(''))).toBe('');
  });
});
