'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { processUserCommand } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Clock, MapPin, MessageSquare, Shield, Smile, Copy } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

interface WingmanResult {
    date: string;
    time: string;
    location: string;
    finalMatchMessage: string;
    cringeScore: number;
    cringeAnalysis: string;
    regretShield: boolean;
}

/**
 * A Micro-App for BeepWingman 2.5, the Romantic Proxy Agent™.
 * Fulfills the advanced scripture for autonomous date negotiation.
 */
export function BeepWingman() {
  const [chatHistory, setChatHistory] = useState('');
  const [result, setResult] = useState<WingmanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatHistory) {
      toast({
        title: 'Chat History Required',
        description: 'Please provide the conversation for the agent to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    const command = `RicoSauveBot, analyze this chat: ${chatHistory}`;
    try {
        const rawResponse = await processUserCommand(command);
        const parsedResult = JSON.parse(rawResponse.response.replace(/```json\n|\n```/g, ''));
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
        description: 'The message has been copied to your clipboard.',
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-card/50 sigil-codex p-4 gap-4">
        <div className="space-y-4">
            <div>
                <Label htmlFor="chatHistory">Chat History</Label>
                <Textarea
                    id="chatHistory"
                    placeholder="Paste the entire Tinder conversation here..."
                    value={chatHistory}
                    onChange={(e) => setChatHistory(e.target.value)}
                    className="min-h-[120px] sigil-glyph"
                    disabled={isLoading}
                />
            </div>
            <Button onClick={handleSubmit} disabled={isLoading || !chatHistory} className="w-full">
                {isLoading ? 'Negotiating...' : 'Deploy Romantic Proxy Agent™'}
            </Button>
        </div>

        {isLoading && (
            <Card className="flex-grow bg-transparent border-primary/20 animate-pulse">
                <CardHeader>
                    <Skeleton className="h-6 w-3/5" />
                    <Skeleton className="h-4 w-4/5" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-8 w-full" />
                </CardFooter>
            </Card>
        )}

        {result && (
            <Card className="flex-grow bg-transparent border-primary/20">
                 <CardHeader>
                    <CardTitle className='text-primary'>💌 MISSION COMPLETE</CardTitle>
                    <CardDescription>The agent has secured a tentative engagement.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className='flex items-center gap-3 p-3 rounded-md bg-background/50'>
                        <Calendar className='h-5 w-5 text-muted-foreground'/>
                        <span className='font-mono'>{result.date}</span>
                    </div>
                    <div className='flex items-center gap-3 p-3 rounded-md bg-background/50'>
                        <Clock className='h-5 w-5 text-muted-foreground'/>
                        <span className='font-mono'>{result.time}</span>
                    </div>
                    <div className='flex items-center gap-3 p-3 rounded-md bg-background/50'>
                        <MapPin className='h-5 w-5 text-muted-foreground'/>
                        <span className='font-mono'>{result.location}</span>
                    </div>
                    <div className='flex items-start gap-3 p-3 rounded-md bg-background/50'>
                        <MessageSquare className='h-5 w-5 text-muted-foreground mt-1 shrink-0'/>
                        <blockquote className="border-l-2 border-primary pl-3 text-sm italic">
                          {result.finalMatchMessage}
                        </blockquote>
                    </div>
                </CardContent>
                <CardFooter className='flex-col items-start gap-3'>
                    <div className='flex items-center gap-2'>
                        <span className='font-bold'>Cringe-O-Meter™:</span>
                        <Badge variant={result.cringeScore > 7 ? 'destructive' : 'secondary'}>{result.cringeScore}/10</Badge>
                         {result.regretShield && (
                            <Badge variant="destructive">
                                <Shield className="h-3 w-3 mr-1" />
                                Regret Shield™ Deployed
                            </Badge>
                        )}
                    </div>
                    <p className='text-xs text-muted-foreground italic'>Analysis: {result.cringeAnalysis}</p>
                </CardFooter>
            </Card>
        )}
    </div>
  );
}
