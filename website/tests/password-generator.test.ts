import {
  calculateStrength,
  generateMultiplePasswords,
  generatePassword,
  type PasswordOptions,
} from '@toolkit/shared';
import { describe, expect, it } from 'vitest';

const base: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
};

describe('generatePassword', () => {
  it('returns a string of the correct length', () => {
    const pw = generatePassword({ ...base, length: 20 });
    expect(pw).toHaveLength(20);
  });

  it('contains only lowercase when only lowercase is enabled', () => {
    const pw = generatePassword({
      ...base,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
    });
    expect(pw).toMatch(/^[a-z]+$/);
  });

  it('contains only uppercase when only uppercase is enabled', () => {
    const pw = generatePassword({
      ...base,
      includeLowercase: false,
      includeNumbers: false,
      includeSymbols: false,
    });
    expect(pw).toMatch(/^[A-Z]+$/);
  });

  it('contains only numbers when only numbers is enabled', () => {
    const pw = generatePassword({
      ...base,
      includeUppercase: false,
      includeLowercase: false,
      includeSymbols: false,
    });
    expect(pw).toMatch(/^[0-9]+$/);
  });

  it('contains at least one uppercase letter when uppercase is enabled', () => {
    const results = Array.from({ length: 20 }, () => generatePassword({ ...base, length: 20 }));
    expect(results.some((pw) => /[A-Z]/.test(pw))).toBe(true);
  });

  it('contains at least one number when numbers are enabled', () => {
    const results = Array.from({ length: 20 }, () => generatePassword({ ...base, length: 20 }));
    expect(results.some((pw) => /[0-9]/.test(pw))).toBe(true);
  });

  it('contains at least one symbol when symbols are enabled', () => {
    const results = Array.from({ length: 20 }, () => generatePassword({ ...base, length: 20 }));
    expect(results.some((pw) => /[^A-Za-z0-9]/.test(pw))).toBe(true);
  });

  it('excludes ambiguous characters when excludeAmbiguous is set', () => {
    const ambiguous = /[l1Io0O]/;
    for (let i = 0; i < 50; i++) {
      const pw = generatePassword({ ...base, excludeAmbiguous: true, length: 30 });
      expect(ambiguous.test(pw)).toBe(false);
    }
  });

  it('is random across two calls', () => {
    const pw1 = generatePassword(base);
    const pw2 = generatePassword(base);
    // Chance of collision is astronomically small
    expect(pw1).not.toBe(pw2);
  });

  it('works with length 1', () => {
    const pw = generatePassword({ ...base, length: 1 });
    expect(pw.length).toBeGreaterThanOrEqual(1);
  });

  it('falls back to lowercase when all sets are disabled', () => {
    const pw = generatePassword({
      length: 10,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });
    expect(pw.length).toBeGreaterThan(0);
    expect(pw).toMatch(/^[a-z]+$/);
  });

  it('returns correct length for length 64', () => {
    const pw = generatePassword({ ...base, length: 64 });
    expect(pw).toHaveLength(64);
  });

  it('generates a password that contains chars only from enabled sets', () => {
    const pw = generatePassword({
      ...base,
      includeUppercase: false,
      includeSymbols: false,
    });
    expect(pw).toMatch(/^[a-z0-9]+$/);
  });
});

describe('calculateStrength', () => {
  it('rates a very short password as very-weak', () => {
    const { label } = calculateStrength('ab');
    expect(label).toBe('very-weak');
  });

  it('rates a long mixed password as strong or very-strong', () => {
    const { label } = calculateStrength('Tr0ub4dor&3!Password');
    expect(['strong', 'very-strong']).toContain(label);
  });

  it('rates an all-lowercase short password as weak', () => {
    const { label } = calculateStrength('abcde');
    expect(['very-weak', 'weak']).toContain(label);
  });

  it('returns a score between 0 and 4', () => {
    for (const pw of ['a', 'abcdefgh', 'Abcdefgh1!', 'Abc123!@#Xyz789']) {
      const { score } = calculateStrength(pw);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(4);
    }
  });

  it('rates a long password with all character types as very-strong', () => {
    const { label } = calculateStrength('Tr0ub4dor&3!XyZ#00aaAA');
    expect(label).toBe('very-strong');
  });
});

describe('generateMultiplePasswords', () => {
  it('returns the correct number of passwords', () => {
    const passwords = generateMultiplePasswords(base, 5);
    expect(passwords).toHaveLength(5);
  });

  it('returns 10 passwords when count is 10', () => {
    const passwords = generateMultiplePasswords(base, 10);
    expect(passwords).toHaveLength(10);
  });

  it('all returned passwords have the correct length', () => {
    const passwords = generateMultiplePasswords({ ...base, length: 12 }, 5);
    for (const pw of passwords) {
      expect(pw).toHaveLength(12);
    }
  });

  it('passwords in bulk are unique', () => {
    const passwords = generateMultiplePasswords(base, 10);
    const unique = new Set(passwords);
    expect(unique.size).toBe(10);
  });
});
