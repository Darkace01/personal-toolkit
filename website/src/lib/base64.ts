export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''));
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
  // Standard base64: A-Z, a-z, 0-9, +, /, and optional = padding
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) return false;
  // Length must be a multiple of 4
  if (str.length % 4 !== 0) return false;
  try {
    atob(str);
    return true;
  } catch {
    return false;
  }
}

export function encodeBase64Url(text: string): string {
  return encodeBase64(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodeBase64Url(encoded: string): string {
  // Re-add padding
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  const padded2 = pad ? padded + '='.repeat(4 - pad) : padded;
  return decodeBase64(padded2);
}
