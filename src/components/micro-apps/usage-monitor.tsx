
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

// Define the shape of the usage data we expect from the API
interface UsageDetails {
  planName: string;
  actionsUsed: number;
  actionLimit: number;
  transactions: {
    id: string;
    type: 'DEBIT' | 'CREDIT' | 'TRIBUTE';
    description: string;
    amount: number;
    timestamp: string;
  }[];
}

/**
 * A Micro-App that displays a workspace's economic activity, including
 * agent action usage and transaction history. It fetches this data from
 * a dedicated API endpoint.
 */
export function UsageMonitor() {
  const [usage, setUsage] = useState<UsageDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/billing/usage');
        if (!response.ok) {
          throw new Error('Failed to fetch usage data.');
        }
        const data = await response.json();
        setUsage(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsage();
  }, []);

  const usagePercentage = usage ? (usage.actionsUsed / usage.actionLimit) * 100 : 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-full" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="p-4 text-destructive">Error: {error}</div>;
    }

    if (usage) {
      return (
        <div className="p-4 h-full flex flex-col">
            <div className='pb-4'>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold sigil-obelisk text-primary-foreground">Agent Actions</h3>
                    <Badge variant="outline" className='sigil-glyph'>{usage.planName} Plan</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 sigil-codex">
                    Your workspace has used {usage.actionsUsed.toLocaleString()} of {usage.actionLimit.toLocaleString()} available agent actions this cycle.
                </p>
                <Progress value={usagePercentage} className="w-full" />
            </div>
            <div className="border-t border-border mt-2 pt-4 flex-grow flex flex-col">
                <h4 className="text-md font-bold text-primary-foreground sigil-obelisk mb-2">Tribute Log</h4>
                <ScrollArea className="flex-grow">
                    <div className="space-y-2 pr-4">
                    {usage.transactions.map(tx => (
                        <div key={tx.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
                            <div>
                                <p className="font-medium sigil-codex">{tx.description}</p>
                                <p className="text-xs text-muted-foreground sigil-glyph">{new Date(tx.timestamp).toLocaleString()}</p>
                            </div>
                            <p className={`font-mono font-bold ${tx.type === 'CREDIT' ? 'text-green-400' : 'text-amber-400'}`}>
                                {tx.type === 'CREDIT' ? '+' : '-'} {tx.amount.toLocaleString()} Ξ
                            </p>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="h-full w-full bg-card">
      {renderContent()}
    </div>
  );
}
