import { createFileRoute, Link } from '@tanstack/react-router';
import { ToolCard } from '../components/ToolCard';

export const Route = createFileRoute('/')({
  component: HomePage,
});

const tools = [
  {
    title: 'Password Generator',
    description:
      'Generate secure, random passwords with full control over character sets and length.',
    emoji: '🔐',
    href: '/tools/password-generator',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Text Share',
    description: 'Securely share text or sensitive info with expiry and access limits.',
    emoji: '📋',
    href: '/tools/text-share',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    title: 'JSON Formatter',
    description: 'Format, validate, minify and sort JSON with syntax highlighting.',
    emoji: '🧩',
    href: '/tools/json-formatter',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 and URL-safe Base64 strings.',
    emoji: '🔤',
    href: '/tools/base64',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'UUID Generator',
    description: 'Generate v1 and v4 UUIDs in bulk, and validate existing UUIDs.',
    emoji: '🆔',
    href: '/tools/uuid-generator',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text.',
    emoji: '#️⃣',
    href: '/tools/hash-generator',
    gradient: 'from-red-500 to-orange-500',
  },
];

function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
          🛠️ Dev Toolkit
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          A funky collection of everyday developer utilities. Pick a tool and get to work.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.href} to={tool.href}>
            <ToolCard {...tool} />
          </Link>
        ))}
      </div>
    </div>
  );
}
