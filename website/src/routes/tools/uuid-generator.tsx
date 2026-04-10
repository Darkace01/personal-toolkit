import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  generateUuidV4,
  generateUuidV1,
  generateMultipleUuids,
  isValidUuid,
} from '../../lib/uuid-generator';

export const Route = createFileRoute('/tools/uuid-generator')({
  component: UuidGeneratorPage,
});

function UuidGeneratorPage() {
  const [version, setVersion] = useState<'v1' | 'v4'>('v4');
  const [single, setSingle] = useState(() => generateUuidV4());
  const [bulk, setBulk] = useState<string[]>([]);
  const [validateInput, setValidateInput] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const regenerate = () => {
    setSingle(version === 'v4' ? generateUuidV4() : generateUuidV1());
  };

  const generateBulk = () => {
    setBulk(generateMultipleUuids(version, 10));
  };

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const isValid = validateInput ? isValidUuid(validateInput) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-2 text-green-400">🆔 UUID Generator</h1>
      <p className="text-gray-400 mb-8">Generate v1 and v4 UUIDs, validate existing ones.</p>

      <div className="flex gap-3 mb-6">
        {(['v4', 'v1'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${version === v ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            UUID {v.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6">
        <code className="text-lg font-mono text-white block mb-4 break-all">{single}</code>
        <div className="flex gap-3">
          <button
            onClick={regenerate}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-sm font-semibold transition-colors"
          >
            🔄 New UUID
          </button>
          <button
            onClick={() => copy(single, -1)}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-semibold transition-colors"
          >
            {copiedIdx === -1 ? '✅ Copied' : '📋 Copy'}
          </button>
          <button
            onClick={generateBulk}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-semibold transition-colors"
          >
            Bulk (10)
          </button>
        </div>
      </div>

      {bulk.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 mb-6 space-y-2">
          <h3 className="text-sm font-bold text-gray-400 mb-3">Bulk UUIDs</h3>
          {bulk.map((u, i) => (
            <div key={i} className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono text-gray-200 break-all">{u}</code>
              <button
                onClick={() => copy(u, i)}
                className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
              >
                {copiedIdx === i ? '✅' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-300 mb-3">Validate UUID</h3>
        <input
          type="text"
          value={validateInput}
          onChange={(e) => setValidateInput(e.target.value)}
          placeholder="Paste a UUID to validate..."
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:border-green-500"
        />
        {isValid !== null && (
          <p className={`mt-2 text-sm ${isValid ? 'text-green-400' : 'text-red-400'}`}>
            {isValid ? '✅ Valid UUID' : '❌ Invalid UUID'}
          </p>
        )}
      </div>
    </div>
  );
}
