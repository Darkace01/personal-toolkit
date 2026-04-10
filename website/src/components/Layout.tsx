import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main>{children}</main>
      <footer className="border-t border-gray-800 text-center text-xs text-gray-600 py-6 mt-16">
        Dev Toolkit — built with React + TanStack Router + Tailwind CSS
      </footer>
    </div>
  );
}
