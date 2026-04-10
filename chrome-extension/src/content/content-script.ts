import {
  getActiveTheme,
  getThemeById,
  buildThemeCss,
  isGitHubUrl,
} from '../themes/themes.js';
import { getSnippetsForUrl } from '../snippets/snippet-manager.js';

const THEME_STYLE_ID = 'personal-toolkit-github-theme';
const SNIPPETS_STYLE_ID = 'personal-toolkit-css-snippets';

function injectStyle(id: string, css: string): void {
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    (document.head ?? document.documentElement).appendChild(el);
  }
  el.textContent = css;
}

function removeStyle(id: string): void {
  document.getElementById(id)?.remove();
}

async function applyGitHubTheme(): Promise<void> {
  if (!isGitHubUrl(location.href)) {
    removeStyle(THEME_STYLE_ID);
    return;
  }
  const themeId = await getActiveTheme();
  if (!themeId) {
    removeStyle(THEME_STYLE_ID);
    return;
  }
  const theme = getThemeById(themeId);
  if (!theme) {
    removeStyle(THEME_STYLE_ID);
    return;
  }
  injectStyle(THEME_STYLE_ID, buildThemeCss(theme));
}

async function applySnippets(): Promise<void> {
  const snippets = await getSnippetsForUrl(location.href);
  if (snippets.length === 0) {
    removeStyle(SNIPPETS_STYLE_ID);
    return;
  }
  const combined = snippets.map((s) => `/* ${s.name} */\n${s.css}`).join('\n\n');
  injectStyle(SNIPPETS_STYLE_ID, combined);
}

async function applyAll(): Promise<void> {
  await Promise.all([applyGitHubTheme(), applySnippets()]);
}

// Apply on initial load
applyAll();

// Listen for messages from popup / background to refresh styles
chrome.runtime.onMessage.addListener((message: unknown) => {
  const msg = message as { type?: string };
  if (
    msg.type === 'THEME_CHANGED' ||
    msg.type === 'SNIPPET_CHANGED' ||
    msg.type === 'REFRESH_STYLES'
  ) {
    applyAll();
  }
});
