import {
  type CssSnippet,
  deleteSnippet,
  getSnippets,
  saveSnippet,
  toggleSnippet,
  updateSnippet,
} from '../snippets/snippet-manager.js';
import {
  deleteCustomTheme,
  getCustomThemes,
  getThemes,
  saveCustomTheme,
  type Theme,
} from '../themes/themes.js';

let editingId: string | null = null;

const $ = <T extends Element>(sel: string): T => {
  const el = document.querySelector<T>(sel);
  if (!el) throw new Error(`Element not found: ${sel}`);
  return el;
};

const modal = $('#modal-overlay');
const modalTitle = $('#modal-title');
const fName = $<HTMLInputElement>('#f-name');
const fDesc = $<HTMLInputElement>('#f-desc');
const fPatternType = $<HTMLSelectElement>('#f-pattern-type');
const fPatternGroup = $<HTMLElement>('#f-pattern-group');
const fPattern = $<HTMLInputElement>('#f-pattern');
const fCss = $<HTMLTextAreaElement>('#f-css');

let editingThemeId: string | null = null;
const themeModal = $('#theme-modal-overlay');
const themeModalTitle = $('#theme-modal-title');
const tName = $<HTMLInputElement>('#t-name');
const tDesc = $<HTMLInputElement>('#t-desc');
const tBase = $<HTMLSelectElement>('#t-base');
const tCssVars = $<HTMLTextAreaElement>('#t-css-vars');

function openModal(snippet?: CssSnippet): void {
  editingId = snippet?.id ?? null;
  modalTitle.textContent = snippet ? 'Edit CSS Snippet' : 'Add CSS Snippet';
  fName.value = snippet?.name ?? '';
  fDesc.value = snippet?.description ?? '';
  fPatternType.value = snippet?.patternType ?? 'all';
  fPattern.value = snippet?.urlPattern ?? '';
  fCss.value = snippet?.css ?? '';
  updatePatternVisibility();
  modal.classList.add('open');
}

function closeModal(): void {
  modal.classList.remove('open');
  editingId = null;
}

function updatePatternVisibility(): void {
  const type = fPatternType.value;
  fPatternGroup.style.display = type === 'all' ? 'none' : 'flex';
}

fPatternType.addEventListener('change', updatePatternVisibility);

$('#add-snippet-btn').addEventListener('click', () => openModal());
$('#modal-cancel').addEventListener('click', closeModal);

async function openThemeModal(theme?: Theme): Promise<void> {
  editingThemeId = theme?.id ?? null;
  themeModalTitle.textContent = theme ? 'Edit Custom Theme' : 'Create Custom Theme';
  tName.value = theme?.name ?? '';
  tDesc.value = theme?.description ?? '';
  tCssVars.value = '';

  if (theme) {
    tCssVars.value = Object.entries(theme.cssVariables)
      .map(([k, v]) => `${k}: ${v};`)
      .join('\n');
  }

  // Populate base themes
  const allThemes = await getThemes();
  tBase.innerHTML = '<option value="">-- Start from scratch --</option>';
  for (const t of allThemes) {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.name} ${t.isCustom ? '(Custom)' : ''}`;
    tBase.appendChild(opt);
  }

  themeModal.classList.add('open');
}

function closeThemeModal(): void {
  themeModal.classList.remove('open');
  editingThemeId = null;
}

$('#add-theme-btn').addEventListener('click', () => openThemeModal());
$('#theme-modal-cancel').addEventListener('click', closeThemeModal);

tBase.addEventListener('change', async () => {
  const baseId = tBase.value;
  if (!baseId) return;
  const allThemes = await getThemes();
  const base = allThemes.find((t) => t.id === baseId);
  if (base) {
    tCssVars.value = Object.entries(base.cssVariables)
      .map(([k, v]) => `${k}: ${v};`)
      .join('\n');
  }
});

$('#modal-save').addEventListener('click', async () => {
  const name = fName.value.trim();
  if (!name) {
    fName.focus();
    return;
  }
  const patternType = fPatternType.value as CssSnippet['patternType'];
  const urlPattern = patternType === 'all' ? '*' : fPattern.value.trim();

  if (editingId) {
    await updateSnippet(editingId, {
      name,
      description: fDesc.value.trim(),
      patternType,
      urlPattern,
      css: fCss.value,
    });
  } else {
    await saveSnippet({
      name,
      description: fDesc.value.trim(),
      patternType,
      urlPattern,
      css: fCss.value,
      enabled: true,
    });
  }

  chrome.runtime.sendMessage({ type: 'SNIPPET_CHANGED' }).catch(() => {});
  closeModal();
  await renderSnippets();
});

$('#theme-modal-save').addEventListener('click', async () => {
  const name = tName.value.trim();
  if (!name) {
    tName.focus();
    return;
  }
  const cssVariables: Record<string, string> = {};
  tCssVars.value.split(';').forEach((line) => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      if (key && val) {
        cssVariables[key] = val;
      }
    }
  });

  const id = editingThemeId || `custom_${Date.now()}`;
  await saveCustomTheme({
    id,
    name,
    description: tDesc.value.trim(),
    cssVariables,
    isCustom: true,
  });

  chrome.runtime.sendMessage({ type: 'THEME_CHANGED' }).catch(() => {});
  closeThemeModal();
  await renderThemes();
});

async function renderSnippets(): Promise<void> {
  const snippets = await getSnippets();
  const list = $('#snippet-list');
  const emptyState = $<HTMLElement>('#empty-state');

  // Remove existing cards
  for (const el of Array.from(list.querySelectorAll('.snippet-card'))) {
    el.remove();
  }

  if (snippets.length === 0) {
    emptyState.style.display = '';
    return;
  }
  emptyState.style.display = 'none';

  for (const snippet of snippets) {
    const card = document.createElement('div');
    card.className = 'snippet-card';
    card.innerHTML = `
      <div class="snippet-header">
        <span class="snippet-name">${escapeHtml(snippet.name)}</span>
        <span class="badge ${snippet.enabled ? 'enabled' : ''}">${snippet.enabled ? 'Enabled' : 'Disabled'}</span>
        <span class="badge">${snippet.patternType === 'all' ? 'All URLs' : escapeHtml(snippet.urlPattern)}</span>
      </div>
      ${snippet.description ? `<div class="snippet-meta">${escapeHtml(snippet.description)}</div>` : ''}
      <div class="snippet-actions">
        <button class="btn" data-action="toggle" data-id="${snippet.id}">${snippet.enabled ? 'Disable' : 'Enable'}</button>
        <button class="btn" data-action="edit" data-id="${snippet.id}">Edit</button>
        <button class="btn btn-danger" data-action="delete" data-id="${snippet.id}">Delete</button>
      </div>
    `;
    list.appendChild(card);
  }

  // Event delegation for snippet actions
  list.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const { action, id } = btn.dataset as { action: string; id: string };
      if (action === 'toggle') {
        await toggleSnippet(id);
        chrome.runtime.sendMessage({ type: 'SNIPPET_CHANGED' }).catch(() => {});
        await renderSnippets();
      } else if (action === 'edit') {
        const snippets = await getSnippets();
        const snippet = snippets.find((s) => s.id === id);
        if (snippet) openModal(snippet);
      } else if (action === 'delete') {
        if (
          confirm(
            `Delete snippet "${btn.closest('.snippet-card')?.querySelector('.snippet-name')?.textContent}"?`,
          )
        ) {
          await deleteSnippet(id);
          chrome.runtime.sendMessage({ type: 'SNIPPET_CHANGED' }).catch(() => {});
          await renderSnippets();
        }
      }
    });
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function renderThemes(): Promise<void> {
  const customThemes = await getCustomThemes();
  const list = $('#theme-list');
  const emptyState = $<HTMLElement>('#empty-theme-state');

  for (const el of Array.from(list.querySelectorAll('.snippet-card'))) {
    el.remove();
  }

  if (customThemes.length === 0) {
    emptyState.style.display = '';
    return;
  }
  emptyState.style.display = 'none';

  for (const theme of customThemes) {
    const card = document.createElement('div');
    card.className = 'snippet-card';
    card.innerHTML = `
      <div class="snippet-header">
        <span class="snippet-name">${escapeHtml(theme.name)}</span>
        <span class="badge">Custom</span>
      </div>
      ${theme.description ? `<div class="snippet-meta">${escapeHtml(theme.description)}</div>` : ''}
      <div class="snippet-actions">
        <button class="btn" data-theme-action="edit" data-id="${theme.id}">Edit</button>
        <button class="btn btn-danger" data-theme-action="delete" data-id="${theme.id}">Delete</button>
      </div>
    `;
    list.appendChild(card);
  }

  list.querySelectorAll<HTMLButtonElement>('[data-theme-action]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const { themeAction: action, id } = btn.dataset as { themeAction: string; id: string };
      if (action === 'edit') {
        const themes = await getCustomThemes();
        const theme = themes.find((t) => t.id === id);
        if (theme) openThemeModal(theme);
      } else if (action === 'delete') {
        if (confirm('Delete this custom theme?')) {
          await deleteCustomTheme(id);
          chrome.runtime.sendMessage({ type: 'THEME_CHANGED' }).catch(() => {});
          await renderThemes();
        }
      }
    });
  });
}

renderSnippets();
renderThemes();
