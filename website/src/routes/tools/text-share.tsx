import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  generateShareId,
  hasReachedMaxAccess,
  isExpired,
  type TextShare,
  validateShareContent,
} from '../../lib/text-share';

export const Route = createFileRoute('/tools/text-share')({
  component: TextSharePage,
});

// In-memory store for demo (a real app would use the DB)
const shareStore = new Map<string, TextShare>();

function TextSharePage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [expiryMinutes, setExpiryMinutes] = useState(60);
  const [maxAccess, setMaxAccess] = useState<number | ''>('');
  const [burnAfterRead, setBurnAfterRead] = useState(false);
  const [shareId, setShareId] = useState('');
  const [error, setError] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [retrieved, setRetrieved] = useState<TextShare | null>(null);
  const [retrieveError, setRetrieveError] = useState('');

  const create = () => {
    const validation = validateShareContent(content);
    if (!validation.valid) {
      setError(validation.error ?? 'Invalid content');
      return;
    }
    setError('');
    const id = generateShareId();
    const share: TextShare = {
      id,
      content,
      title: title || undefined,
      expiresAt: new Date(Date.now() + expiryMinutes * 60_000),
      accessCount: 0,
      maxAccess: maxAccess !== '' ? Number(maxAccess) : undefined,
      createdAt: new Date(),
      isEncrypted: false,
      burnAfterRead,
    };
    shareStore.set(id, share);
    setShareId(id);
  };

  const retrieve = () => {
    const share = shareStore.get(lookupId);
    if (!share) {
      setRetrieveError('Share not found.');
      setRetrieved(null);
      return;
    }
    if (isExpired(share)) {
      setRetrieveError('This share has expired.');
      setRetrieved(null);
      return;
    }
    if (hasReachedMaxAccess(share)) {
      setRetrieveError('This share has reached its access limit.');
      setRetrieved(null);
      return;
    }
    share.accessCount++;
    if (share.burnAfterRead) {
      shareStore.delete(lookupId);
    }
    setRetrieved({ ...share });
    setRetrieveError('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-2 text-violet-400">📋 Text Share</h1>
      <p className="text-gray-400 mb-8">Share text securely with expiry and access limits.</p>

      {/* Create form */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8 space-y-4">
        <h2 className="text-lg font-bold text-white">Create a Share</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content to share..."
          className="w-full h-32 bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:border-violet-500"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-4 flex-wrap">
          <label className="text-sm text-gray-400">
            Expiry (minutes):
            <input
              type="number"
              min={1}
              value={expiryMinutes}
              onChange={(e) => setExpiryMinutes(Number(e.target.value))}
              className="ml-2 w-20 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
            />
          </label>
          <label className="text-sm text-gray-400">
            Max access:
            <input
              type="number"
              min={1}
              value={maxAccess}
              onChange={(e) => setMaxAccess(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="∞"
              className="ml-2 w-20 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={burnAfterRead}
              onChange={(e) => setBurnAfterRead(e.target.checked)}
              className="accent-violet-500"
            />
            Burn after read
          </label>
        </div>
        <button
          type="button"
          onClick={create}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 font-bold transition-all"
        >
          🔗 Create Share
        </button>
        {shareId && (
          <div className="bg-gray-800 rounded-lg p-3 text-sm">
            <p className="text-gray-400 mb-1">Share ID:</p>
            <code className="text-violet-300 font-mono">{shareId}</code>
          </div>
        )}
      </div>

      {/* Retrieve */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Retrieve a Share</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="Enter Share ID..."
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:border-violet-500"
          />
          <button
            type="button"
            onClick={retrieve}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-semibold"
          >
            Retrieve
          </button>
        </div>
        {retrieveError && <p className="text-red-400 text-sm">{retrieveError}</p>}
        {retrieved && (
          <div className="space-y-2">
            {retrieved.title && (
              <p className="text-sm font-semibold text-gray-300">{retrieved.title}</p>
            )}
            <pre className="bg-gray-800 rounded-lg p-4 text-sm text-gray-200 whitespace-pre-wrap font-mono overflow-auto max-h-64">
              {retrieved.content}
            </pre>
            <p className="text-xs text-gray-500">
              Accessed {retrieved.accessCount} time(s)
              {retrieved.maxAccess ? ` of ${retrieved.maxAccess}` : ''}
              {retrieved.burnAfterRead ? ' · burned after this read' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
