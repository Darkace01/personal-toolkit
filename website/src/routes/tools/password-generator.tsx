import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@tanstack/react-form';
import {
  calculateStrength,
  generateMultiplePasswords,
  generatePassword,
} from '@toolkit/shared';
import { createFileRoute } from '@tanstack/react-router';
import { Copy, RefreshCw } from 'lucide-react';
import * as React from 'react';

export const Route = createFileRoute('/tools/password-generator')({
  component: PasswordGeneratorPage,
});

const strengthColors: Record<string, string> = {
  'very-weak': 'bg-red-500',
  weak: 'bg-orange-500',
  fair: 'bg-yellow-500',
  strong: 'bg-lime-500',
  'very-strong': 'bg-green-500',
};

function PasswordGeneratorPage() {
  const [password, setPassword] = React.useState('');
  const [bulk, setBulk] = React.useState<string[]>([]);
  const [copied, setCopied] = React.useState(false);

  const form = useForm({
    defaultValues: {
      length: 20,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    },
  });

  const generate = () => {
    setPassword(generatePassword(form.state.values));
  };

  const generateBulk = () => {
    setBulk(generateMultiplePasswords(form.state.values, 10));
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const strength = calculateStrength(password);

  // Initial generation
  React.useEffect(() => {
    generate();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Password Generator</h1>
        <p className="text-muted-foreground">Generate secure passwords with full control.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Generated Password</CardTitle>
            <CardDescription>Click refresh to generate a new one</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 rounded-lg bg-muted p-6 border relative group">
              <code className="flex-1 text-2xl font-mono tracking-wider break-all text-center">
                {password}
              </code>
              <div className="flex flex-col gap-2">
                <Button size="icon" onClick={generate} variant="secondary">
                  <RefreshCw className="size-4" />
                </Button>
                <Button size="icon" onClick={() => copy(password)}>
                  <Copy className="size-4" />
                </Button>
              </div>
              {copied && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded animate-in fade-in slide-in-from-top-1">
                  COPIED
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Strength Assessment:</span>
                <Badge variant="outline" className="capitalize font-mono">
                  {strength.label.replace('-', ' ')}
                </Badge>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full transition-all duration-500 ease-in-out ${strengthColors[strength.label]}`}
                  style={{ width: `${(strength.score + 1) * 20}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
            <CardDescription>Customize your password requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form.Field
              name="length"
              children={(field) => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.name}>Length: {field.state.value}</Label>
                  </div>
                  <Slider
                    id={field.name}
                    min={4}
                    max={128}
                    step={1}
                    value={[field.state.value]}
                    onValueChange={(val: number | readonly number[]) => {
                      if (Array.isArray(val)) {
                        field.handleChange(val[0]);
                      } else if (typeof val === 'number') {
                        field.handleChange(val);
                      }
                    }}
                  />
                </div>
              )}
            />

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              {(['includeUppercase', 'includeLowercase', 'includeNumbers', 'includeSymbols', 'excludeAmbiguous'] as const).map((name) => (
                <form.Field
                  key={name}
                  name={name}
                  children={(field) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={field.name}
                        checked={field.state.value}
                        onCheckedChange={(checked) => field.handleChange(!!checked)}
                      />
                      <Label htmlFor={field.name} className="text-xs font-normal leading-none cursor-pointer">
                        {name.replace('include', '').replace('exclude', 'Exclude ').replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                    </div>
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={generate} className="flex-1">
                Generate New
              </Button>
              <Button onClick={generateBulk} variant="outline" className="flex-1">
                Bulk (10)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Results</CardTitle>
            <CardDescription>Multiple passwords matching your criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px] w-full rounded-md border p-4 bg-muted/20">
              {bulk.length > 0 ? (
                <div className="space-y-3">
                  {bulk.map((p, i) => (
                    <div key={`bulk-${i}`} className="flex items-center justify-between gap-4 p-2 rounded hover:bg-muted/50 group transition-colors">
                      <code className="text-xs font-mono truncate">{p}</code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copy(p)}
                        className="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground italic gap-2">
                  <RefreshCw className="size-8 opacity-20" />
                  Click Bulk to generate
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
