
"use client";

import React, { useActionState, useRef, useEffect, useState } from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { ScribeGlyph } from "@/components/icons";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScribeForm } from "@/components/scribe-form";
import { createSigilAction } from "./actions";
import { useTypographicState } from "@/context/typographic-state-context";

const initialState = { sigilContent: null, sigilImageUrl: null, error: null };

export default function ScriptoriumLayout() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createSigilAction, initialState);
  const { sigilContent, sigilImageUrl, error } = state;
  const { applyState, currentState } = useTypographicState();

  useEffect(() => {
    if (isPending) {
      applyState('active');
    } else if (currentState !== 'default') {
      applyState('default');
    }
  }, [isPending, applyState, currentState]);
  
  return (
    <>
      <AethericStreams />
      
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="text-left">
          <ScribeGlyph className="h-8 w-8 text-primary inline-block" />
          <span className="text-xl font-bold tracking-wider sigil-obelisk text-primary ml-2 align-middle">
            SIGILFORGE
          </span>
        </div>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 pt-24">
        <div className="mx-auto max-w-3xl w-full space-y-8">
            <ScribeForm formAction={formAction} formRef={formRef} isPending={isPending} />

            {(isPending || sigilContent || sigilImageUrl || error) && (
              <Card className="bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10">
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
