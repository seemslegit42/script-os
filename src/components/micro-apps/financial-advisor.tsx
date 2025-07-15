'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import { FinancialAdvisorOutput, analyzeStock } from '@/ai/flows/financial-advisor-agent';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * A Micro-App for the Cash Canary, a live stock analysis tool.
 * Fulfills the "Rite of True Sight" by using a live data agent.
 */
export function FinancialAdvisor() {
  const [ticker, setTicker] = useState('');
  const [result, setResult] = useState<FinancialAdvisorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) {
      toast({
        title: 'Ticker Symbol Required',
        description: 'Please provide a stock ticker for the canary to inspect.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await analyzeStock({ ticker });
      setResult(analysisResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Market Interference',
        description: 'The agent could not retrieve data. The ticker might be invalid or the market is closed.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-card/50 sigil-codex p-4 gap-4">
        <form onSubmit={handleSubmit} className="space-y-4">
            <Label htmlFor="ticker">Stock Ticker</Label>
            <div className="flex gap-2">
                <Input
                    id="ticker"
                    placeholder="e.g., GME"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    disabled={isLoading}
                    maxLength={5}
                />
                <Button type="submit" disabled={isLoading} className="whitespace-nowrap">
                    {isLoading ? 'Scanning...' : 'Consult Canary'}
                </Button>
            </div>
        </form>
      
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
                <DollarSign className="h-4 w-4" />
                <AlertTitle className='flex justify-between items-center'>
                    <span className='sigil-obelisk'>{ticker}</span>
                    <span className={`text-2xl font-mono ${result.price > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${result.price.toFixed(2)}
                    </span>
                </AlertTitle>
                <AlertDescription className="mt-2">
                    {result.commentary}
                </AlertDescription>
            </Alert>
        )}
      </div>
       <div className="text-center text-xs text-muted-foreground/50 pt-2">
          This is not financial advice. This is performance art.
       </div>
    </div>
  );
}
