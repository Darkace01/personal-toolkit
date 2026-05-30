import {
  calculateStrength,
  decodeBase64,
  decodeBase64Url,
  encodeBase64,
  encodeBase64Url,
  formatJson,
  generateMultiplePasswords,
  generateMultipleUuids,
  generatePassword,
  generateSecret,
  generateShareId,
  generateUuidV1,
  generateUuidV4,
  hashAll,
  isValidBase64,
  isValidUuid,
  minifyJson,
  secretToBase64,
  sortJsonKeys,
  validateJson,
  validateShareContent,
} from '@toolkit/shared';

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.tool-page');

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    const target = (item as HTMLElement).dataset.target;
    navItems.forEach((i) => {
      i.classList.remove('active');
    });
    item.classList.add('active');

    pages.forEach((page) => {
      page.classList.toggle('active', page.id === target);
    });
  });
});

// Helper: Copy to clipboard
async function copyToClipboard(text: string, element?: HTMLElement) {
  try {
    await navigator.clipboard.writeText(text);
    if (element) {
      const originalText = element.textContent;
      element.textContent = '✅ Copied!';
      setTimeout(() => {
        element.textContent = originalText;
      }, 1500);
    }
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

// --- Base64 ---
const b64Input = document.getElementById('b64-input') as HTMLTextAreaElement;
const b64Output = document.getElementById('b64-output') as HTMLTextAreaElement;
const b64Mode = document.getElementById('b64-mode') as HTMLSelectElement;
const b64ValidHint = document.getElementById('b64-valid-hint') as HTMLElement;

b64Input?.addEventListener('input', () => {
  const isValid = isValidBase64(b64Input.value);
  if (b64ValidHint) {
    b64ValidHint.style.display = b64Input.value && isValid ? 'block' : 'none';
  }
});

document.getElementById('b64-encode')?.addEventListener('click', () => {
  const mode = b64Mode.value;
  b64Output.value = mode === 'url' ? encodeBase64Url(b64Input.value) : encodeBase64(b64Input.value);
});

document.getElementById('b64-decode')?.addEventListener('click', () => {
  try {
    const mode = b64Mode.value;
    b64Output.value =
      mode === 'url' ? decodeBase64Url(b64Input.value) : decodeBase64(b64Input.value);
  } catch (e) {
    b64Output.value = `Error: ${(e as Error).message}`;
  }
});

document.getElementById('b64-copy')?.addEventListener('click', (e) => {
  copyToClipboard(b64Output.value, e.target as HTMLElement);
});

// --- Hash Generator ---
const hashInput = document.getElementById('hash-input') as HTMLTextAreaElement;
const hashResults = document.getElementById('hash-results') as HTMLElement;

document.getElementById('hash-generate')?.addEventListener('click', () => {
  if (!hashInput.value) return;
  const hashes = hashAll(hashInput.value);
  (document.getElementById('hash-md5') as HTMLInputElement).value = hashes.md5;
  (document.getElementById('hash-sha1') as HTMLInputElement).value = hashes.sha1;
  (document.getElementById('hash-sha256') as HTMLInputElement).value = hashes.sha256;
  (document.getElementById('hash-sha512') as HTMLInputElement).value = hashes.sha512;
  hashResults.style.display = 'block';
});

document.querySelectorAll('#hash .copy-link').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const id = (btn as HTMLElement).dataset.copy;
    if (id) {
      const input = document.getElementById(id) as HTMLInputElement;
      copyToClipboard(input.value, e.target as HTMLElement);
    }
  });
});

// --- JSON Formatter ---
const jsonInput = document.getElementById('json-input') as HTMLTextAreaElement;
const jsonOutput = document.getElementById('json-output') as HTMLTextAreaElement;
const jsonHint = document.getElementById('json-valid-hint') as HTMLElement;

jsonInput?.addEventListener('input', () => {
  if (!jsonInput.value) {
    jsonHint.textContent = '';
    return;
  }
  const res = validateJson(jsonInput.value);
  jsonHint.textContent = res.valid ? '' : `❌ ${res.error}`;
  jsonHint.className = res.valid ? 'success' : 'error';
});

document.getElementById('json-format')?.addEventListener('click', () => {
  try {
    jsonOutput.value = formatJson(jsonInput.value);
  } catch (e) {
    jsonOutput.value = (e as Error).message;
  }
});

document.getElementById('json-minify')?.addEventListener('click', () => {
  try {
    jsonOutput.value = minifyJson(jsonInput.value);
  } catch (e) {
    jsonOutput.value = (e as Error).message;
  }
});

document.getElementById('json-sort')?.addEventListener('click', () => {
  try {
    jsonOutput.value = sortJsonKeys(jsonInput.value);
  } catch (e) {
    jsonOutput.value = (e as Error).message;
  }
});

document.getElementById('json-copy')?.addEventListener('click', (e) => {
  copyToClipboard(jsonOutput.value, e.target as HTMLElement);
});

// --- Password Generator ---
const passDisplay = document.getElementById('pass-display') as HTMLElement;
const passLength = document.getElementById('pass-length') as HTMLInputElement;
const passLengthVal = document.getElementById('pass-length-val') as HTMLElement;
const passStrengthBar = document.getElementById('pass-strength-bar') as HTMLElement;
const passStrengthLabel = document.getElementById('pass-strength-label') as HTMLElement;
const passBulkContainer = document.getElementById('pass-bulk-container') as HTMLElement;

const getPassOptions = () => ({
  length: parseInt(passLength.value, 10),
  includeUppercase: (document.getElementById('pass-upper') as HTMLInputElement).checked,
  includeLowercase: (document.getElementById('pass-lower') as HTMLInputElement).checked,
  includeNumbers: (document.getElementById('pass-nums') as HTMLInputElement).checked,
  includeSymbols: (document.getElementById('pass-syms') as HTMLInputElement).checked,
  excludeAmbiguous: (document.getElementById('pass-ambig') as HTMLInputElement).checked,
});

const updateStrength = (pwd: string) => {
  const strength = calculateStrength(pwd);
  const colors = ['#f85149', '#f69d50', '#d29922', '#3fb950', '#238636'];
  passStrengthBar.style.width = `${(strength.score + 1) * 20}%`;
  passStrengthBar.style.background = colors[strength.score];
  passStrengthLabel.textContent = strength.label.replace('-', ' ');
};

const refreshPass = () => {
  const pwd = generatePassword(getPassOptions());
  passDisplay.textContent = pwd;
  updateStrength(pwd);
};

passLength.addEventListener('input', () => {
  passLengthVal.textContent = passLength.value;
  refreshPass();
});

['pass-upper', 'pass-lower', 'pass-nums', 'pass-syms', 'pass-ambig'].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', refreshPass);
});

document.getElementById('pass-gen')?.addEventListener('click', refreshPass);
document.getElementById('pass-copy')?.addEventListener('click', (e) => {
  copyToClipboard(passDisplay.textContent || '', e.target as HTMLElement);
});

document.getElementById('pass-bulk')?.addEventListener('click', () => {
  const passwords = generateMultiplePasswords(getPassOptions(), 10);
  passBulkContainer.innerHTML = '';
  passBulkContainer.style.display = 'block';
  passwords.forEach((p) => {
    const item = document.createElement('div');
    item.className = 'bulk-item';
    item.innerHTML = `<code>${p}</code> <span class="copy-link">Copy</span>`;
    item
      .querySelector('.copy-link')
      ?.addEventListener('click', (e) => copyToClipboard(p, e.target as HTMLElement));
    passBulkContainer.appendChild(item);
  });
});

// Initial password
refreshPass();

// --- Secrets Generator ---
const secretDisplay = document.getElementById('secret-display') as HTMLElement;
const secretLength = document.getElementById('secret-length') as HTMLInputElement;
const secretLengthVal = document.getElementById('secret-length-val') as HTMLElement;
const secretFormat = document.getElementById('secret-format') as HTMLSelectElement;
const secretConvInput = document.getElementById('secret-conv-input') as HTMLTextAreaElement;
const secretConvOutput = document.getElementById('secret-conv-output') as HTMLTextAreaElement;

const refreshSecret = () => {
  const bytes = parseInt(secretLength.value, 10);
  const format = secretFormat.value as 'hex' | 'base64' | 'base64url';
  secretDisplay.textContent = generateSecret(bytes, format);
};

secretLength.addEventListener('input', () => {
  secretLengthVal.textContent = secretLength.value;
  refreshSecret();
});

secretFormat.addEventListener('change', refreshSecret);

document.getElementById('secret-gen')?.addEventListener('click', refreshSecret);
document.getElementById('secret-copy')?.addEventListener('click', (e) => {
  copyToClipboard(secretDisplay.textContent || '', e.target as HTMLElement);
});

document.getElementById('secret-to-b64')?.addEventListener('click', () => {
  try {
    secretConvOutput.value = secretToBase64(secretConvInput.value);
  } catch (e) {
    secretConvOutput.value = `Error: ${(e as Error).message}`;
  }
});

document.getElementById('secret-from-b64')?.addEventListener('click', () => {
  try {
    secretConvOutput.value = decodeBase64(secretConvInput.value);
  } catch (e) {
    secretConvOutput.value = `Error: ${(e as Error).message}`;
  }
});

document.getElementById('secret-conv-copy')?.addEventListener('click', (e) => {
  copyToClipboard(secretConvOutput.value, e.target as HTMLElement);
});

refreshSecret();

// --- UUID Generator ---
const uuidDisplay = document.getElementById('uuid-display') as HTMLElement;
const uuidVersion = document.getElementById('uuid-version') as HTMLSelectElement;
const uuidBulkContainer = document.getElementById('uuid-bulk-container') as HTMLElement;
const uuidValidateInput = document.getElementById('uuid-validate-input') as HTMLInputElement;
const uuidValidateHint = document.getElementById('uuid-validate-hint') as HTMLElement;

const refreshUuid = () => {
  uuidDisplay.textContent = uuidVersion.value === 'v4' ? generateUuidV4() : generateUuidV1();
};

document.getElementById('uuid-gen')?.addEventListener('click', refreshUuid);
document.getElementById('uuid-copy')?.addEventListener('click', (e) => {
  copyToClipboard(uuidDisplay.textContent || '', e.target as HTMLElement);
});

document.getElementById('uuid-bulk')?.addEventListener('click', () => {
  const uuids = generateMultipleUuids(uuidVersion.value as 'v1' | 'v4', 10);
  uuidBulkContainer.innerHTML = '';
  uuidBulkContainer.style.display = 'block';
  uuids.forEach((u) => {
    const item = document.createElement('div');
    item.className = 'bulk-item';
    item.innerHTML = `<code>${u}</code> <span class="copy-link">Copy</span>`;
    item
      .querySelector('.copy-link')
      ?.addEventListener('click', (e) => copyToClipboard(u, e.target as HTMLElement));
    uuidBulkContainer.appendChild(item);
  });
});

uuidValidateInput.addEventListener('input', () => {
  if (!uuidValidateInput.value) {
    uuidValidateHint.textContent = '';
    return;
  }
  const valid = isValidUuid(uuidValidateInput.value);
  uuidValidateHint.textContent = valid ? '✅ Valid UUID' : '❌ Invalid UUID';
  uuidValidateHint.className = valid ? 'success' : 'error';
});

refreshUuid();

// --- Text Share ---
const shareContent = document.getElementById('share-content') as HTMLTextAreaElement;
const shareResult = document.getElementById('share-result') as HTMLElement;
const shareIdDisplay = document.getElementById('share-id-display') as HTMLElement;
const shareError = document.getElementById('share-error') as HTMLElement;

document.getElementById('share-create')?.addEventListener('click', () => {
  const content = shareContent.value;
  const validation = validateShareContent(content);
  if (!validation.valid) {
    shareError.textContent = validation.error || 'Invalid content';
    return;
  }
  shareError.textContent = '';
  const id = generateShareId();
  shareIdDisplay.textContent = id;
  shareResult.style.display = 'block';
});
