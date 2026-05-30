export interface CssSnippet {
  id: string;
  name: string;
  description: string;
  css: string;
  urlPattern: string;
  patternType: 'all' | 'domain' | 'exact' | 'wildcard';
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'cssSnippets';

export function generateId(): string {
  return `snippet-${crypto.randomUUID()}`;
}

export async function getSnippets(): Promise<CssSnippet[]> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
      resolve((result[STORAGE_KEY] as CssSnippet[]) ?? []);
    });
  });
}

async function persistSnippets(snippets: CssSnippet[]): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: snippets }, () => resolve());
  });
}

export async function saveSnippet(
  snippet: Omit<CssSnippet, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<CssSnippet> {
  const now = Date.now();
  const newSnippet: CssSnippet = {
    ...snippet,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  const snippets = await getSnippets();
  snippets.push(newSnippet);
  await persistSnippets(snippets);
  return newSnippet;
}

export async function updateSnippet(id: string, updates: Partial<CssSnippet>): Promise<CssSnippet> {
  const snippets = await getSnippets();
  const index = snippets.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Snippet with id "${id}" not found`);
  }
  const updated: CssSnippet = {
    ...snippets[index],
    ...updates,
    id,
    updatedAt: Date.now(),
  };
  snippets[index] = updated;
  await persistSnippets(snippets);
  return updated;
}

export async function deleteSnippet(id: string): Promise<void> {
  const snippets = await getSnippets();
  const filtered = snippets.filter((s) => s.id !== id);
  await persistSnippets(filtered);
}

export async function toggleSnippet(id: string): Promise<CssSnippet> {
  const snippets = await getSnippets();
  const snippet = snippets.find((s) => s.id === id);
  if (!snippet) {
    throw new Error(`Snippet with id "${id}" not found`);
  }
  return updateSnippet(id, { enabled: !snippet.enabled });
}

export function matchesUrl(snippet: CssSnippet, url: string): boolean {
  const { patternType, urlPattern } = snippet;

  if (patternType === 'all') {
    return true;
  }

  try {
    const parsed = new URL(url);

    if (patternType === 'domain') {
      const hostname = parsed.hostname.replace(/^www\./, '');
      const pattern = urlPattern.replace(/^www\./, '');
      return hostname === pattern || hostname.endsWith(`.${pattern}`);
    }

    if (patternType === 'exact') {
      return url === urlPattern;
    }

    if (patternType === 'wildcard') {
      // Convert wildcard pattern (* and ?) to a regex
      const escaped = urlPattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      const regex = new RegExp(`^${escaped}$`);
      return regex.test(url);
    }
  } catch {
    return false;
  }

  return false;
}

export async function getSnippetsForUrl(url: string): Promise<CssSnippet[]> {
  const snippets = await getSnippets();
  return snippets.filter((s) => s.enabled && matchesUrl(s, url));
}
