import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from '@tanstack/react-form';
import {
  generateMultipleUuids,
  generateUuidV1,
  generateUuidV4,
  isValidUuid,
} from '@toolkit/shared';
import { createFileRoute } from '@tanstack/react-router';
import { Copy, Fingerprint, Plus } from 'lucide-react';
import * as React from 'react';

export const Route = createFileRoute('/tools/uuid-generator')({
  component: UuidGeneratorPage,
});

function UuidGeneratorPage() {
  const [single, setSingle] = React.useState('');
  const [bulk, setBulk] = React.useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const form = useForm({
    defaultValues: {
      version: 'v4' as 'v1' | 'v4',
      validateInput: '',
    },
  });

  const regenerate = () => {
    const { version } = form.state.values;
    setSingle(version === 'v4' ? generateUuidV4() : generateUuidV1());
    setCopiedIdx(null);
  };

  const generateBulk = () => {
    setBulk(generateMultipleUuids(form.state.values.version, 10));
  };

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const isValid = form.state.values.validateInput ? isValidUuid(form.state.values.validateInput) : null;

  // Initial generation
  React.useEffect(() => {
    regenerate();
  }, [form.state.values.version]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">UUID Generator</h1>
        <p className="text-muted-foreground text-lg">Generate v1 and v4 UUIDs, and validate existing ones.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Select UUID version and generate results</CardDescription>
          </CardHeader>
          <CardContent>
            <form.Field
              name="version"
              children={(field) => (
                <Tabs
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v as 'v1' | 'v4')}
                  className="w-full"
                >
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="v4">Version 4 (Random)</TabsTrigger>
                    <TabsTrigger value="v1">Version 1 (Time-based)</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Single UUID</CardTitle>
            <CardDescription>Generate one UUID at a time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4 border group relative">
              <code className="flex-1 font-mono text-sm break-all text-center font-bold">{single}</code>
            </div>
            <div className="flex gap-2">
              <Button onClick={regenerate} className="flex-1 h-10" variant="secondary">
                <Plus className="mr-2 size-4" /> New UUID
              </Button>
              <Button onClick={() => copy(single, -1)} variant="outline" className="flex-1 h-10 font-bold">
                <Copy className="mr-2 size-4" /> {copiedIdx === -1 ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Validate UUID</CardTitle>
            <CardDescription>Check if a string is a valid UUID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field
              name="validateInput"
              children={(field) => (
                <div className="grid w-full gap-1.5">
                  <Label htmlFor={field.name}>UUID String</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Paste UUID here..."
                    className="font-mono bg-background h-10"
                  />
                  {isValid !== null && (
                    <div className="mt-2 animate-in fade-in zoom-in-95">
                      <Badge variant={isValid ? 'outline' : 'destructive'} className="w-full justify-center py-1.5 font-bold">
                        {isValid ? '✅ VALID UUID FORMAT' : '❌ INVALID UUID FORMAT'}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bulk Generation</CardTitle>
                <CardDescription>Generate 10 UUIDs at once</CardDescription>
              </div>
              <Button onClick={generateBulk} variant="secondary" className="h-10">
                <Fingerprint className="mr-2 size-4" /> Bulk Generate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-muted/20">
              {bulk.length > 0 ? (
                <div className="divide-y divide-muted/50">
                  {bulk.map((u, i) => (
                    <div key={`uuid-${u}-${i}`} className="flex items-center justify-between py-3 group hover:bg-muted/30 px-2 rounded-sm transition-colors">
                      <code className="font-mono text-xs">{u}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copy(u, i)}
                        className="h-8 px-3 font-bold text-[10px]"
                      >
                        {copiedIdx === i ? <span className="text-primary">COPIED</span> : <><Copy className="mr-1.5 size-3" /> COPY</>}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground italic gap-2 py-12">
                  <Plus className="size-12 opacity-10" />
                  <p>Click Bulk Generate to populate list</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
