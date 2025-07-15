'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { processUserCommand } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Shield, Smile, Copy } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface WingmanResult {
    suggestedMessage: string;
    cringeScore: number;
    regretShield: boolean;
    analysis: string;
}

/**
 * A Micro-App for the BEEP Wingman, the social engineer daemon.
 * Fulfills the 'Beep-Wingman.md' scripture.
 */
export function BeepWingman() {
  const [situation, setSituation] = useState('');
  const [messageMode, setMessageMode] = useState('charming');
  const [result, setResult] = useState<WingmanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation) {
      toast({
        title: 'Briefing Required',
        description: 'Please describe the situation for your Wingman.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    const command = `wingman, mode ${messageMode}, help me with this: ${situation}`;
    try {
        const rawResponse = await processUserCommand(command);
        // In a real app, the response would be structured JSON. Here we parse the text.
        // This is a temporary hack until the agent executor returns structured data.
        const parsedResult = JSON.parse(rawResponse.replace(/```json\n|\n```/g, ''));
        setResult(parsedResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Wingman Malfunction',
        description: 'The agent failed to generate a response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: 'Message Copied',
        description: 'The suggested message has been copied to your clipboard.',
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-card/50 sigil-codex p-4 gap-4">
        <div className="space-y-4">
            <div>
                <Label htmlFor="situation">The Briefing</Label>
                <Textarea
                    id="situation"
                    placeholder="e.g., I need to ask my boss for a raise..."
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    className="min-h-[80px]"
                    disabled={isLoading}
                />
            </div>
            <div>
                <Label htmlFor="messageMode">Message Mode</Label>
                <Select value={messageMode} onValueChange={setMessageMode} disabled={isLoading}>
                    <SelectTrigger id="messageMode">
                        <SelectValue placeholder="Select a mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="charming">Charming AF</SelectItem>
                        <SelectItem value="direct">Cool & Collected</SelectItem>
                        <SelectItem value="funny">Funny & Disarming</SelectItem>
                        <SelectItem value="saying-no">Help Me Say No</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
                {isLoading ? 'Deploying Charm...' : 'Call The Wingman'}
            </Button>
        </div>

        {isLoading && (
            <Card className="flex-grow bg-transparent">
                <CardHeader>
                    <Skeleton className="h-5 w-2/5" />
                    <Skeleton className="h-4 w-4/5" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <div className="flex justify-between">
                       <Skeleton className="h-8 w-1/3" />
                       <Skeleton className="h-8 w-1/3" />
                    </div>
                </CardContent>
            </Card>
        )}

        {result && (
            <Card className="flex-grow bg-transparent border-primary/20">
                 <CardHeader>
                    <CardTitle>The Play</CardTitle>
                    <CardDescription>{result.analysis}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className='relative p-4 border rounded-md bg-background'>
                        <p className='text-primary-foreground'>{result.suggestedMessage}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7"
                            onClick={() => copyToClipboard(result.suggestedMessage)}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Smile className="h-5 w-5 text-muted-foreground" />
                            <span className="font-bold">Cringe Score:</span>
                            <span className={result.cringeScore > 6 ? 'text-destructive' : 'text-green-400'}>
                                {result.cringeScore}/10
                            </span>
                        </div>
                        {result.regretShield && (
                             <div className="flex items-center gap-2 text-sm text-amber-400">
                                <Shield className="h-5 w-5" />
                                <span className="font-bold">Regret Shield™ Active</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
