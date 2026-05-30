import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm } from '@tanstack/react-form';
import {
  decodeBase64,
  decodeBase64Url,
  encodeBase64,
  encodeBase64Url,
  isValidBase64,
} from '@toolkit/shared';
import { createFileRoute } from '@tanstack/react-router';
import { Copy, Lock, Unlock } from 'lucide-react';
import * as React from 'react';

export const Route = createFileRoute('/tools/base64')({
  component: Base64Page,
});

function Base64Page() {
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const form = useForm({
    defaultValues: {
      input: 'Hello, Dev Toolkit! 🛠️',
      mode: 'standard',
    },
  });

  const run = (fn: (input: string) => string) => {
    try {
      const result = fn(form.state.values.input);
      setOutput(result);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const encode = () => {
    const { mode } = form.state.values;
    run((input) => (mode === 'url' ? encodeBase64Url(input) : encodeBase64(input)));
  };

  const decode = () => {
    const { mode } = form.state.values;
    run((input) => (mode === 'url' ? decodeBase64Url(input) : decodeBase64(input)));
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isValid = isValidBase64(form.state.values.input.trim());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Base64 Encoder/Decoder</h1>
        <p className="text-muted-foreground">
          Encode and decode Base64 strings, including URL-safe variant.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Select the encoding mode</CardDescription>
          </CardHeader>
          <CardContent>
            <form.Field
              name="mode"
              children={(field) => (
                <Tabs
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v as 'standard' | 'url')}
                  className="w-full"
                >
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="standard">Standard Base64</TabsTrigger>
                    <TabsTrigger value="url">URL-safe Base64</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Input</CardTitle>
              {form.state.values.input && (
                <Badge variant={isValid ? 'outline' : 'destructive'} className="font-mono text-[10px]">
                  {isValid ? 'VALID B64' : 'INVALID B64'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field
              name="input"
              children={(field) => (
                <div className="grid w-full gap-1.5">
                  <Label htmlFor={field.name}>Text or Base64</Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="Enter text or Base64..."
                  />
                </div>
              )}
            />
            <div className="flex gap-2">
              <Button onClick={encode} className="flex-1" size="lg">
                <Lock className="mr-2 size-4" /> Encode
              </Button>
              <Button onClick={decode} variant="secondary" className="flex-1" size="lg">
                <Unlock className="mr-2 size-4" /> Decode
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Resulting encoded or decoded string</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="base64-output">Result</Label>
              <Textarea
                id="base64-output"
                readOnly
                value={output || error}
                className={`min-h-[200px] font-mono text-sm ${error ? 'border-destructive text-destructive' : ''}`}
                placeholder="Output will appear here..."
              />
            </div>
            {output && (
              <Button onClick={copy} variant="outline" className="w-full relative overflow-hidden group" size="lg">
                <Copy className="mr-2 size-4" /> 
                {copied ? 'Copied to clipboard!' : 'Copy Output'}
                {copied && <span className="absolute inset-0 bg-primary/10 animate-in fade-in duration-300" />}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
