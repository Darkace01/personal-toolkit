import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type CssSnippet,
  deleteSnippet,
  generateId,
  getSnippets,
  getSnippetsForUrl,
  matchesUrl,
  saveSnippet,
  toggleSnippet,
  updateSnippet,
} from '../src/snippets/snippet-manager';

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeSnippet(overrides: Partial<CssSnippet> = {}): CssSnippet {
  return {
    id: 'test-id',
    name: 'Test Snippet',
    description: 'A test snippet',
    css: 'body { color: red; }',
    urlPattern: '*',
    patternType: 'all',
    enabled: true,
    createdAt: 1000,
    updatedAt: 1000,
    ...overrides,
  };
}

function mockStorageWith(snippets: CssSnippet[]): void {
  (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementation(
    (_keys: string[], callback: (result: Record<string, unknown>) => void) => {
      callback({ cssSnippets: snippets });
    },
  );
  (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockImplementation(
    (_data: Record<string, unknown>, callback: () => void) => {
      callback();
    },
  );
}

// ─── generateId ─────────────────────────────────────────────────────────────

describe('generateId()', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('starts with the "snippet-" prefix', () => {
    expect(generateId().startsWith('snippet-')).toBe(true);
  });
});

// ─── matchesUrl ─────────────────────────────────────────────────────────────

describe('matchesUrl() – patternType: all', () => {
  it('matches any URL', () => {
    const snippet = makeSnippet({ patternType: 'all', urlPattern: '*' });
    expect(matchesUrl(snippet, 'https://github.com')).toBe(true);
    expect(matchesUrl(snippet, 'https://google.com/search?q=test')).toBe(true);
    expect(matchesUrl(snippet, 'http://localhost:3000')).toBe(true);
  });
});

describe('matchesUrl() – patternType: domain', () => {
  it('matches the exact domain', () => {
    const snippet = makeSnippet({ patternType: 'domain', urlPattern: 'github.com' });
    expect(matchesUrl(snippet, 'https://github.com')).toBe(true);
    expect(matchesUrl(snippet, 'https://github.com/user/repo')).toBe(true);
  });

  it('matches subdomains', () => {
    const snippet = makeSnippet({ patternType: 'domain', urlPattern: 'github.com' });
    expect(matchesUrl(snippet, 'https://api.github.com')).toBe(true);
    expect(matchesUrl(snippet, 'https://gist.github.com')).toBe(true);
  });

  it('ignores www prefix in URL', () => {
    const snippet = makeSnippet({ patternType: 'domain', urlPattern: 'example.com' });
    expect(matchesUrl(snippet, 'https://www.example.com')).toBe(true);
  });

  it('ignores www prefix in pattern', () => {
    const snippet = makeSnippet({ patternType: 'domain', urlPattern: 'www.example.com' });
    expect(matchesUrl(snippet, 'https://example.com')).toBe(true);
  });

  it('does not match different domains', () => {
    const snippet = makeSnippet({ patternType: 'domain', urlPattern: 'github.com' });
    expect(matchesUrl(snippet, 'https://gitlab.com')).toBe(false);
    expect(matchesUrl(snippet, 'https://notgithub.com')).toBe(false);
  });

  it('does not match a domain that merely contains the pattern', () => {
    const snippet = makeSnippet({ patternType: 'domain', urlPattern: 'hub.com' });
    expect(matchesUrl(snippet, 'https://github.com')).toBe(false);
  });
});

describe('matchesUrl() – patternType: exact', () => {
  it('matches the exact URL', () => {
    const url = 'https://github.com/user/repo';
    const snippet = makeSnippet({ patternType: 'exact', urlPattern: url });
    expect(matchesUrl(snippet, url)).toBe(true);
  });

  it('does not match a different URL', () => {
    const snippet = makeSnippet({
      patternType: 'exact',
      urlPattern: 'https://github.com/user/repo',
    });
    expect(matchesUrl(snippet, 'https://github.com/user/other')).toBe(false);
    expect(matchesUrl(snippet, 'https://github.com/user/repo/')).toBe(false);
  });

  it('is case-sensitive', () => {
    const snippet = makeSnippet({
      patternType: 'exact',
      urlPattern: 'https://GitHub.com',
    });
    expect(matchesUrl(snippet, 'https://github.com')).toBe(false);
  });
});

describe('matchesUrl() – patternType: wildcard', () => {
  it('matches with a simple * wildcard', () => {
    const snippet = makeSnippet({
      patternType: 'wildcard',
      urlPattern: 'https://github.com/*/repo',
    });
    expect(matchesUrl(snippet, 'https://github.com/user/repo')).toBe(true);
    expect(matchesUrl(snippet, 'https://github.com/org/repo')).toBe(true);
  });

  it('matches with leading wildcard', () => {
    const snippet = makeSnippet({
      patternType: 'wildcard',
      urlPattern: '*://github.com/*',
    });
    expect(matchesUrl(snippet, 'https://github.com/user')).toBe(true);
    expect(matchesUrl(snippet, 'http://github.com/user')).toBe(true);
  });

  it('does not match when the pattern has no match', () => {
    const snippet = makeSnippet({
      patternType: 'wildcard',
      urlPattern: 'https://github.com/user/*',
    });
    expect(matchesUrl(snippet, 'https://gitlab.com/user/repo')).toBe(false);
  });

  it('handles ? wildcard for single characters', () => {
    const snippet = makeSnippet({
      patternType: 'wildcard',
      urlPattern: 'https://github.com/a?c',
    });
    expect(matchesUrl(snippet, 'https://github.com/abc')).toBe(true);
    expect(matchesUrl(snippet, 'https://github.com/axc')).toBe(true);
    expect(matchesUrl(snippet, 'https://github.com/abbc')).toBe(false);
  });
});

describe('matchesUrl() – edge cases', () => {
  it('returns false for invalid URL with domain pattern', () => {
    const snippet = makeSnippet({ patternType: 'domain', urlPattern: 'github.com' });
    expect(matchesUrl(snippet, 'not-a-url')).toBe(false);
  });

  it('returns false for invalid URL with exact pattern', () => {
    const snippet = makeSnippet({ patternType: 'exact', urlPattern: 'https://github.com' });
    expect(matchesUrl(snippet, 'not-a-url')).toBe(false);
  });
});

// ─── getSnippets ─────────────────────────────────────────────────────────────

describe('getSnippets()', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns stored snippets', async () => {
    const stored = [makeSnippet({ id: 'a' }), makeSnippet({ id: 'b' })];
    mockStorageWith(stored);
    const result = await getSnippets();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('a');
  });

  it('returns empty array when storage is empty', async () => {
    (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementation(
      (_keys: string[], callback: (result: Record<string, unknown>) => void) => {
        callback({});
      },
    );
    const result = await getSnippets();
    expect(result).toEqual([]);
  });
});

// ─── saveSnippet ─────────────────────────────────────────────────────────────

describe('saveSnippet()', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('creates a snippet with an auto-generated id', async () => {
    mockStorageWith([]);
    const snippet = await saveSnippet({
      name: 'My Snippet',
      description: '',
      css: 'body {}',
      urlPattern: '*',
      patternType: 'all',
      enabled: true,
    });
    expect(snippet.id).toBeTruthy();
    expect(snippet.id.startsWith('snippet-')).toBe(true);
  });

  it('sets createdAt and updatedAt timestamps', async () => {
    const before = Date.now();
    mockStorageWith([]);
    const snippet = await saveSnippet({
      name: 'Timed',
      description: '',
      css: '',
      urlPattern: '*',
      patternType: 'all',
      enabled: true,
    });
    const after = Date.now();
    expect(snippet.createdAt).toBeGreaterThanOrEqual(before);
    expect(snippet.createdAt).toBeLessThanOrEqual(after);
    expect(snippet.updatedAt).toBe(snippet.createdAt);
  });

  it('persists the snippet via chrome.storage.sync.set', async () => {
    mockStorageWith([]);
    await saveSnippet({
      name: 'Persist',
      description: '',
      css: 'a{}',
      urlPattern: '*',
      patternType: 'all',
      enabled: true,
    });
    expect(chrome.storage.sync.set).toHaveBeenCalled();
  });

  it('appends to existing snippets', async () => {
    const existing = makeSnippet({ id: 'existing' });
    let stored = [existing];

    (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementation(
      (_keys: string[], callback: (result: Record<string, unknown>) => void) => {
        callback({ cssSnippets: stored });
      },
    );
    (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockImplementation(
      (data: Record<string, unknown>, callback: () => void) => {
        stored = data.cssSnippets as CssSnippet[];
        callback();
      },
    );

    await saveSnippet({
      name: 'New',
      description: '',
      css: '',
      urlPattern: '*',
      patternType: 'all',
      enabled: true,
    });

    expect(stored).toHaveLength(2);
    expect(stored[0].id).toBe('existing');
  });
});

// ─── updateSnippet ────────────────────────────────────────────────────────────

describe('updateSnippet()', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('updates the specified fields', async () => {
    const original = makeSnippet({ id: 'upd-1', name: 'Old Name', updatedAt: 1000 });
    mockStorageWith([original]);

    const updated = await updateSnippet('upd-1', { name: 'New Name' });
    expect(updated.name).toBe('New Name');
  });

  it('updates the updatedAt timestamp', async () => {
    const original = makeSnippet({ id: 'upd-2', updatedAt: 1000 });
    mockStorageWith([original]);

    const before = Date.now();
    const updated = await updateSnippet('upd-2', { name: 'Changed' });
    const after = Date.now();

    expect(updated.updatedAt).toBeGreaterThanOrEqual(before);
    expect(updated.updatedAt).toBeLessThanOrEqual(after);
    expect(updated.updatedAt).toBeGreaterThan(1000);
  });

  it('preserves non-updated fields', async () => {
    const original = makeSnippet({ id: 'upd-3', css: 'body{}', description: 'Keep me' });
    mockStorageWith([original]);

    const updated = await updateSnippet('upd-3', { name: 'New' });
    expect(updated.css).toBe('body{}');
    expect(updated.description).toBe('Keep me');
  });

  it('preserves the original id even if id is passed in updates', async () => {
    const original = makeSnippet({ id: 'upd-4' });
    mockStorageWith([original]);

    const updated = await updateSnippet('upd-4', { id: 'hacked-id' } as Partial<CssSnippet>);
    expect(updated.id).toBe('upd-4');
  });

  it('throws when the snippet id does not exist', async () => {
    mockStorageWith([]);
    await expect(updateSnippet('no-such-id', { name: 'X' })).rejects.toThrow();
  });
});

// ─── deleteSnippet ────────────────────────────────────────────────────────────

describe('deleteSnippet()', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('removes the snippet from storage', async () => {
    const s1 = makeSnippet({ id: 'del-1' });
    const s2 = makeSnippet({ id: 'del-2' });
    let stored = [s1, s2];

    (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementation(
      (_keys: string[], cb: (r: Record<string, unknown>) => void) => cb({ cssSnippets: stored }),
    );
    (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockImplementation(
      (data: Record<string, unknown>, cb: () => void) => {
        stored = data.cssSnippets as CssSnippet[];
        cb();
      },
    );

    await deleteSnippet('del-1');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('del-2');
  });

  it('is a no-op when the snippet does not exist', async () => {
    const s = makeSnippet({ id: 'keep' });
    mockStorageWith([s]);
    await expect(deleteSnippet('nonexistent')).resolves.toBeUndefined();
  });
});

// ─── toggleSnippet ────────────────────────────────────────────────────────────

describe('toggleSnippet()', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('disables an enabled snippet', async () => {
    const snippet = makeSnippet({ id: 'tog-1', enabled: true });
    let stored = [snippet];

    (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementation(
      (_keys: string[], cb: (r: Record<string, unknown>) => void) => cb({ cssSnippets: stored }),
    );
    (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockImplementation(
      (data: Record<string, unknown>, cb: () => void) => {
        stored = data.cssSnippets as CssSnippet[];
        cb();
      },
    );

    const result = await toggleSnippet('tog-1');
    expect(result.enabled).toBe(false);
  });

  it('enables a disabled snippet', async () => {
    const snippet = makeSnippet({ id: 'tog-2', enabled: false });
    let stored = [snippet];

    (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementation(
      (_keys: string[], cb: (r: Record<string, unknown>) => void) => cb({ cssSnippets: stored }),
    );
    (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockImplementation(
      (data: Record<string, unknown>, cb: () => void) => {
        stored = data.cssSnippets as CssSnippet[];
        cb();
      },
    );

    const result = await toggleSnippet('tog-2');
    expect(result.enabled).toBe(true);
  });

  it('throws when the snippet does not exist', async () => {
    mockStorageWith([]);
    await expect(toggleSnippet('ghost')).rejects.toThrow();
  });
});

// ─── getSnippetsForUrl ────────────────────────────────────────────────────────

describe('getSnippetsForUrl()', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns only enabled snippets matching the URL', async () => {
    const snippets: CssSnippet[] = [
      makeSnippet({ id: '1', enabled: true, patternType: 'all', urlPattern: '*' }),
      makeSnippet({ id: '2', enabled: false, patternType: 'all', urlPattern: '*' }),
      makeSnippet({
        id: '3',
        enabled: true,
        patternType: 'domain',
        urlPattern: 'github.com',
      }),
      makeSnippet({
        id: '4',
        enabled: true,
        patternType: 'domain',
        urlPattern: 'gitlab.com',
      }),
    ];
    mockStorageWith(snippets);

    const result = await getSnippetsForUrl('https://github.com/user/repo');
    const ids = result.map((s) => s.id);
    expect(ids).toContain('1');
    expect(ids).not.toContain('2'); // disabled
    expect(ids).toContain('3');
    expect(ids).not.toContain('4'); // different domain
  });

  it('returns empty array when no snippets match', async () => {
    const snippets: CssSnippet[] = [
      makeSnippet({
        id: '5',
        enabled: true,
        patternType: 'domain',
        urlPattern: 'gitlab.com',
      }),
    ];
    mockStorageWith(snippets);

    const result = await getSnippetsForUrl('https://github.com');
    expect(result).toHaveLength(0);
  });

  it('returns empty array when all matching snippets are disabled', async () => {
    const snippets: CssSnippet[] = [
      makeSnippet({ id: '6', enabled: false, patternType: 'all', urlPattern: '*' }),
    ];
    mockStorageWith(snippets);

    const result = await getSnippetsForUrl('https://anything.com');
    expect(result).toHaveLength(0);
  });

  it('handles exact URL matching', async () => {
    const target = 'https://github.com/user/repo';
    const snippets: CssSnippet[] = [
      makeSnippet({ id: '7', enabled: true, patternType: 'exact', urlPattern: target }),
      makeSnippet({
        id: '8',
        enabled: true,
        patternType: 'exact',
        urlPattern: 'https://github.com/other',
      }),
    ];
    mockStorageWith(snippets);

    const result = await getSnippetsForUrl(target);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('7');
  });

  it('handles wildcard URL matching', async () => {
    const snippets: CssSnippet[] = [
      makeSnippet({
        id: '9',
        enabled: true,
        patternType: 'wildcard',
        urlPattern: 'https://github.com/*/pulls',
      }),
    ];
    mockStorageWith(snippets);

    const match = await getSnippetsForUrl('https://github.com/user/pulls');
    expect(match).toHaveLength(1);

    const noMatch = await getSnippetsForUrl('https://github.com/user/issues');
    expect(noMatch).toHaveLength(0);
  });
});
