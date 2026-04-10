import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  decodeBase64,
  decodeBase64Url,
  encodeBase64,
  encodeBase64Url,
  isValidBase64,
} from '../../lib/base64';

export const Route = createFileRoute('/tools/base64')({
  component: Base64Page,
});

function Base64Page() {
  const [input, setInput] = useState('Hello, Dev Toolkit! 🛠️');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'standard' | 'url'>('standard');
  const [copied, setCopied] = useState(false);

  const run = (fn: () => string) => {
    try {
      setOutput(fn());
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const encode = () => run(() => (mode === 'url' ? encodeBase64Url(input) : encodeBase64(input)));
  const decode = () => run(() => (mode === 'url' ? decodeBase64Url(input) : decodeBase64(input)));

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isValid = isValidBase64(input);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-2 text-amber-400">🔤 Base64 Encoder/Decoder</h1>
      <p className="text-gray-400 mb-8">
        Encode and decode Base64 strings, including URL-safe variant.
      </p>

      <div className="flex gap-3 mb-4">
        {(['standard', 'url'] as const).map((m) => (
          <button
            type="button"
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === m ? 'bg-amber-600' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            {m === 'standard' ? 'Standard Base64' : 'URL-safe Base64'}
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label
            htmlFor="base64-input"
            className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block"
          >
            Input
          </label>
          <textarea
            id="base64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-4 font-mono text-sm text-gray-200 resize-none focus:outline-none focus:border-amber-500"
            placeholder="Enter text or Base64..."
          />
          {input && (
            <div className="mt-1 text-xs text-gray-500">
              Valid Base64:{' '}
              {isValid ? (
                <span className="text-green-400">yes</span>
              ) : (
                <span className="text-gray-600">no</span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={encode}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-semibold text-sm transition-colors"
          >
            🔒 Encode
          </button>
          <button
            type="button"
            onClick={decode}
            className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 font-semibold text-sm transition-colors"
          >
            🔓 Decode
          </button>
        </div>

        {(output || error) && (
          <div>
            <label
              htmlFor="base64-output"
              className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block"
            >
              Output
            </label>
            <textarea
              id="base64-output"
              readOnly
              value={output || error}
              className={`w-full h-32 bg-gray-900 border rounded-xl p-4 font-mono text-sm resize-none ${error ? 'border-red-700 text-red-400' : 'border-gray-700 text-gray-200'}`}
            />
            {output && (
              <button
                type="button"
                onClick={copy}
                className="mt-1 text-xs text-amber-400 hover:text-amber-300"
              >
                {copied ? '✅ Copied' : '📋 Copy output'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
