
"use client";

import React, { useState } from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { ConversationManager } from "@/components/conversation-manager";
import { addDocument } from "@/app/actions";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ScriptoriumPage() {
  const [isPending, startTransition] = React.useTransition();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSaveToForge = async (sigil: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be an Initiate to bind a sigil to your Scriptorium.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        await addDocument({
          query: sigil.query,
          why: sigil.why,
          how: sigil.how,
          imageUrl: sigil.imageUrl,
        });
        toast({
          title: "Sigil Bound",
          description: "The scripture has been bound and added to your Forge.",
        });
        router.push('/forge');
      } catch(e: any) {
         toast({ title: "Binding Failed", description: e.message || "Could not bind sigil.", variant: "destructive" });
      }
    });
  };

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
            onSaveToForge={handleSaveToForge}
        />
      </main>
    </>
  );
}
