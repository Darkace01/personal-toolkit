import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildThemeCss,
  getActiveTheme,
  getThemeById,
  getThemes,
  isGitHubUrl,
  setActiveTheme,
  THEMES,
  type Theme,
} from '../src/themes/themes';

describe('getThemes()', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementation(
      (_keys: string[], callback: (result: Record<string, unknown>) => void) => {
        callback({});
      },
    );
  });

  it('returns all 6 themes', async () => {
    const themes = await getThemes();
    expect(themes).toHaveLength(6);
  });

  it('returns an array of Theme objects', async () => {
    const themes = await getThemes();
    expect(Array.isArray(themes)).toBe(true);
  });

  it('includes dark-pro theme', async () => {
    const themes = await getThemes();
    expect(themes.some((t) => t.id === 'dark-pro')).toBe(true);
  });

  it('includes dracula theme', async () => {
    const themes = await getThemes();
    expect(themes.some((t) => t.id === 'dracula')).toBe(true);
  });

  it('includes solarized theme', async () => {
    const themes = await getThemes();
    expect(themes.some((t) => t.id === 'solarized')).toBe(true);
  });

  it('includes nord theme', async () => {
    const themes = await getThemes();
    expect(themes.some((t) => t.id === 'nord')).toBe(true);
  });

  it('includes catppuccin theme', async () => {
    const themes = await getThemes();
    expect(themes.some((t) => t.id === 'catppuccin')).toBe(true);
  });
});

describe('Each theme has required fields', () => {
  it.each(THEMES)('theme "$id" has all required fields', (theme: Theme) => {
    expect(typeof theme.id).toBe('string');
    expect(theme.id.length).toBeGreaterThan(0);

    expect(typeof theme.name).toBe('string');
    expect(theme.name.length).toBeGreaterThan(0);

    expect(typeof theme.description).toBe('string');
    expect(theme.description.length).toBeGreaterThan(0);

    expect(typeof theme.cssVariables).toBe('object');
    expect(theme.cssVariables).not.toBeNull();
  });

  it.each(THEMES)('theme "$id" has non-empty cssVariables', (theme: Theme) => {
    expect(Object.keys(theme.cssVariables).length).toBeGreaterThan(0);
  });

  it.each(
    THEMES,
  )('theme "$id" cssVariables keys are valid CSS custom properties', (theme: Theme) => {
    for (const key of Object.keys(theme.cssVariables)) {
      expect(key.startsWith('--')).toBe(true);
    }
  });

  it.each(THEMES)('theme "$id" has canvas-default and fg-default variables', (theme: Theme) => {
    expect(theme.cssVariables).toHaveProperty('--color-canvas-default');
    expect(theme.cssVariables).toHaveProperty('--color-fg-default');
  });
});

describe('getThemeById()', () => {
  it('finds dark-pro theme', async () => {
    const theme = await getThemeById('dark-pro');
    expect(theme).toBeDefined();
    expect(theme?.id).toBe('dark-pro');
    expect(theme?.name).toBe('Dark Pro');
  });

  it('finds dracula theme', async () => {
    const theme = await getThemeById('dracula');
    expect(theme).toBeDefined();
    expect(theme?.id).toBe('dracula');
  });

  it('finds solarized theme', async () => {
    const theme = await getThemeById('solarized');
    expect(theme).toBeDefined();
    expect(theme?.id).toBe('solarized');
  });

  it('finds nord theme', async () => {
    const theme = await getThemeById('nord');
    expect(theme).toBeDefined();
    expect(theme?.id).toBe('nord');
  });

  it('finds catppuccin theme', async () => {
    const theme = await getThemeById('catppuccin');
    expect(theme).toBeDefined();
    expect(theme?.id).toBe('catppuccin');
  });

  it('returns undefined for unknown id', async () => {
    expect(await getThemeById('nonexistent')).toBeUndefined();
  });

  it('returns undefined for empty string', async () => {
    expect(await getThemeById('')).toBeUndefined();
  });

  it('is case-sensitive', async () => {
    expect(await getThemeById('Dark-Pro')).toBeUndefined();
    expect(await getThemeById('DRACULA')).toBeUndefined();
  });
});

describe('buildThemeCss()', () => {
  it('generates a :root block', async () => {
    const theme = await getThemeById('dark-pro');
    expect(theme).toBeDefined();
    const css = buildThemeCss(theme as Theme);
    expect(css.trim().startsWith(':root {')).toBe(true);
    expect(css.trim().endsWith('}')).toBe(true);
  });

  it('includes all CSS variables from the theme', async () => {
    const theme = await getThemeById('dracula');
    expect(theme).toBeDefined();
    const css = buildThemeCss(theme as Theme);
    for (const [prop, value] of Object.entries((theme as Theme).cssVariables)) {
      expect(css).toContain(prop);
      expect(css).toContain(value);
    }
  });

  it('generates valid CSS variable declarations', async () => {
    const theme = await getThemeById('nord');
    expect(theme).toBeDefined();
    const css = buildThemeCss(theme as Theme);
    // Each variable should appear as "  --var-name: value;"
    const lines = css.split('\n').filter((l) => l.trim().startsWith('--'));
    expect(lines.length).toBe(Object.keys((theme as Theme).cssVariables).length);
    for (const line of lines) {
      expect(line).toMatch(/^\s+--[\w-]+:\s*.+;$/);
    }
  });

  it('handles catppuccin theme variables', async () => {
    const theme = await getThemeById('catppuccin');
    expect(theme).toBeDefined();
    const css = buildThemeCss(theme as Theme);
    expect(css).toContain('--color-canvas-default');
    expect(css).toContain('#1e1e2e');
  });

  it('handles solarized theme variables', async () => {
    const theme = await getThemeById('solarized');
    expect(theme).toBeDefined();
    const css = buildThemeCss(theme as Theme);
    expect(css).toContain('#002b36');
  });

  it('produces distinct CSS for each theme', async () => {
    const themes = await getThemes();
    const cssOutputs = themes.map((t) => buildThemeCss(t));
    const uniqueOutputs = new Set(cssOutputs);
    expect(uniqueOutputs.size).toBe(themes.length);
  });
});

describe('isGitHubUrl()', () => {
  it('returns true for https://github.com', () => {
    expect(isGitHubUrl('https://github.com')).toBe(true);
  });

  it('returns true for github.com repository pages', () => {
    expect(isGitHubUrl('https://github.com/user/repo')).toBe(true);
  });

  it('returns true for github.com with paths', () => {
    expect(isGitHubUrl('https://github.com/user/repo/pull/42')).toBe(true);
  });

  it('returns true for subdomains of github.com', () => {
    expect(isGitHubUrl('https://api.github.com')).toBe(true);
    expect(isGitHubUrl('https://gist.github.com')).toBe(true);
    expect(isGitHubUrl('https://docs.github.com')).toBe(true);
  });

  it('returns false for non-GitHub URLs', () => {
    expect(isGitHubUrl('https://gitlab.com')).toBe(false);
    expect(isGitHubUrl('https://google.com')).toBe(false);
    expect(isGitHubUrl('https://bitbucket.org')).toBe(false);
  });

  it('returns false for URLs that contain "github" but are not github.com', () => {
    expect(isGitHubUrl('https://notgithub.com')).toBe(false);
    expect(isGitHubUrl('https://github.example.com')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isGitHubUrl('')).toBe(false);
  });

  it('returns false for invalid URLs', () => {
    expect(isGitHubUrl('not-a-url')).toBe(false);
    expect(isGitHubUrl('javascript:void(0)')).toBe(false);
  });
});

describe('getActiveTheme()', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns the stored theme id', async () => {
    (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementation(
      (_keys: string[], callback: (result: Record<string, unknown>) => void) => {
        callback({ activeTheme: 'dracula' });
      },
    );
    const result = await getActiveTheme();
    expect(result).toBe('dracula');
  });

  it('returns null when no theme is set', async () => {
    (chrome.storage.sync.get as ReturnType<typeof vi.fn>).mockImplementation(
      (_keys: string[], callback: (result: Record<string, unknown>) => void) => {
        callback({});
      },
    );
    const result = await getActiveTheme();
    expect(result).toBeNull();
  });
});

describe('setActiveTheme()', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls chrome.storage.sync.set with the theme id', async () => {
    (chrome.storage.sync.set as ReturnType<typeof vi.fn>).mockImplementation(
      (_data: Record<string, unknown>, callback: () => void) => {
        callback();
      },
    );
    await setActiveTheme('nord');
    expect(chrome.storage.sync.set).toHaveBeenCalledWith(
      { activeTheme: 'nord' },
      expect.any(Function),
    );
  });
});
