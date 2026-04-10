import {
  getSnippets,
  saveSnippet,
  updateSnippet,
  deleteSnippet,
  toggleSnippet,
  type CssSnippet,
} from '../snippets/snippet-manager.js';

let editingId: string | null = null;

const $ = <T extends Element>(sel: string) => document.querySelector<T>(sel)!;

const modal = $('#modal-overlay');
const modalTitle = $('#modal-title');
const fName = $<HTMLInputElement>('#f-name');
const fDesc = $<HTMLInputElement>('#f-desc');
const fPatternType = $<HTMLSelectElement>('#f-pattern-type');
const fPatternGroup = $('#f-pattern-group');
const fPattern = $<HTMLInputElement>('#f-pattern');
const fCss = $<HTMLTextAreaElement>('#f-css');

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

async function renderSnippets(): Promise<void> {
  const snippets = await getSnippets();
  const list = $('#snippet-list');
  const emptyState = $('#empty-state');

  // Remove existing cards
  list.querySelectorAll('.snippet-card').forEach((el) => el.remove());

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
        if (confirm(`Delete snippet "${btn.closest('.snippet-card')?.querySelector('.snippet-name')?.textContent}"?`)) {
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

renderSnippets();
