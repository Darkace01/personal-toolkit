import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form';
import { hashAll } from '@toolkit/shared';
import { createFileRoute } from '@tanstack/react-router';
import { Copy, RefreshCw } from 'lucide-react';
import * as React from 'react';

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
  const [hashes, setHashes] = React.useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      input: 'Hello, world!',
    },
    onSubmit: async ({ value }) => {
      setHashes(hashAll(value.input));
    },
  });

  const generate = () => {
    setHashes(hashAll(form.state.values.input));
  };

  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // Auto-generate on input change or mount
  React.useEffect(() => {
    generate();
  }, [form.state.values.input]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hash Generator</h1>
        <p className="text-muted-foreground">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter the text you want to hash</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field
              name="input"
              children={(field) => (
                <div className="grid w-full gap-1.5">
                  <Label htmlFor={field.name}>Source Text</Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="Enter text to hash..."
                  />
                </div>
              )}
            />
            <Button onClick={generate} className="w-full" size="lg" variant="secondary">
              <RefreshCw className="mr-2 size-4" /> Regenerate Hashes
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {ALGORITHMS.map((algo) => (
            <Card key={algo} className="overflow-hidden transition-all hover:border-primary/30">
              <CardHeader className="py-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">
                    {ALGORITHM_LABELS[algo]}
                  </CardTitle>
                  {hashes[algo] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copy(algo, hashes[algo])}
                      className="h-8 px-3 text-xs font-bold"
                    >
                      {copiedKey === algo ? (
                        <span className="text-green-500">COPIED</span>
                      ) : (
                        <>
                          <Copy className="mr-2 size-3" /> COPY
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 bg-background">
                <div className="rounded-md font-mono text-[11px] break-all leading-relaxed select-all">
                  {hashes[algo] || <span className="text-muted-foreground italic">Pending...</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
