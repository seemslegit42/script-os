'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { processUserCommand } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';

type Mode = 'cheap-bastard' | 'cash-canary';

/**
 * A Micro-App for the unified Financial Advisor daemon.
 * Provides two personalities: Cheap Bastard and Cash Canary.
 */
export function FinancialAdvisor() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Mode>('cheap-bastard');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      toast({
        title: 'Query Required',
        description: 'Please provide an expense or stock ticker.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    const command = `${activeTab.replace('-', ' ')}: ${query}`;
    try {
      const rawResponse = await processUserCommand(command);
      const parsedResult = JSON.parse(rawResponse.replace(/```json\n|\n```/g, ''));
      setResult(parsedResult.response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Advisor Unavailable',
        description: 'The agent is currently "auditing" its own "assets". Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    return activeTab === 'cheap-bastard' ? 'e.g., A single banana' : 'e.g., GME';
  }

  return (
    <div className="h-full w-full flex flex-col bg-card/50 sigil-codex p-4 gap-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Mode)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cheap-bastard">Cheap Bastard Mode</TabsTrigger>
          <TabsTrigger value="cash-canary">Cash Canary Mode</TabsTrigger>
        </TabsList>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <Label htmlFor="query">{activeTab === 'cheap-bastard' ? 'Expense to Scrutinize' : 'Stock to Doubt'}</Label>
            <Input
                id="query"
                placeholder={getPlaceholder()}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Calculating...' : 'Get "Advice"'}
            </Button>
        </form>
      </Tabs>
      
      <div className="flex-grow">
        {isLoading && (
            <Alert>
                <Skeleton className="h-5 w-2/5 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
            </Alert>
        )}
        {result && (
            <Alert variant="default" className='border-primary/20'>
                <AlertTitle className='sigil-obelisk'>{activeTab === 'cheap-bastard' ? 'The Verdict' : 'The Chirp'}</AlertTitle>
                <AlertDescription>
                    {result}
                </AlertDescription>
            </Alert>
        )}
      </div>
    </div>
  );
}
