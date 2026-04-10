import { describe, it, expect } from 'vitest';
import {
  generateUuidV4,
  generateUuidV1,
  generateMultipleUuids,
  isValidUuid,
  formatUuid,
} from '../src/lib/uuid-generator';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('generateUuidV4', () => {
  it('returns a string in UUID format', () => {
    expect(generateUuidV4()).toMatch(UUID_REGEX);
  });

  it('has version 4 identifier in the correct position', () => {
    const uuid = generateUuidV4();
    expect(uuid[14]).toBe('4');
  });

  it('generates unique values across multiple calls', () => {
    const uuids = new Set(Array.from({ length: 20 }, () => generateUuidV4()));
    expect(uuids.size).toBe(20);
  });
});

describe('generateUuidV1', () => {
  it('returns a string in UUID format', () => {
    expect(generateUuidV1()).toMatch(UUID_REGEX);
  });

  it('has version 1 identifier in the correct position', () => {
    const uuid = generateUuidV1();
    expect(uuid[14]).toBe('1');
  });

  it('generates unique values across multiple calls', () => {
    const uuids = new Set(Array.from({ length: 20 }, () => generateUuidV1()));
    expect(uuids.size).toBe(20);
  });
});

describe('isValidUuid', () => {
  it('returns true for a valid v4 UUID', () => {
    expect(isValidUuid(generateUuidV4())).toBe(true);
  });

  it('returns true for a valid v1 UUID', () => {
    expect(isValidUuid(generateUuidV1())).toBe(true);
  });

  it('returns true for a well-formed UUID string', () => {
    expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(isValidUuid('')).toBe(false);
  });

  it('returns false for a UUID without dashes', () => {
    expect(isValidUuid('550e8400e29b41d4a716446655440000')).toBe(false);
  });

  it('returns false for a random non-UUID string', () => {
    expect(isValidUuid('not-a-uuid-at-all')).toBe(false);
  });

  it('returns false for a UUID with wrong length', () => {
    expect(isValidUuid('550e8400-e29b-41d4-a716-44665544000')).toBe(false);
  });

  it('returns false for a string with invalid hex chars', () => {
    expect(isValidUuid('gggggggg-gggg-gggg-gggg-gggggggggggg')).toBe(false);
  });
});

describe('generateMultipleUuids', () => {
  it('returns the correct count for v4', () => {
    expect(generateMultipleUuids('v4', 5)).toHaveLength(5);
  });

  it('returns the correct count for v1', () => {
    expect(generateMultipleUuids('v1', 5)).toHaveLength(5);
  });

  it('all generated v4 UUIDs are valid', () => {
    generateMultipleUuids('v4', 10).forEach((u) => expect(isValidUuid(u)).toBe(true));
  });

  it('all generated v1 UUIDs are valid', () => {
    generateMultipleUuids('v1', 10).forEach((u) => expect(isValidUuid(u)).toBe(true));
  });

  it('all generated UUIDs are unique', () => {
    const uuids = generateMultipleUuids('v4', 20);
    expect(new Set(uuids).size).toBe(20);
  });
});

describe('formatUuid', () => {
  it('returns lowercase UUID', () => {
    const uuid = 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890';
    expect(formatUuid(uuid)).toBe(uuid.toLowerCase());
  });

  it('preserves dashes', () => {
    const uuid = generateUuidV4();
    expect(formatUuid(uuid)).toContain('-');
  });

  it('result passes isValidUuid check', () => {
    const uuid = generateUuidV4();
    expect(isValidUuid(formatUuid(uuid))).toBe(true);
  });
});
