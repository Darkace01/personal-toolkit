/**
 * Generates a cryptographically secure random secret.
 * @param bytes The number of random bytes to generate.
 * @param format The output format ('hex', 'base64', or 'base64url').
 */
export function generateSecret(bytes: number, format: 'hex' | 'base64' | 'base64url'): string {
  const array = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(array);

  if (format === 'hex') {
    return Array.from(array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  const binary = Array.from(array, (b) => String.fromCharCode(b)).join('');
  const base64 = btoa(binary);

  if (format === 'base64url') {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  return base64;
}

/**
 * Encodes arbitrary bytes (as string) to Base64.
 */
export function secretToBase64(secret: string): string {
  try {
    // If it's already hex, we might want to treat it as bytes
    if (/^[0-9a-fA-F]+$/.test(secret) && secret.length % 2 === 0) {
      const bytes = new Uint8Array(secret.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
      const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
      return btoa(binary);
    }
    // Otherwise treat as raw text
    const bytes = new TextEncoder().encode(secret);
    const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
    return btoa(binary);
  } catch {
    return btoa(secret);
  }
}
