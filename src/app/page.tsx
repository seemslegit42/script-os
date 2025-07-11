
"use client";

import * as React from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, FileText, Settings, Shield } from "lucide-react";
import { AethericStreams } from "@/components/aetheric-streams";
import { ScribeGlyph } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Scripture = {
  id: string;
  title: string;
  icon: React.ElementType;
  content: string;
};

const mockScriptures: Scripture[] = [
    { 
        id: 'core-protocol', 
        title: 'Core Protocol', 
        icon: Shield,
        content: `
          <p>This is the content for the Core Protocol. It defines the foundational security and operational principles of the entire Nexus OS.</p>
          <p>The Obelisk tier is used for headings, creating a monumental, authoritative feel. The Codex tier provides the core reading experience—clear, neutral, and unobtrusive. The Glyph tier is reserved for <code>code snippets</code>, offering a precise, monospaced view of raw data and commands.</p>
          <pre><code class="sigil-glyph text-sm text-accent whitespace-pre-wrap p-4 bg-black/30 rounded-lg border border-border block">
  nexus.command({
    action: "ACTIVATE_SENTIENCE",
    target: "TYPOGRAPHY_ENGINE",
    params: {
      mode: "EXTREME"
    }
  })
          </code></pre>
          <p>Interacting with these protocols requires Level 3 clearance. Unauthorized access attempts are logged and reported to Aegis command.</p>
        `
    },
    { 
        id: 'aether-spec', 
        title: 'Aether Specifications', 
        icon: FileText,
        content: `
            <p>The Aether Specifications detail the data transport layer of the Nexus. All inter-module communication flows through the Aether.</p>
            <p>This document outlines the packet structure, encryption standards, and bandwidth allocation protocols.</p>
            <pre><code class="sigil-glyph text-sm text-accent whitespace-pre-wrap p-4 bg-black/30 rounded-lg border border-border block">
  struct AetherPacket {
    uint64_t timestamp;
    uuid_t source_module;
    uuid_t target_module;
    byte[] payload;
  }
            </code></pre>
        `
    },
    { 
        id: 'nexus-api', 
        title: 'Nexus API', 
        icon: FileText,
        content: `
            <p>The Nexus API provides the primary interface for developers to interact with the OS core functions.</p>
            <p>Access is managed via token-based authentication. All endpoints are versioned.</p>
        `
    },
];

const mockManuals: Scripture[] = [
    { 
        id: 'getting-started', 
        title: 'Getting Started', 
        icon: Book,
        content: `
            <p>This manual provides a step-by-step guide for new initiates to the Nexus OS.</p>
            <p>Your first step is to configure your terminal environment and authenticate with the Genesis block.</p>
        `
    },
    { 
        id: 'advanced-config', 
        title: 'Advanced Configuration', 
        icon: Settings,
        content: `
            <p>This manual covers advanced topics such as kernel-level modifications, custom agent development, and network topology adjustments.</p>
            <p>Proceed with caution. Incorrect configuration can lead to system instability.</p>
        `
    },
]

const allScriptures = [...mockScriptures, ...mockManuals];

export default function ScriptoriumLayout() {
  const [activeScripture, setActiveScripture] = React.useState<Scripture>(mockScriptures[0]);
  const [sigilContent, setSigilContent] = React.useState<string | null>(activeScripture.content);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleSelectScripture = (scripture: Scripture) => {
    setIsLoading(true);
    setActiveScripture(scripture);
    // Simulate fetching content
    setTimeout(() => {
        setSigilContent(scripture.content);
        setIsLoading(false);
    }, 500);
  };

  // Initial load effect
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        setSigilContent(activeScripture.content);
        setIsLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

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
                {mockScriptures.map(item => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                        tooltip={item.title} 
                        isActive={item.id === activeScripture.id}
                        onClick={() => handleSelectScripture(item)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>User Manuals</SidebarGroupLabel>
                <SidebarMenu>
                    {mockManuals.map(item => (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton 
                                tooltip={item.title}
                                isActive={item.id === activeScripture.id}
                                onClick={() => handleSelectScripture(item)}
                            >
                                <item.icon />
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </ScrollArea>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold tracking-wider sigil-obelisk text-primary">
                    {isLoading ? <Skeleton className="h-6 w-48" /> : activeScripture.title}
                </h1>
            </div>
            
            <Card className="mt-8 bg-card/50">
                <CardContent className="p-6">
                    {isLoading || !sigilContent ? (
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ) : (
                        <div 
                            className="prose prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded"
                            dangerouslySetInnerHTML={{ __html: sigilContent }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
      </SidebarInset>
    </>
  );
}
