import { Link } from '@tanstack/react-router';

export function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
          🛠️ Dev Toolkit
        </Link>
        <div className="flex gap-4 text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
        </div>
      </div>
    </nav>
  );
}
