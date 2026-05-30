import CryptoJS from 'crypto-js';

export function hashMd5(input: string): string {
  return CryptoJS.MD5(input).toString(CryptoJS.enc.Hex);
}

export function hashSha1(input: string): string {
  return CryptoJS.SHA1(input).toString(CryptoJS.enc.Hex);
}

export function hashSha256(input: string): string {
  return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}

export function hashSha512(input: string): string {
  return CryptoJS.SHA512(input).toString(CryptoJS.enc.Hex);
}

export function hashAll(input: string): Record<string, string> {
  return {
    md5: hashMd5(input),
    sha1: hashSha1(input),
    sha256: hashSha256(input),
    sha512: hashSha512(input),
  };
}
