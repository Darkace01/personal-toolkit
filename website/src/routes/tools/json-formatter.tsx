import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { formatJson, minifyJson, validateJson, sortJsonKeys } from '../../lib/json-formatter';

export const Route = createFileRoute('/tools/json-formatter')({
  component: JsonFormatterPage,
});

const EXAMPLE = `{"name":"Dev Toolkit","version":1,"features":["format","minify","sort"]}`;

function JsonFormatterPage() {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
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

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const validation = validateJson(input);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-2 text-cyan-400">🧩 JSON Formatter</h1>
      <p className="text-gray-400 mb-8">Format, minify, validate, and sort JSON.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 font-mono text-sm text-gray-200 resize-none focus:outline-none focus:border-cyan-500"
            placeholder="Paste JSON here..."
          />
          <div className={`mt-1 text-xs ${validation.valid ? 'text-green-400' : 'text-red-400'}`}>
            {validation.valid ? '✅ Valid JSON' : `❌ ${validation.error}`}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Output</label>
          <textarea
            readOnly
            value={output || error}
            className={`w-full h-64 bg-gray-900 border rounded-xl p-4 font-mono text-sm resize-none focus:outline-none ${error ? 'border-red-700 text-red-400' : 'border-gray-700 text-gray-200'}`}
            placeholder="Output will appear here..."
          />
          {output && (
            <button onClick={copy} className="mt-1 text-xs text-cyan-400 hover:text-cyan-300">
              {copied ? '✅ Copied' : '📋 Copy output'}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { label: '✨ Format', fn: () => formatJson(input) },
          { label: '📦 Minify', fn: () => minifyJson(input) },
          { label: '🔤 Sort Keys', fn: () => sortJsonKeys(input) },
        ].map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => run(fn)}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold text-sm transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
