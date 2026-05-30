import { createFileRoute } from '@tanstack/react-router';
import {
  generateShareId,
  hasReachedMaxAccess,
  isExpired,
  type TextShare,
  validateShareContent,
} from '@toolkit/shared';
import {
  Calendar,
  ClipboardList,
  Clock,
  Copy,
  Hash,
  Link as LinkIcon,
  Search,
  Trash2,
} from 'lucide-react';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form';

export const Route = createFileRoute('/tools/text-share')({
  component: TextSharePage,
});

// In-memory store for demo
const shareStore = new Map<string, TextShare>();

function TextSharePage() {
  const [shareId, setShareId] = React.useState('');
  const [lookupId, setLookupId] = React.useState('');
  const [retrieved, setRetrieved] = React.useState<TextShare | null>(null);
  const [retrieveError, setRetrieveError] = React.useState('');

  const form = useForm({
    defaultValues: {
      content: '',
      title: '',
      expiryMinutes: 60,
      maxAccess: '' as number | '',
      burnAfterRead: false,
    },
    onSubmit: async ({ value }) => {
      const validation = validateShareContent(value.content);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid content');
      }
      const id = generateShareId();
      const share: TextShare = {
        id,
        content: value.content,
        title: value.title || undefined,
        expiresAt: new Date(Date.now() + value.expiryMinutes * 60_000),
        accessCount: 0,
        maxAccess: value.maxAccess !== '' ? Number(value.maxAccess) : undefined,
        createdAt: new Date(),
        isEncrypted: false,
        burnAfterRead: value.burnAfterRead,
      };
      shareStore.set(id, share);
      setShareId(id);
    },
  });

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

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Text Share</h1>
        <p className="text-muted-foreground text-lg">Share text securely with expiry and access limits.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Create a Share</CardTitle>
            <CardDescription>Configure your secure share settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field
                name="title"
                children={(field) => (
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor={field.name}>Title (Optional)</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="My shared snippet"
                      className="bg-background"
                    />
                  </div>
                )}
              />
              <form.Field
                name="content"
                children={(field) => (
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor={field.name}>Content</Label>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="min-h-[150px] font-mono text-xs bg-background"
                      placeholder="Paste content to share..."
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-destructive">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="expiryMinutes"
                  children={(field) => (
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor={field.name}>Expiry (min)</Label>
                      <Input
                        id={field.name}
                        type="number"
                        min={1}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="bg-background"
                      />
                    </div>
                  )}
                />
                <form.Field
                  name="maxAccess"
                  children={(field) => (
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor={field.name}>Max Access</Label>
                      <Input
                        id={field.name}
                        type="number"
                        min={1}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        placeholder="∞"
                        className="bg-background"
                      />
                    </div>
                  )}
                />
              </div>

              <form.Field
                name="burnAfterRead"
                children={(field) => (
                  <div className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={(v) => field.handleChange(!!v)}
                    />
                    <Label htmlFor={field.name} className="text-sm font-normal cursor-pointer leading-none">
                      Burn after read (delete after first retrieval)
                    </Label>
                  </div>
                )}
              />

              <Button type="submit" className="w-full" size="lg">
                <LinkIcon className="mr-2 size-4" /> Create Share
              </Button>
            </form>

            {shareId && (
              <div className="mt-6 rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Share ID Created:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm font-black text-foreground bg-background p-2 rounded border">{shareId}</code>
                  <Button size="icon" variant="outline" onClick={() => copyResult(shareId)} className="shrink-0 h-10 w-10">
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col shadow-sm">
          <CardHeader>
            <CardTitle>Retrieve a Share</CardTitle>
            <CardDescription>Enter a Share ID to view the content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="flex gap-2">
              <Input
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter Share ID..."
                className="font-mono bg-background h-10"
              />
              <Button onClick={retrieve} variant="secondary" className="h-10 px-6">
                <Search className="mr-2 size-4" /> Retrieve
              </Button>
            </div>
            {retrieveError && (
              <p className="text-sm font-medium text-destructive bg-destructive/5 border border-destructive/20 p-2 rounded">{retrieveError}</p>
            )}

            {retrieved ? (
              <div className="space-y-4 pt-4 border-t animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{retrieved.title || 'Untitled Share'}</h3>
                  {retrieved.burnAfterRead && (
                    <Badge variant="destructive" className="font-bold">
                      <Trash2 className="mr-1 size-3" /> BURN ON READ
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-3.5 text-primary" />
                    <span>Created: {retrieved.createdAt.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-3.5 text-primary" />
                    <span>Expires: {retrieved.expiresAt?.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <Hash className="size-3.5 text-primary" />
                    <span className="font-medium">
                      Views: <span className="text-foreground">{retrieved.accessCount}</span>{' '}
                      {retrieved.maxAccess ? `/ ${retrieved.maxAccess}` : ''}
                    </span>
                  </div>
                </div>

                <ScrollArea className="h-[250px] w-full rounded-md bg-muted/30 border border-muted p-4">
                  <pre className="font-mono text-[11px] whitespace-pre-wrap leading-relaxed select-all">{retrieved.content}</pre>
                </ScrollArea>

                <Button
                  onClick={() => copyResult(retrieved.content)}
                  variant="outline"
                  className="w-full h-10 font-bold"
                >
                  <Copy className="mr-2 size-4" /> Copy Content
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg min-h-[350px] bg-muted/5">
                <ClipboardList className="size-16 mb-4 opacity-10" />
                <p className="text-sm font-medium">Ready to retrieve</p>
                <p className="text-xs opacity-60">Enter an ID above</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
