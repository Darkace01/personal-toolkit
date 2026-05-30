import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowRight,
  Binary,
  ClipboardList,
  Fingerprint,
  Hash,
  KeyRound,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

const tools = [
  {
    title: 'Password Generator',
    description: 'Create secure, random passwords with customizable character sets.',
    icon: KeyRound,
    href: '/tools/password-generator',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    shortcut: 'P',
  },
  {
    title: 'Secrets Generator',
    description: 'Generate high-entropy cryptographically secure secrets and keys.',
    icon: ShieldCheck,
    href: '/tools/secrets-generator',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    shortcut: 'S',
  },
  {
    title: 'Text Share',
    description: 'Securely share sensitive snippets with expiry and self-destruct options.',
    icon: ClipboardList,
    href: '/tools/text-share',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    shortcut: 'T',
  },
  {
    title: 'JSON Formatter',
    description: 'Prettify, minify, and validate JSON data with syntax validation.',
    icon: Binary,
    href: '/tools/json-formatter',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    shortcut: 'J',
  },
  {
    title: 'Base64 Converter',
    description: 'Encode and decode strings to/from Base64 and URL-safe formats.',
    icon: ShieldCheck,
    href: '/tools/base64',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    shortcut: 'B',
  },
  {
    title: 'UUID Generator',
    description: 'Generate unique identifiers (v1, v4) individually or in bulk.',
    icon: Fingerprint,
    href: '/tools/uuid-generator',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    shortcut: 'U',
  },
  {
    title: 'Hash Generator',
    description: 'Compute MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes.',
    icon: Hash,
    href: '/tools/hash-generator',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    shortcut: 'H',
  },
];

function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary font-bold tracking-tight uppercase text-xs">
          <Zap className="size-3 fill-primary" />
          Quick Access
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight lg:text-6xl text-foreground">
            Dev Toolkit
          </h1>
          <p className="text-lg text-muted-foreground max-w-[700px] leading-relaxed">
            A high-performance suite of essential tools for modern developers. 
            Privacy-first, client-side only, and incredibly fast.
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} to={tool.href} className="group outline-none">
            <Card className="h-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:-translate-y-1 border-muted group-hover:border-primary/50 relative overflow-hidden flex flex-col group-focus-visible:ring-2 group-focus-visible:ring-primary">
              <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <tool.icon className="size-32" />
              </div>
              <CardHeader className="relative z-10">
                <div className={`size-10 rounded-lg ${tool.bgColor} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <tool.icon className={`size-5 ${tool.color}`} />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center justify-between">
                  {tool.title}
                  <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {tool.shortcut}
                  </kbd>
                </CardTitle>
                <CardDescription className="text-sm leading-normal">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto relative z-10 pt-0">
                <div className="flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-300 uppercase tracking-widest">
                  Open Tool <ArrowRight className="ml-2 size-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-primary text-primary-foreground overflow-hidden border-none shadow-2xl shadow-primary/20 mt-4">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="p-8 md:p-12 flex-1 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight lg:text-4xl">Browser Extension</h2>
                <p className="text-primary-foreground/90 text-lg max-w-[600px] leading-relaxed font-medium">
                  Supercharge your workflow with our lightweight browser extension. 
                  Access all tools, switch themes, and inject custom CSS on any website.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant="secondary" className="font-bold rounded-full px-8 shadow-lg transition-transform active:scale-95">
                  Get for Chrome
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white font-bold rounded-full px-8 backdrop-blur-sm transition-transform active:scale-95">
                  Get for Firefox
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center pr-12 select-none pointer-events-none">
              <div className="relative">
                <ShieldCheck className="size-56 opacity-20 rotate-12 relative z-10" />
                <div className="absolute inset-0 bg-white/20 blur-[100px] rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
