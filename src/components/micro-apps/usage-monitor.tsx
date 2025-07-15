
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the shape of the usage data we expect from the API
interface UsageDetails {
  planName: string;
  actionsUsed: number;
  actionLimit: number;
  aetherBalance: number;
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
 * a dedicated API endpoint. Fulfills the 'Usage-Monitor.md' scripture.
 */
export function UsageMonitor() {
  const [usage, setUsage] = useState<UsageDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsage() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/billing/usage');
        if (!response.ok) {
          throw new Error('Failed to fetch usage data from the ledger.');
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

  const renderLoadingSkeleton = () => (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-2 w-full" />
      </div>
      <Separator />
      <div className="space-y-3 pt-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );

  const renderUsageDashboard = () => (
    usage && (
      <div className="p-4 h-full flex flex-col">
          <div className='pb-4'>
              <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-bold sigil-obelisk text-primary-foreground">Aether Balance</h3>
                  <p className={`font-mono font-bold text-xl text-primary`}>
                    {usage.aetherBalance.toLocaleString()} Ξ
                  </p>
              </div>
               <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                  <p>Agent Actions</p>
                  <p>{usage.actionsUsed.toLocaleString()} / {usage.actionLimit.toLocaleString()}</p>
              </div>
              <Progress value={usagePercentage} className="w-full mt-1 h-2" />
          </div>
          <Separator className="my-2" />
          <div className="pt-2 flex-grow flex flex-col min-h-0">
              <h4 className="text-md font-bold text-primary-foreground sigil-obelisk mb-2">Tribute Log</h4>
              <ScrollArea className="flex-grow">
                  <div className="space-y-2 pr-4">
                  {usage.transactions.length > 0 ? usage.transactions.map(tx => (
                      <div key={tx.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
                          <div>
                              <p className="font-medium sigil-codex">{tx.description}</p>
                              <p className="text-xs text-muted-foreground sigil-glyph">{new Date(tx.timestamp).toLocaleString()}</p>
                          </div>
                          <p className={`font-mono font-bold ${tx.type === 'CREDIT' ? 'text-green-400' : 'text-amber-400'}`}>
                              {tx.type === 'CREDIT' ? '+' : '-'} {tx.amount.toLocaleString()} Ξ
                          </p>
                      </div>
                  )) : (
                    <div className="text-center text-muted-foreground text-sm py-8">
                        No tributes recorded in the ledger.
                    </div>
                  )}
                  </div>
              </ScrollArea>
          </div>
      </div>
    )
  );

  const renderChaosArsenal = () => (
    <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-bold sigil-obelisk text-primary-foreground">Chaos Arsenal</h3>
        <p className="text-sm text-muted-foreground mt-2 sigil-codex">
            This is where your acquired Chaos Cards will appear.
        </p>
        <Badge variant="outline" className="mt-4">Coming Soon</Badge>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return renderLoadingSkeleton();
    if (error) return <div className="p-4 text-center text-destructive sigil-codex">Error: {error}<br/>The ledger is sealed.</div>;
    return (
        <Tabs defaultValue="dashboard" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dashboard">Ledger of Tribute</TabsTrigger>
                <TabsTrigger value="arsenal">Chaos Arsenal</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="flex-grow min-h-0">
                {renderUsageDashboard()}
            </TabsContent>
            <TabsContent value="arsenal" className="flex-grow">
                {renderChaosArsenal()}
            </TabsContent>
        </Tabs>
    );
  };

  return (
    <div className="h-full w-full bg-card">
      {renderContent()}
    </div>
  );
}
