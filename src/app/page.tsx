
"use client";

import React, { useState } from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { ConversationManager } from "@/components/conversation-manager";
import { ScriptoriumDrawer } from "@/components/scriptorium-drawer";
import type { Scripture } from "@/lib/types";

export default function ScriptoriumPage() {
  const [isPending, setIsPending] = useState(false);
  const [selectedScripture, setSelectedScripture] = useState<Scripture | null>(null);

  const handleSelectScripture = (scripture: Scripture) => {
    setSelectedScripture(scripture);
  };
  
  const handleReturnToScribe = () => {
    setSelectedScripture(null);
  };

  return (
    <>
      <Head>
        <title>Scriptorium | Scribe</title>
      </Head>
      <AethericStreams isThinking={isPending} />
      <Header>
        <ScriptoriumDrawer onSelectScripture={handleSelectScripture} />
      </Header>
      
      <main className="container mx-auto flex flex-col h-[calc(100vh-80px)] pt-20">
        <ConversationManager 
            setIsPending={setIsPending} 
            isPending={isPending}
            selectedScripture={selectedScripture}
            onReturnToScribe={handleReturnToScribe}
            onScriptureCreated={handleSelectScripture}
        />
      </main>
    </>
  );
}

