
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SaveSigil } from '../icons';
import { FocusLayer } from '../focus-layer';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import type { GenerateSigilOutput } from '@/ai/flows/generate-sigil';

type OraclePanelState = {
  sigil: GenerateSigilOutput | null;
  sigilImageUrl: string | null;
  error: string | null;
  query: string;
};

type OraclePanelProps = {
  state: OraclePanelState;
  isPending: boolean;
};

export function OraclePanel({ state, isPending }: OraclePanelProps) {
  const { sigil, sigilImageUrl, error, query } = state;
  const { user } = useAuth();
  const { toast } = useToast();
  const { addDocument } = useFirestore('sigils');

  const handleSaveToForge = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be an Initiate to bind a sigil to your Scriptorium.",
        variant: "destructive",
      });
      return;
    }
    if (!sigil || !sigilImageUrl || !query) {
       toast({ title: "Error", description: "Cannot bind an incomplete sigil.", variant: "destructive" });
       return;
    }
    try {
      await addDocument({
        userId: user.uid,
        query,
        why: sigil.why,
        how: sigil.how,
        imageUrl: sigilImageUrl,
        createdAt: new Date(),
      });
      toast({
        title: "Sigil Bound",
        description: "The scripture has been bound to your personal Scriptorium.",
      });
    } catch(e: any) {
       toast({ title: "Binding Failed", description: e.message || "Could not bind sigil.", variant: "destructive" });
    }
  };

  if (!isPending && !sigil && !sigilImageUrl && !error) {
    return null; // Don't render anything if there's no activity
  }

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
        <CardContent className="p-6">
            {isPending ? (
                <div className="space-y-6">
                    <Skeleton className="aspect-video w-full bg-muted/50" />
                    <div className="space-y-2 pt-4">
                      <Skeleton className="h-8 w-48 bg-muted/50" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-3/4 bg-muted/50" />
                        <Skeleton className="h-4 w-full bg-muted/50" />
                        <Skeleton className="h-20 w-full bg-muted/50" />
                        <Skeleton className="h-4 w-1/2 bg-muted/50" />
                    </div>
                </div>
            ) : error ? (
                <div className="prose prose-invert max-w-none sigil-codex text-destructive">
                  <h3 className="sigil-obelisk">Error</h3>
                  <p>{error}</p>
                </div>
            ) : sigil && (
              <div className="space-y-6">
                {sigilImageUrl && (
                  <Image 
                    src={sigilImageUrl}
                    alt="Generated Sigil Image"
                    width={1024}
                    height={576}
                    className="w-full h-auto rounded-lg border border-primary/30 aspect-video object-cover"
                    priority
                    data-ai-hint="abstract spiritual"
                  />
                )}
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveToForge} variant="outline" size="sm">
                    <SaveSigil className="mr-2" />
                    Bind to Scriptorium
                  </Button>
                </div>

                <FocusLayer whyContent={sigil.why} howContent={sigil.how} />
              </div>
            )}
        </CardContent>
    </Card>
  );
}
