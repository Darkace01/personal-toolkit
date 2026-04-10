export interface Theme {
  id: string;
  name: string;
  description: string;
  cssVariables: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: 'dark-pro',
    name: 'Dark Pro',
    description: 'GitHub Dark Pro - the default dark theme with deep blue-gray tones',
    cssVariables: {
      '--color-canvas-default': '#0d1117',
      '--color-canvas-subtle': '#161b22',
      '--color-canvas-inset': '#010409',
      '--color-canvas-overlay': '#1c2128',
      '--color-fg-default': '#e6edf3',
      '--color-fg-muted': '#8b949e',
      '--color-fg-subtle': '#6e7681',
      '--color-fg-on-emphasis': '#ffffff',
      '--color-accent-fg': '#58a6ff',
      '--color-accent-emphasis': '#1f6feb',
      '--color-accent-muted': 'rgba(56,139,253,0.4)',
      '--color-accent-subtle': 'rgba(56,139,253,0.15)',
      '--color-success-fg': '#3fb950',
      '--color-success-emphasis': '#238636',
      '--color-success-muted': 'rgba(46,160,67,0.4)',
      '--color-success-subtle': 'rgba(46,160,67,0.15)',
      '--color-attention-fg': '#d29922',
      '--color-attention-emphasis': '#9e6a03',
      '--color-danger-fg': '#f85149',
      '--color-danger-emphasis': '#da3633',
      '--color-done-fg': '#a371f7',
      '--color-done-emphasis': '#8957e5',
      '--color-sponsors-fg': '#db61a2',
      '--color-border-default': '#30363d',
      '--color-border-muted': '#21262d',
      '--color-neutral-emphasis': '#6e7681',
      '--color-header-bg': '#161b22',
      '--color-header-logo': '#e6edf3',
      '--color-header-search-bg': '#0d1117',
      '--color-header-search-border': '#30363d',
      '--color-btn-bg': '#21262d',
      '--color-btn-text': '#c9d1d9',
      '--color-btn-primary-bg': '#238636',
      '--color-btn-primary-text': '#ffffff',
      '--color-input-bg': '#0d1117',
      '--color-input-border': '#30363d',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dracula - the iconic dark theme with vibrant purple and pink accents',
    cssVariables: {
      '--color-canvas-default': '#282a36',
      '--color-canvas-subtle': '#343746',
      '--color-canvas-inset': '#1e1f29',
      '--color-canvas-overlay': '#3d3f4f',
      '--color-fg-default': '#f8f8f2',
      '--color-fg-muted': '#6272a4',
      '--color-fg-subtle': '#4f5472',
      '--color-fg-on-emphasis': '#f8f8f2',
      '--color-accent-fg': '#8be9fd',
      '--color-accent-emphasis': '#50fa7b',
      '--color-accent-muted': 'rgba(139,233,253,0.4)',
      '--color-accent-subtle': 'rgba(139,233,253,0.15)',
      '--color-success-fg': '#50fa7b',
      '--color-success-emphasis': '#23d160',
      '--color-success-muted': 'rgba(80,250,123,0.4)',
      '--color-success-subtle': 'rgba(80,250,123,0.15)',
      '--color-attention-fg': '#f1fa8c',
      '--color-attention-emphasis': '#e6db74',
      '--color-danger-fg': '#ff5555',
      '--color-danger-emphasis': '#cc0000',
      '--color-done-fg': '#bd93f9',
      '--color-done-emphasis': '#9d5fd4',
      '--color-sponsors-fg': '#ff79c6',
      '--color-border-default': '#44475a',
      '--color-border-muted': '#3a3c4e',
      '--color-neutral-emphasis': '#6272a4',
      '--color-header-bg': '#21222c',
      '--color-header-logo': '#f8f8f2',
      '--color-header-search-bg': '#282a36',
      '--color-header-search-border': '#44475a',
      '--color-btn-bg': '#44475a',
      '--color-btn-text': '#f8f8f2',
      '--color-btn-primary-bg': '#50fa7b',
      '--color-btn-primary-text': '#282a36',
      '--color-input-bg': '#1e1f29',
      '--color-input-border': '#44475a',
    },
  },
  {
    id: 'solarized',
    name: 'Solarized Dark',
    description: 'Solarized Dark - carefully designed with precision color relationships',
    cssVariables: {
      '--color-canvas-default': '#002b36',
      '--color-canvas-subtle': '#073642',
      '--color-canvas-inset': '#00212b',
      '--color-canvas-overlay': '#0d3b47',
      '--color-fg-default': '#839496',
      '--color-fg-muted': '#657b83',
      '--color-fg-subtle': '#586e75',
      '--color-fg-on-emphasis': '#fdf6e3',
      '--color-accent-fg': '#268bd2',
      '--color-accent-emphasis': '#1a6ea8',
      '--color-accent-muted': 'rgba(38,139,210,0.4)',
      '--color-accent-subtle': 'rgba(38,139,210,0.15)',
      '--color-success-fg': '#859900',
      '--color-success-emphasis': '#687a00',
      '--color-success-muted': 'rgba(133,153,0,0.4)',
      '--color-success-subtle': 'rgba(133,153,0,0.15)',
      '--color-attention-fg': '#b58900',
      '--color-attention-emphasis': '#906d00',
      '--color-danger-fg': '#dc322f',
      '--color-danger-emphasis': '#b02725',
      '--color-done-fg': '#6c71c4',
      '--color-done-emphasis': '#4f55a0',
      '--color-sponsors-fg': '#d33682',
      '--color-border-default': '#073642',
      '--color-border-muted': '#00212b',
      '--color-neutral-emphasis': '#657b83',
      '--color-header-bg': '#073642',
      '--color-header-logo': '#839496',
      '--color-header-search-bg': '#002b36',
      '--color-header-search-border': '#073642',
      '--color-btn-bg': '#073642',
      '--color-btn-text': '#93a1a1',
      '--color-btn-primary-bg': '#859900',
      '--color-btn-primary-text': '#fdf6e3',
      '--color-input-bg': '#00212b',
      '--color-input-border': '#073642',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Nord - an arctic, north-bluish color palette with a clean aesthetic',
    cssVariables: {
      '--color-canvas-default': '#2e3440',
      '--color-canvas-subtle': '#3b4252',
      '--color-canvas-inset': '#242933',
      '--color-canvas-overlay': '#434c5e',
      '--color-fg-default': '#d8dee9',
      '--color-fg-muted': '#81a1c1',
      '--color-fg-subtle': '#4c566a',
      '--color-fg-on-emphasis': '#eceff4',
      '--color-accent-fg': '#81a1c1',
      '--color-accent-emphasis': '#5e81ac',
      '--color-accent-muted': 'rgba(129,161,193,0.4)',
      '--color-accent-subtle': 'rgba(129,161,193,0.15)',
      '--color-success-fg': '#a3be8c',
      '--color-success-emphasis': '#82a06d',
      '--color-success-muted': 'rgba(163,190,140,0.4)',
      '--color-success-subtle': 'rgba(163,190,140,0.15)',
      '--color-attention-fg': '#ebcb8b',
      '--color-attention-emphasis': '#c9a86c',
      '--color-danger-fg': '#bf616a',
      '--color-danger-emphasis': '#9a4e55',
      '--color-done-fg': '#b48ead',
      '--color-done-emphasis': '#9271a0',
      '--color-sponsors-fg': '#b48ead',
      '--color-border-default': '#4c566a',
      '--color-border-muted': '#3b4252',
      '--color-neutral-emphasis': '#4c566a',
      '--color-header-bg': '#3b4252',
      '--color-header-logo': '#d8dee9',
      '--color-header-search-bg': '#2e3440',
      '--color-header-search-border': '#4c566a',
      '--color-btn-bg': '#434c5e',
      '--color-btn-text': '#d8dee9',
      '--color-btn-primary-bg': '#5e81ac',
      '--color-btn-primary-text': '#eceff4',
      '--color-input-bg': '#242933',
      '--color-input-border': '#4c566a',
    },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    description: 'Catppuccin Mocha - a soothing pastel dark theme for comfortable coding',
    cssVariables: {
      '--color-canvas-default': '#1e1e2e',
      '--color-canvas-subtle': '#313244',
      '--color-canvas-inset': '#181825',
      '--color-canvas-overlay': '#45475a',
      '--color-fg-default': '#cdd6f4',
      '--color-fg-muted': '#a6adc8',
      '--color-fg-subtle': '#7f849c',
      '--color-fg-on-emphasis': '#cdd6f4',
      '--color-accent-fg': '#89b4fa',
      '--color-accent-emphasis': '#7aa2f7',
      '--color-accent-muted': 'rgba(137,180,250,0.4)',
      '--color-accent-subtle': 'rgba(137,180,250,0.15)',
      '--color-success-fg': '#a6e3a1',
      '--color-success-emphasis': '#89dc7b',
      '--color-success-muted': 'rgba(166,227,161,0.4)',
      '--color-success-subtle': 'rgba(166,227,161,0.15)',
      '--color-attention-fg': '#f9e2af',
      '--color-attention-emphasis': '#f7d08a',
      '--color-danger-fg': '#f38ba8',
      '--color-danger-emphasis': '#ee7598',
      '--color-done-fg': '#cba6f7',
      '--color-done-emphasis': '#b989f5',
      '--color-sponsors-fg': '#f5c2e7',
      '--color-border-default': '#45475a',
      '--color-border-muted': '#313244',
      '--color-neutral-emphasis': '#7f849c',
      '--color-header-bg': '#181825',
      '--color-header-logo': '#cdd6f4',
      '--color-header-search-bg': '#1e1e2e',
      '--color-header-search-border': '#45475a',
      '--color-btn-bg': '#313244',
      '--color-btn-text': '#cdd6f4',
      '--color-btn-primary-bg': '#89b4fa',
      '--color-btn-primary-text': '#1e1e2e',
      '--color-input-bg': '#181825',
      '--color-input-border': '#45475a',
    },
  },
];

export function getThemes(): Theme[] {
  return THEMES;
}

export function getThemeById(id: string): Theme | undefined {
  return THEMES.find((t) => t.id === id);
}

export function buildThemeCss(theme: Theme): string {
  const declarations = Object.entries(theme.cssVariables)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');
  return `:root {\n${declarations}\n}`;
}

export function isGitHubUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'github.com' || parsed.hostname.endsWith('.github.com');
  } catch {
    return false;
  }
}

export async function getActiveTheme(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['activeTheme'], (result) => {
      resolve(result.activeTheme ?? null);
    });
  });
}

export async function setActiveTheme(themeId: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ activeTheme: themeId }, () => {
      resolve();
    });
  });
}
