import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  calculateStrength,
  generateMultiplePasswords,
  generatePassword,
  type PasswordOptions,
} from '../../lib/password-generator';

export const Route = createFileRoute('/tools/password-generator')({
  component: PasswordGeneratorPage,
});

const defaultOptions: PasswordOptions = {
  length: 20,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
};

const strengthBg = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

function PasswordGeneratorPage() {
  const [options, setOptions] = useState<PasswordOptions>(defaultOptions);
  const [password, setPassword] = useState(() => generatePassword(defaultOptions));
  const [bulk, setBulk] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const strength = calculateStrength(password);

  const generate = () => {
    setPassword(generatePassword(options));
    setCopied(false);
  };

  const generateBulk = () => {
    setBulk(generateMultiplePasswords(options, 10));
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggle = (key: keyof PasswordOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-2 text-pink-400">🔐 Password Generator</h1>
      <p className="text-gray-400 mb-8">Generate secure passwords with full control.</p>

      {/* Main password display */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <code className="flex-1 text-lg font-mono text-white break-all">{password}</code>
          <button
            type="button"
            onClick={() => copy(password)}
            className="shrink-0 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-sm font-semibold transition-colors"
          >
            {copied ? '✅ Copied' : 'Copy'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${strengthBg[strength.score]}`}
              style={{ width: `${(strength.score + 1) * 20}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 capitalize w-20">{strength.label}</span>
        </div>
      </div>

      {/* Options */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="length-slider" className="text-sm font-semibold text-gray-300">
            Length: {options.length}
          </label>
          <input
            id="length-slider"
            type="range"
            min={4}
            max={128}
            value={options.length}
            onChange={(e) => setOptions((p) => ({ ...p, length: Number(e.target.value) }))}
            className="w-48"
          />
        </div>
        {(
          [
            ['includeUppercase', 'Uppercase (A-Z)'],
            ['includeLowercase', 'Lowercase (a-z)'],
            ['includeNumbers', 'Numbers (0-9)'],
            ['includeSymbols', 'Symbols (!@#…)'],
            ['excludeAmbiguous', 'Exclude ambiguous (l, 1, O, 0…)'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => toggle(key)}
              className="w-4 h-4 accent-pink-500"
            />
            <span className="text-sm text-gray-300">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={generate}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 font-bold transition-all"
        >
          🔄 Generate
        </button>
        <button
          type="button"
          onClick={generateBulk}
          className="px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm font-semibold transition-colors"
        >
          Bulk (10)
        </button>
      </div>

      {bulk.length > 0 && (
        <div className="mt-6 bg-gray-900 rounded-2xl border border-gray-700 p-4 space-y-2">
          <h3 className="text-sm font-bold text-gray-400 mb-3">Bulk Passwords</h3>
          {bulk.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono text-gray-200 break-all">{p}</code>
              <button
                type="button"
                onClick={() => copy(p)}
                className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
