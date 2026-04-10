import { setActiveTheme } from '../themes/themes.js';

const DEFAULT_THEME = 'dark-pro';

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Set default theme on first install
    await setActiveTheme(DEFAULT_THEME);
  }
});

chrome.runtime.onMessage.addListener(
  (message: unknown, _sender, sendResponse: (response?: unknown) => void) => {
    const msg = message as { type?: string; themeId?: string };

    if (msg.type === 'SET_THEME' && msg.themeId) {
      setActiveTheme(msg.themeId).then(() => {
        broadcastToAllTabs({ type: 'THEME_CHANGED' });
        sendResponse({ success: true });
      });
      return true; // keep message channel open for async response
    }

    if (msg.type === 'SNIPPET_CHANGED') {
      broadcastToAllTabs({ type: 'SNIPPET_CHANGED' });
      sendResponse({ success: true });
    }

    return false;
  },
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { type: 'REFRESH_STYLES' }).catch(() => {
      // Tab may not have the content script; ignore errors
    });
  }
});

function broadcastToAllTabs(message: unknown): void {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id != null) {
        chrome.tabs.sendMessage(tab.id, message).catch(() => {
          // Ignore tabs that cannot receive messages
        });
      }
    }
  });
}
