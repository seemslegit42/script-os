
"use client";

import React, { useActionState, useRef, useEffect, useState } from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { ScribeSigil, SaveSigil } from "@/components/icons";
import { LogIn, Swords } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScribeForm } from "@/components/scribe-form";
import { createSigilAction } from "./actions";
import { useTypographicState } from "@/context/typographic-state-context";
import { FocusLayer } from "@/components/focus-layer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { AuthModal } from "@/components/auth-modal";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/hooks/use-firestore";


const initialState = { sigil: null, sigilImageUrl: null, error: null, query: '' };

export default function ScriptoriumLayout() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createSigilAction, initialState);
  const { sigil, sigilImageUrl, error, query } = state;
  const { applyState, currentState } = useTypographicState();
  const { user, loading, signOut } = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { addDocument } = useFirestore('sigils');

  useEffect(() => {
    if (isPending) {
      applyState('active');
    } else if (currentState !== 'default') {
      applyState('default');
    }
  }, [isPending, applyState, currentState]);
  
  const handleMyForgeClick = () => {
    if (user) {
      router.push('/forge');
    } else {
      setAuthModalOpen(true);
    }
  }

  const handleSaveToForge = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be an Initiate to bind a sigil to your Scriptorium.",
        variant: "destructive",
      });
      setAuthModalOpen(true);
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

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      <AethericStreams />
      
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <ScribeSigil className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <span className="text-lg sm:text-xl font-bold tracking-wider sigil-obelisk text-primary align-middle">
            SIGILFORGE
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" onClick={handleMyForgeClick}>
            <Swords className="mr-0 sm:mr-2"/>
            <span className="hidden sm:inline">My Scriptorium</span>
          </Button>
          {loading ? (
            <Skeleton className="h-10 w-24 bg-muted/50" />
          ) : user ? (
             <Button onClick={() => signOut()} variant="outline">End Session</Button>
          ) : (
            <Button onClick={() => setAuthModalOpen(true)}>
              <LogIn className="mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Login / Initiate</span>
            </Button>
          )}
        </div>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 pt-24">
        <div className="mx-auto max-w-3xl w-full space-y-8">
            <ScribeForm formAction={formAction} formRef={formRef} isPending={isPending} />

            {(isPending || sigil || sigilImageUrl || error) && (
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
                      ) : (
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
                          {sigil && (
                            <>
                              <div className="flex justify-end">
                                <Button onClick={handleSaveToForge} variant="outline" size="sm">
                                  <SaveSigil className="mr-2" />
                                  Bind to Scriptorium
                                </Button>
                              </div>
                              <FocusLayer whyContent={sigil.why} howContent={sigil.how} />
                            </>
                          )}
                        </div>
                      )}
                  </CardContent>
              </Card>
            )}
        </div>
      </main>
    </>
  );
}
