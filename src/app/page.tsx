
"use client";

import React, { useActionState, useRef, useEffect, useState } from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { ScribeGlyph, Bot, User } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScribeForm } from "@/components/scribe-form";
import { createSigilAction } from "./actions";
import { useTypographicState } from "@/context/typographic-state-context";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { AuthModal } from "@/components/auth-modal";

const initialState = { sigilContent: null, sigilImageUrl: null, error: null };

export default function ScriptoriumLayout() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createSigilAction, initialState);
  const { sigilContent, sigilImageUrl, error } = state;
  const { applyState, currentState } = useTypographicState();
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isPending) {
      applyState('active');
    } else if (currentState !== 'default') {
      applyState('default');
    }
  }, [isPending, applyState, currentState]);
  
  return (
    <>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <AethericStreams />
      <div className="absolute top-4 right-4 z-10">
        {loading ? (
          <Skeleton className="h-10 w-24" />
        ) : user ? (
          <Button variant="secondary" onClick={() => { /* TODO: Implement Forge Link */ }}>
            My Forge
          </Button>
        ) : (
          <Button onClick={() => setAuthModalOpen(true)}>
            Login / Sign Up
          </Button>
        )}
      </div>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="mx-auto max-w-4xl w-full">
            <div className="text-center mb-8">
              <ScribeGlyph className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse [animation-duration:3s]" />
              <h1 className="text-4xl font-bold tracking-wider sigil-obelisk text-primary">
                  SIGILFORGE
              </h1>
              <p className="sigil-codex text-muted-foreground mt-2">Generate living ideas. Instantly.</p>
            </div>
            
            <ScribeForm formAction={formAction} formRef={formRef} isPending={isPending} />

            {(isPending || sigilContent || sigilImageUrl || error) && (
              <Card className="mt-8 bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10">
                  <CardContent className="p-6">
                      {isPending ? (
                          <div className="space-y-6">
                              <Skeleton className="h-64 w-full bg-muted/50" />
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
                              width={512}
                              height={512}
                              className="w-full h-auto rounded-lg border border-primary/30"
                              priority
                            />
                          )}
                          {sigilContent && (
                             <div 
                                className="prose prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded"
                                dangerouslySetInnerHTML={{ __html: sigilContent }}
                            />
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
