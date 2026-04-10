import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function generateUuidV4(): string {
  return uuidv4();
}

export function generateUuidV1(): string {
  return uuidv1();
}

export function generateMultipleUuids(version: 'v1' | 'v4', count: number): string[] {
  return Array.from({ length: count }, () =>
    version === 'v1' ? generateUuidV1() : generateUuidV4(),
  );
}

export function isValidUuid(str: string): boolean {
  return UUID_REGEX.test(str);
}

export function formatUuid(uuid: string): string {
  return uuid.toLowerCase();
}
