export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decodeBase64(encoded: string): string {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function isValidBase64(str: string): boolean {
  if (!str || str.length === 0) return false;
  try {
    // Check if it's a valid atob input (ignoring whitespace)
    const normalized = str.replace(/\s/g, '');
    if (normalized.length % 4 !== 0) return false;
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) return false;
    atob(normalized);
    return true;
  } catch {
    return false;
  }
}

export function encodeBase64Url(text: string): string {
  return encodeBase64(text)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function decodeBase64Url(encoded: string): string {
  // Re-add padding
  let padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  if (pad) {
    if (pad === 1) throw new Error('Invalid Base64Url string');
    padded += '='.repeat(4 - pad);
  }
  return decodeBase64(padded);
}
