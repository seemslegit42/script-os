
"use client";

import React, { useActionState, useRef, useEffect } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Shield } from "lucide-react";
import { AethericStreams } from "@/components/aetheric-streams";
import { ScribeGlyph } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScribeForm } from "@/components/scribe-form";
import { createSigilAction } from "./actions";
import { useTypographicState } from "@/context/typographic-state-context";
import { cn } from "@/lib/utils";

export default function ScriptoriumLayout() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createSigilAction, { sigilContent: null, error: null });
  const { sigilContent, error } = state;
  const { applyState, currentState } = useTypographicState();
  
  // Directly use the form's pending state from the ref.
  // This is a more robust way to track loading state with server actions.
  const [isPending, setIsPending] = React.useState(false);
  
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    
    // Check pending status on mount and whenever the form might re-render.
    setIsPending(form.hasAttribute('data-pending'));
    
    // We can also observe for changes if needed, but often checking on re-render is enough.
    const observer = new MutationObserver(() => {
      setIsPending(form.hasAttribute('data-pending'));
    });
    
    observer.observe(form, { attributes: true, attributeFilter: ['data-pending'] });
    
    return () => observer.disconnect();
    
  }, [state]); // Re-run when `state` changes, which signals action completion.


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
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <ScribeGlyph className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold tracking-widest sigil-obelisk">ΛΞVON OS</h2>
              <p className="text-xs text-muted-foreground sigil-codex">Sentient Codex</p>
            </div>
          </div>
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>System Protocols</SidebarGroupLabel>
              <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Core Protocol" isActive={true}>
                      <Shield />
                      <span>Core Protocol</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Aether Specifications">
                      <FileText />
                      <span>Aether Specs</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </ScrollArea>
      </Sidebar>
      <main className="flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-bold tracking-wider sigil-obelisk text-primary mb-8 animate-pulse [animation-duration:3s]">
                Summon the Scribe
            </h1>
            
            <ScribeForm formAction={formAction} formRef={formRef} isPending={isPending} />

            {(isPending || sigilContent || error) && (
              <Card className="mt-8 bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10">
                  <CardContent className="p-6">
                      {isPending && !sigilContent && !error ? (
                          <div className="space-y-4">
                              <Skeleton className="h-4 w-3/4 bg-muted/50" />
                              <Skeleton className="h-4 w-full bg-muted/50" />
                              <Skeleton className="h-20 w-full bg-muted/50" />
                              <Skeleton className="h-4 w-1/2 bg-muted/50" />
                          </div>
                      ) : error ? (
                          <div className="prose prose-invert max-w-none sigil-codex text-destructive">
                            <h3 className="sigil-obelisk">Error</h3>
                            <p>{error}</p>
                          </div>
                      ) : (
                          <div 
                              className="prose prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded"
                              dangerouslySetInnerHTML={{ __html: sigilContent || "" }}
                          />
                      )}
                  </CardContent>
              </Card>
            )}
        </div>
      </main>
    </>
  );
}
