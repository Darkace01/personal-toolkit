import { describe, it, expect } from 'vitest';
import {
  hashMd5,
  hashSha1,
  hashSha256,
  hashSha512,
  hashAll,
} from '../src/lib/hash-generator';

// Known reference hashes for 'hello'
const HELLO_MD5    = '5d41402abc4b2a76b9719d911017c592';
const HELLO_SHA1   = 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d';
const HELLO_SHA256 = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
const HELLO_SHA512 =
  '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043';

describe('hashMd5', () => {
  it('returns the correct MD5 for "hello"', () => {
    expect(hashMd5('hello')).toBe(HELLO_MD5);
  });

  it('returns a 32-character hex string', () => {
    expect(hashMd5('test')).toHaveLength(32);
    expect(hashMd5('test')).toMatch(/^[0-9a-f]+$/);
  });

  it('handles empty string', () => {
    const result = hashMd5('');
    expect(result).toHaveLength(32);
    expect(result).toMatch(/^[0-9a-f]+$/);
  });

  it('handles a long input', () => {
    const result = hashMd5('a'.repeat(10000));
    expect(result).toHaveLength(32);
  });

  it('is lowercase hex', () => {
    expect(hashMd5('Hello World')).toMatch(/^[0-9a-f]+$/);
  });
});

describe('hashSha1', () => {
  it('returns the correct SHA-1 for "hello"', () => {
    expect(hashSha1('hello')).toBe(HELLO_SHA1);
  });

  it('returns a 40-character hex string', () => {
    expect(hashSha1('test')).toHaveLength(40);
    expect(hashSha1('test')).toMatch(/^[0-9a-f]+$/);
  });

  it('handles empty string', () => {
    const result = hashSha1('');
    expect(result).toHaveLength(40);
    expect(result).toMatch(/^[0-9a-f]+$/);
  });

  it('handles a long input', () => {
    const result = hashSha1('b'.repeat(10000));
    expect(result).toHaveLength(40);
  });
});

describe('hashSha256', () => {
  it('returns the correct SHA-256 for "hello"', () => {
    expect(hashSha256('hello')).toBe(HELLO_SHA256);
  });

  it('returns a 64-character hex string', () => {
    expect(hashSha256('test')).toHaveLength(64);
    expect(hashSha256('test')).toMatch(/^[0-9a-f]+$/);
  });

  it('handles empty string', () => {
    const result = hashSha256('');
    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[0-9a-f]+$/);
  });

  it('is deterministic', () => {
    expect(hashSha256('same input')).toBe(hashSha256('same input'));
  });
});

describe('hashSha512', () => {
  it('returns the correct SHA-512 for "hello"', () => {
    expect(hashSha512('hello')).toBe(HELLO_SHA512);
  });

  it('returns a 128-character hex string', () => {
    expect(hashSha512('test')).toHaveLength(128);
    expect(hashSha512('test')).toMatch(/^[0-9a-f]+$/);
  });

  it('handles empty string', () => {
    const result = hashSha512('');
    expect(result).toHaveLength(128);
    expect(result).toMatch(/^[0-9a-f]+$/);
  });

  it('handles a long input', () => {
    const result = hashSha512('c'.repeat(10000));
    expect(result).toHaveLength(128);
  });
});

describe('hashAll', () => {
  it('returns an object with all 4 algorithms', () => {
    const result = hashAll('test');
    expect(result).toHaveProperty('md5');
    expect(result).toHaveProperty('sha1');
    expect(result).toHaveProperty('sha256');
    expect(result).toHaveProperty('sha512');
  });

  it('all values are lowercase hex strings', () => {
    const result = hashAll('test');
    for (const value of Object.values(result)) {
      expect(value).toMatch(/^[0-9a-f]+$/);
    }
  });

  it('returns correct known hashes for "hello"', () => {
    const result = hashAll('hello');
    expect(result.md5).toBe(HELLO_MD5);
    expect(result.sha1).toBe(HELLO_SHA1);
    expect(result.sha256).toBe(HELLO_SHA256);
    expect(result.sha512).toBe(HELLO_SHA512);
  });

  it('works with empty string', () => {
    const result = hashAll('');
    expect(typeof result.md5).toBe('string');
    expect(typeof result.sha1).toBe('string');
    expect(typeof result.sha256).toBe('string');
    expect(typeof result.sha512).toBe('string');
  });
});
