
"use client";

import * as React from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, FileText, Settings, Shield } from "lucide-react";
import { AethericStreams } from "@/components/aetheric-streams";
import { ScribeGlyph } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScribeForm } from "@/components/scribe-form";
import { useFormState } from "react-dom";
import { createSigilAction } from "./actions";

export default function ScriptoriumLayout() {
  const [state, formAction] = useFormState(createSigilAction, { sigilContent: null, error: null });

  const { sigilContent } = state;
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // A simple way to detect loading state from the form action
    const form = document.querySelector('form');
    if (form) {
      const handleFormSubmit = () => {
        // A small delay to allow the form state to update
        setTimeout(() => {
          setIsLoading(true);
        }, 50);
      };

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-pending') {
            const isPending = form.hasAttribute('data-pending');
            if (!isPending && isLoading) {
              setIsLoading(false);
            }
          }
        });
      });

      // Start observing the form for the data-pending attribute
      observer.observe(form, { attributes: true });

      form.addEventListener('submit', handleFormSubmit);

      return () => {
        form.removeEventListener('submit', handleFormSubmit);
        observer.disconnect();
      };
    }
  }, [isLoading]);

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
      <SidebarInset>
        <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-bold tracking-wider sigil-obelisk text-primary mb-8">
                Summon the Scribe
            </h1>
            
            <ScribeForm formAction={formAction} />

            {(isLoading || sigilContent) && (
              <Card className="mt-8 bg-card/50">
                  <CardContent className="p-6">
                      {isLoading ? (
                          <div className="space-y-4">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-20 w-full" />
                              <Skeleton className="h-4 w-1/2" />
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
      </SidebarInset>
    </>
  );
}
