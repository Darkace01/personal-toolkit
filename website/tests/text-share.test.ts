import {
  generateShareId,
  hasReachedMaxAccess,
  isExpired,
  maskContent,
  type TextShare,
  validateShareContent,
} from '@toolkit/shared';
import { describe, expect, it } from 'vitest';

function makeShare(overrides: Partial<TextShare> = {}): TextShare {
  return {
    id: 'abc123',
    content: 'Hello, world!',
    accessCount: 0,
    createdAt: new Date(),
    isEncrypted: false,
    burnAfterRead: false,
    ...overrides,
  };
}

describe('generateShareId', () => {
  it('returns a string', () => {
    expect(typeof generateShareId()).toBe('string');
  });

  it('returns a string of length 10', () => {
    expect(generateShareId()).toHaveLength(10);
  });

  it('generates unique IDs across multiple calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateShareId()));
    expect(ids.size).toBe(50);
  });

  it('contains only alphanumeric characters', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateShareId()).toMatch(/^[A-Za-z0-9]+$/);
    }
  });
});

describe('isExpired', () => {
  it('returns false when expiresAt is in the future', () => {
    const share = makeShare({ expiresAt: new Date(Date.now() + 60_000) });
    expect(isExpired(share)).toBe(false);
  });

  it('returns true when expiresAt is in the past', () => {
    const share = makeShare({ expiresAt: new Date(Date.now() - 1000) });
    expect(isExpired(share)).toBe(true);
  });

  it('returns false when expiresAt is not set', () => {
    const share = makeShare({ expiresAt: undefined });
    expect(isExpired(share)).toBe(false);
  });
});

describe('hasReachedMaxAccess', () => {
  it('returns false when accessCount is below maxAccess', () => {
    const share = makeShare({ accessCount: 2, maxAccess: 5 });
    expect(hasReachedMaxAccess(share)).toBe(false);
  });

  it('returns true when accessCount equals maxAccess', () => {
    const share = makeShare({ accessCount: 5, maxAccess: 5 });
    expect(hasReachedMaxAccess(share)).toBe(true);
  });

  it('returns true when accessCount exceeds maxAccess', () => {
    const share = makeShare({ accessCount: 10, maxAccess: 5 });
    expect(hasReachedMaxAccess(share)).toBe(true);
  });

  it('returns false when maxAccess is not set', () => {
    const share = makeShare({ accessCount: 100, maxAccess: undefined });
    expect(hasReachedMaxAccess(share)).toBe(false);
  });
});

describe('maskContent', () => {
  it('returns the full content when it is shorter than the limit', () => {
    expect(maskContent('Hello', 50)).toBe('Hello');
  });

  it('truncates and appends ellipsis when content is longer than limit', () => {
    const content = 'a'.repeat(100);
    const masked = maskContent(content, 50);
    expect(masked).toBe(`${'a'.repeat(50)}...`);
  });

  it('uses 50 as the default limit', () => {
    const content = 'a'.repeat(100);
    const masked = maskContent(content);
    expect(masked).toBe(`${'a'.repeat(50)}...`);
  });

  it('returns the full content when length equals the limit', () => {
    expect(maskContent('hello', 5)).toBe('hello');
  });
});

describe('validateShareContent', () => {
  it('returns valid:true for normal content', () => {
    expect(validateShareContent('Some valid content')).toEqual({ valid: true });
  });

  it('returns valid:false for empty string', () => {
    const result = validateShareContent('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns valid:false for whitespace-only content', () => {
    const result = validateShareContent('   ');
    expect(result.valid).toBe(false);
  });

  it('returns valid:false for content exceeding max length', () => {
    const result = validateShareContent('x'.repeat(100_001));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('100000');
  });

  it('returns valid:true for content exactly at max length', () => {
    const result = validateShareContent('x'.repeat(100_000));
    expect(result.valid).toBe(true);
  });

  it('includes an error message when content is invalid', () => {
    const result = validateShareContent('');
    expect(typeof result.error).toBe('string');
  });
});
