import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { hashAll } from '../../lib/hash-generator';

export const Route = createFileRoute('/tools/hash-generator')({
  component: HashGeneratorPage,
});

const ALGORITHMS = ['md5', 'sha1', 'sha256', 'sha512'] as const;
const ALGORITHM_LABELS: Record<string, string> = {
  md5: 'MD5',
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  sha512: 'SHA-512',
};

function HashGeneratorPage() {
  const [input, setInput] = useState('Hello, world!');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const generate = () => {
    setHashes(hashAll(input));
  };

  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-2 text-red-400">#️⃣ Hash Generator</h1>
      <p className="text-gray-400 mb-8">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.</p>

      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-4 font-mono text-sm text-gray-200 resize-none focus:outline-none focus:border-red-500"
          placeholder="Enter text to hash..."
        />
      </div>

      <button
        onClick={generate}
        className="mb-8 w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 font-bold transition-all"
      >
        🔨 Generate Hashes
      </button>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {ALGORITHMS.map((algo) => (
            <div key={algo} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-400 uppercase">{ALGORITHM_LABELS[algo]}</span>
                <button
                  onClick={() => copy(algo, hashes[algo])}
                  className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  {copiedKey === algo ? '✅ Copied' : '📋 Copy'}
                </button>
              </div>
              <code className="text-xs font-mono text-gray-300 break-all block">{hashes[algo]}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
