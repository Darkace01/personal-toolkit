import { describe, expect, it } from 'vitest';
import { formatJson, minifyJson, sortJsonKeys, validateJson } from '../src/lib/json-formatter';

describe('formatJson', () => {
  it('formats valid JSON with default 2-space indentation', () => {
    const result = formatJson('{"a":1,"b":2}');
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it('formats valid JSON with custom indentation', () => {
    const result = formatJson('{"a":1}', 4);
    expect(result).toBe('{\n    "a": 1\n}');
  });

  it('throws SyntaxError for invalid JSON', () => {
    expect(() => formatJson('{invalid}')).toThrow();
  });

  it('handles arrays correctly', () => {
    const result = formatJson('[1,2,3]');
    expect(result).toBe('[\n  1,\n  2,\n  3\n]');
  });

  it('handles nested objects', () => {
    const input = '{"a":{"b":{"c":1}}}';
    const result = formatJson(input);
    expect(result).toContain('"c": 1');
  });

  it('handles null value', () => {
    const result = formatJson('null');
    expect(result).toBe('null');
  });
});

describe('minifyJson', () => {
  it('removes whitespace from formatted JSON', () => {
    const formatted = '{\n  "a": 1,\n  "b": 2\n}';
    const result = minifyJson(formatted);
    expect(result).toBe('{"a":1,"b":2}');
  });

  it('throws SyntaxError for invalid JSON', () => {
    expect(() => minifyJson('{bad}')).toThrow();
  });

  it('minifies arrays', () => {
    const result = minifyJson('[ 1,  2,  3 ]');
    expect(result).toBe('[1,2,3]');
  });

  it('minified output has no newlines', () => {
    const result = minifyJson('{"a":1,"b":{"c":2}}');
    expect(result).not.toContain('\n');
  });
});

describe('validateJson', () => {
  it('returns valid:true for valid JSON object', () => {
    expect(validateJson('{"key":"value"}')).toEqual({ valid: true });
  });

  it('returns valid:true for valid JSON array', () => {
    expect(validateJson('[1,2,3]')).toEqual({ valid: true });
  });

  it('returns valid:true for JSON null', () => {
    expect(validateJson('null')).toEqual({ valid: true });
  });

  it('returns valid:false and error for invalid JSON', () => {
    const result = validateJson('{bad json}');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns valid:false for empty string', () => {
    const result = validateJson('');
    expect(result.valid).toBe(false);
  });

  it('returns valid:false for trailing comma', () => {
    const result = validateJson('{"a":1,}');
    expect(result.valid).toBe(false);
  });
});

describe('sortJsonKeys', () => {
  it('sorts keys alphabetically', () => {
    const result = sortJsonKeys('{"z":1,"a":2,"m":3}');
    const parsed = JSON.parse(result);
    expect(Object.keys(parsed)).toEqual(['a', 'm', 'z']);
  });

  it('sorts nested object keys', () => {
    const result = sortJsonKeys('{"b":{"z":1,"a":2},"a":1}');
    const parsed = JSON.parse(result);
    expect(Object.keys(parsed.b)).toEqual(['a', 'z']);
  });

  it('preserves array order', () => {
    const result = sortJsonKeys('{"arr":[3,1,2]}');
    const parsed = JSON.parse(result);
    expect(parsed.arr).toEqual([3, 1, 2]);
  });

  it('throws for invalid JSON', () => {
    expect(() => sortJsonKeys('{bad}')).toThrow();
  });
});
