export interface TextShare {
  id: string;
  content: string;
  title?: string;
  expiresAt?: Date;
  accessCount: number;
  maxAccess?: number;
  createdAt: Date;
  isEncrypted: boolean;
  burnAfterRead: boolean;
}

const SHARE_ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SHARE_ID_LENGTH = 10;
const MAX_CONTENT_LENGTH = 100_000;

function secureRandInt(max: number): number {
  const limit = 4294967296 - (4294967296 % max);
  let value: number;
  do {
    const array = new Uint32Array(1);
    globalThis.crypto.getRandomValues(array);
    value = array[0];
  } while (value >= limit);
  return value % max;
}

export function generateShareId(): string {
  return Array.from(
    { length: SHARE_ID_LENGTH },
    () => SHARE_ID_CHARS[secureRandInt(SHARE_ID_CHARS.length)],
  ).join('');
}

export function isExpired(share: TextShare): boolean {
  if (!share.expiresAt) return false;
  return new Date() > share.expiresAt;
}

export function hasReachedMaxAccess(share: TextShare): boolean {
  if (share.maxAccess == null) return false;
  return share.accessCount >= share.maxAccess;
}

export function maskContent(content: string, chars = 50): string {
  if (content.length <= chars) return content;
  return `${content.slice(0, chars)}...`;
}

export function validateShareContent(content: string): { valid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Content cannot be empty.' };
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return {
      valid: false,
      error: `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters.`,
    };
  }
  return { valid: true };
}
