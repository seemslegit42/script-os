
"use client";

import React from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { ConversationManager } from "@/components/conversation-manager";

export default function ScriptoriumPage() {
  const [isPending, startTransition] = React.useTransition();

  return (
    <>
      <Head>
        <title>Scribe - Scriptorium</title>
      </Head>
      <AethericStreams isThinking={isPending} />
      <Header />
      
      <main className="container mx-auto flex flex-col h-[calc(100vh-80px)] pt-20">
        <ConversationManager 
            setIsPending={startTransition} 
            isPending={isPending}
        />
      </main>
    </>
  );
}
