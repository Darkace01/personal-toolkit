import { getThemes, getActiveTheme, setActiveTheme } from '../themes/themes.js';
import { getSnippets } from '../snippets/snippet-manager.js';

const THEME_DOTS: Record<string, string> = {
  'dark-pro': '#58a6ff',
  dracula: '#bd93f9',
  solarized: '#268bd2',
  nord: '#81a1c1',
  catppuccin: '#89b4fa',
};

async function init(): Promise<void> {
  const themes = getThemes();
  const activeId = await getActiveTheme();
  const snippets = await getSnippets();

  // Render theme list
  const list = document.getElementById('theme-list')!;
  for (const theme of themes) {
    const item = document.createElement('div');
    item.className = `theme-item${activeId === theme.id ? ' active' : ''}`;
    item.dataset['id'] = theme.id;
    item.innerHTML = `
      <span class="theme-dot" style="background:${THEME_DOTS[theme.id] ?? '#888'}"></span>
      <span class="theme-name">${theme.name}</span>
      ${activeId === theme.id ? '<span class="checkmark">✓</span>' : ''}
    `;
    item.addEventListener('click', () => selectTheme(theme.id));
    list.appendChild(item);
  }

  // Snippet count
  const countEl = document.getElementById('snippet-count')!;
  countEl.textContent = `${snippets.length} snippet${snippets.length !== 1 ? 's' : ''} configured`;

  // No-theme button
  document.getElementById('no-theme-btn')!.addEventListener('click', () => clearTheme());

  // Options button
  document.getElementById('options-btn')!.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

async function selectTheme(themeId: string): Promise<void> {
  await setActiveTheme(themeId);
  chrome.runtime.sendMessage({ type: 'SET_THEME', themeId });
  // Refresh active tab styles directly
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id != null) {
    chrome.tabs.sendMessage(tab.id, { type: 'THEME_CHANGED' }).catch(() => {});
  }
  window.close();
}

async function clearTheme(): Promise<void> {
  await chrome.storage.sync.set({ activeTheme: null });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id != null) {
    chrome.tabs.sendMessage(tab.id, { type: 'THEME_CHANGED' }).catch(() => {});
  }
  window.close();
}

init();
