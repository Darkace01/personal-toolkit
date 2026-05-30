import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm } from '@tanstack/react-form';
import { generateSecret, secretToBase64, decodeBase64 } from '@toolkit/shared';
import { createFileRoute } from '@tanstack/react-router';
import { Copy, RefreshCw, ShieldAlert, Unlock } from 'lucide-react';
import * as React from 'react';

export const Route = createFileRoute('/tools/secrets-generator')({
  component: SecretsGeneratorPage,
});

function SecretsGeneratorPage() {
  const [secret, setSecret] = React.useState('');
  const [conversionOutput, setConversionOutput] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const form = useForm({
    defaultValues: {
      bytes: 32,
      format: 'hex' as 'hex' | 'base64' | 'base64url',
    },
  });

  const regenerate = () => {
    const { bytes, format } = form.state.values;
    setSecret(generateSecret(bytes, format));
    setCopied(false);
  };


  const copy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const convertForm = useForm({
    defaultValues: {
      input: '',
    },
  });

  const convertToBase64 = () => {
    try {
      setConversionOutput(secretToBase64(convertForm.state.values.input));
    } catch (e) {
      setConversionOutput(`Error: ${(e as Error).message}`);
    }
  };

  const decodeFromBase64 = () => {
    try {
      setConversionOutput(decodeBase64(convertForm.state.values.input));
    } catch (e) {
      setConversionOutput(`Error: ${(e as Error).message}`);
    }
  };

  // Sync secret when options change
  React.useEffect(() => {
    regenerate();
  }, [form.state.values.bytes, form.state.values.format]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Secrets Generator</h1>
        <p className="text-muted-foreground">
          Generate high-entropy cryptographically secure secrets and keys.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-primary" />
              <CardTitle>Generated Secret</CardTitle>
            </div>
            <CardDescription>Secure random bytes for API keys, JWT secrets, etc.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 rounded-lg bg-background border p-6 relative group">
              <code className="flex-1 text-lg font-mono break-all text-center selection:bg-primary selection:text-primary-foreground">
                {secret}
              </code>
              <div className="flex flex-col gap-2">
                <Button size="icon" onClick={regenerate} variant="secondary">
                  <RefreshCw className="size-4" />
                </Button>
                <Button size="icon" onClick={() => copy(secret)}>
                  <Copy className="size-4" />
                </Button>
                {copied && (
                  <span className="text-[10px] text-center font-bold text-primary animate-in fade-in slide-in-from-bottom-1">
                    COPIED
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <form.Field
                name="bytes"
                children={(field) => (
                  <div className="space-y-3">
                    <Label htmlFor={field.name}>Secret Length (Bytes): {field.state.value}</Label>
                    <div className="flex gap-2">
                      {[16, 32, 64].map((v) => (
                        <Button
                          key={v}
                          variant={field.state.value === v ? 'default' : 'outline'}
                          onClick={() => field.handleChange(v)}
                          className="flex-1 h-8 text-xs"
                          type="button"
                        >
                          {v}
                        </Button>
                      ))}
                    </div>
                    <Input
                      id={field.name}
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Math.max(1, Math.min(1024, parseInt(e.target.value) || 32)))}
                      className="mt-2 h-9"
                    />
                  </div>
                )}
              />

              <form.Field
                name="format"
                children={(field) => (
                  <div className="space-y-3">
                    <Label>Output Format</Label>
                    <Tabs
                      value={field.state.value}
                      onValueChange={(v) => field.handleChange(v as any)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="hex">Hex</TabsTrigger>
                        <TabsTrigger value="base64">Base64</TabsTrigger>
                        <TabsTrigger value="base64url">B64 URL</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Base64 Conversion</CardTitle>
            <CardDescription>Convert text or hex to Base64 and back</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <convertForm.Field
              name="input"
              children={(field) => (
                <div className="grid w-full gap-1.5">
                  <Label htmlFor={field.name}>Input (Text or Hex)</Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Paste secret or text..."
                    className="font-mono min-h-[120px] bg-background"
                  />
                </div>
              )}
            />
            <div className="flex gap-2">
              <Button onClick={convertToBase64} className="flex-1" variant="secondary">
                To Base64
              </Button>
              <Button onClick={decodeFromBase64} variant="secondary" className="flex-1">
                <Unlock className="mr-2 size-4" /> From Base64
              </Button>
            </div>
            <div className="grid w-full gap-1.5 pt-4">
              <Label>Result</Label>
              <Textarea
                readOnly
                value={conversionOutput}
                placeholder="Conversion result..."
                className="font-mono bg-muted/50 min-h-[100px]"
              />
              {conversionOutput && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copy(conversionOutput)}
                  className="mt-1 font-bold text-xs"
                >
                  <Copy className="mr-2 size-3" /> COPY RESULT
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Usage</CardTitle>
            <CardDescription>Recommended byte lengths for various applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 pt-2">
              {[
                { label: 'JWT HS256 Secret', value: '32 Bytes' },
                { label: 'JWT HS512 Secret', value: '64 Bytes' },
                { label: 'AES-256 Key', value: '32 Bytes' },
                { label: 'Session Cookies', value: '32+ Bytes' },
                { label: 'API Key (High Entropy)', value: '48 Bytes' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-sm border-b border-muted pb-2 last:border-0 last:pb-0">
                  <span className="font-medium text-muted-foreground">{item.label}</span>
                  <Badge variant="secondary" className="font-mono">{item.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
