
"use client";

import React, { useActionState, useRef, useEffect, useState } from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { ScribeGlyph } from "@/components/icons";
import { Bot, User, LogIn, Swords } from "lucide-react";
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

const initialState = { sigil: null, sigilImageUrl: null, error: null };

export default function ScriptoriumLayout() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createSigilAction, initialState);
  const { sigil, sigilImageUrl, error } = state;
  const { applyState, currentState } = useTypographicState();
  const { user, loading, signOut } = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isPending) {
      applyState('active');
    } else if (currentState !== 'default') {
      applyState('default');
    }
  }, [isPending, applyState, currentState]);
  
  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      <AethericStreams />
      
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="text-left">
          <ScribeGlyph className="h-8 w-8 text-primary inline-block" />
          <span className="text-xl font-bold tracking-wider sigil-obelisk text-primary ml-2 align-middle">
            SIGILFORGE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => {
            if (user) {
              // Navigate to forge, for now just an alert
              alert("Entering The Forge...");
            } else {
              setAuthModalOpen(true);
            }
          }}>
            <Swords className="mr-2"/>
            My Forge
          </Button>
          {loading ? (
            <Skeleton className="h-10 w-24 bg-muted/50" />
          ) : user ? (
             <Button onClick={signOut} variant="outline">Sign Out</Button>
          ) : (
            <Button onClick={() => setAuthModalOpen(true)}>
              <LogIn className="mr-2" />
              Login
            </Button>
          )}
        </div>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 pt-24">
        <div className="mx-auto max-w-3xl w-full space-y-8">
            <ScribeForm formAction={formAction} formRef={formRef} isPending={isPending} />

            {(isPending || sigil || sigilImageUrl || error) && (
              <Card className="bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10">
                  <CardContent className="p-6">
                      {isPending ? (
                          <div className="space-y-6">
                              <Skeleton className="aspect-video w-full bg-muted/50" />
                              <div className="space-y-2">
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
                            />
                          )}
                          {sigil && (
                              <FocusLayer whyContent={sigil.why} howContent={sigil.how} />
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
