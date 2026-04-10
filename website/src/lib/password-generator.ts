export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = 'l1Io0O';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  const required: string[] = [];

  const addSet = (set: string) => {
    const filtered = options.excludeAmbiguous
      ? set.split('').filter((c) => !AMBIGUOUS.includes(c)).join('')
      : set;
    if (filtered.length > 0) {
      charset += filtered;
      required.push(filtered[Math.floor(Math.random() * filtered.length)]);
    }
  };

  if (options.includeUppercase) addSet(UPPERCASE);
  if (options.includeLowercase) addSet(LOWERCASE);
  if (options.includeNumbers) addSet(NUMBERS);
  if (options.includeSymbols) addSet(SYMBOLS);

  // Fall back to lowercase if nothing selected
  if (!charset) {
    charset = LOWERCASE;
    required.push(charset[Math.floor(Math.random() * charset.length)]);
  }

  const length = Math.max(options.length, required.length);
  const remaining = length - required.length;
  const filled = Array.from(
    { length: remaining },
    () => charset[Math.floor(Math.random() * charset.length)],
  );

  const combined = [...required, ...filled];

  // Fisher-Yates shuffle
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
}

export function calculateStrength(password: string): { score: number; label: string } {
  const labels = ['very-weak', 'weak', 'fair', 'strong', 'very-strong'];
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const normalized = Math.min(4, Math.floor((score / 6) * 5));
  return { score: normalized, label: labels[normalized] };
}

export function generateMultiplePasswords(options: PasswordOptions, count: number): string[] {
  return Array.from({ length: count }, () => generatePassword(options));
}
