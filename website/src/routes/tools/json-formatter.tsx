import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@tanstack/react-form';
import { formatJson, minifyJson, sortJsonKeys, validateJson } from '@toolkit/shared';
import { createFileRoute } from '@tanstack/react-router';
import { Copy, ListOrdered, Minimize2, Sparkles } from 'lucide-react';
import * as React from 'react';

export const Route = createFileRoute('/tools/json-formatter')({
  component: JsonFormatterPage,
});

const EXAMPLE = `{"name":"Dev Toolkit","version":1,"features":["format","minify","sort"],"active":true,"metadata":null}`;

const JSON_THEMES: Record<string, string> = {
  default: 'bg-muted/30 text-foreground',
  midnight: 'bg-[#0f172a] text-[#38bdf8] border-[#1e293b]',
  solarized: 'bg-[#002b36] text-[#839496] border-[#073642]',
  monokai: 'bg-[#272822] text-[#f8f8f2] border-[#3e3d32]',
};

function JsonFormatterPage() {
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const form = useForm({
    defaultValues: {
      input: EXAMPLE,
      theme: 'default',
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

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const validation = validateJson(form.state.values.input);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">JSON Formatter</h1>
        <p className="text-muted-foreground">Format, minify, validate, and sort JSON with custom themes.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Customize the editor appearance</CardDescription>
          </CardHeader>
          <CardContent>
             <form.Field
              name="theme"
              children={(field) => (
                <div className="flex items-center gap-4">
                  <Label htmlFor="theme-select">Editor Theme</Label>
                  <Select value={field.state.value} onValueChange={(v) => field.handleChange(v as string)}>
                    <SelectTrigger id="theme-select" className="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="midnight">Midnight Blue</SelectItem>
                      <SelectItem value="solarized">Solarized Dark</SelectItem>
                      <SelectItem value="monokai">Monokai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Input</CardTitle>
              {form.state.values.input && (
                <Badge variant={validation.valid ? 'outline' : 'destructive'} className="text-[10px]">
                  {validation.valid ? 'VALID JSON' : 'INVALID JSON'}
                </Badge>
              )}
            </div>
            <CardDescription>Paste your raw JSON content here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <form.Field
              name="input"
              children={(field) => (
                <div className="grid w-full gap-1.5 h-full min-h-[400px]">
                  <Label htmlFor={field.name} className="sr-only">Raw JSON</Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={cn(
                      "flex-1 font-mono text-xs resize-none transition-colors duration-300",
                      JSON_THEMES[form.state.values.theme]
                    )}
                    placeholder="Paste JSON here..."
                  />
                </div>
              )}
            />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button onClick={() => run(formatJson)} variant="secondary">
                <Sparkles className="mr-2 size-4" /> Format
              </Button>
              <Button onClick={() => run(minifyJson)} variant="secondary">
                <Minimize2 className="mr-2 size-4" /> Minify
              </Button>
              <Button onClick={() => run(sortJsonKeys)} variant="secondary">
                <ListOrdered className="mr-2 size-4" /> Sort Keys
              </Button>
            </div>
            {!validation.valid && form.state.values.input && (
              <p className="text-xs text-destructive font-medium border border-destructive/20 bg-destructive/5 p-2 rounded">
                {validation.error}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Formatted or minified JSON result</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="grid w-full gap-1.5 h-full min-h-[400px]">
              <Label htmlFor="json-output" className="sr-only">Result</Label>
              <Textarea
                id="json-output"
                readOnly
                value={output || error}
                className={cn(
                  "flex-1 font-mono text-xs resize-none transition-colors duration-300",
                  error ? 'border-destructive text-destructive' : JSON_THEMES[form.state.values.theme]
                )}
                placeholder="Output will appear here..."
              />
            </div>
            {output && (
              <Button onClick={copy} variant="outline" className="w-full" size="lg">
                <Copy className="mr-2 size-4" /> {copied ? 'Copied to clipboard!' : 'Copy Output'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
