
"use client";

import React, { useActionState, useRef, useEffect, useState } from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { ConversationManager } from "@/components/conversation-manager";
import { addDocument } from "./scriptorium/actions";
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

    try {
      await addDocument({
        userId: user.uid,
        query: sigil.query,
        why: sigil.why,
        how: sigil.how,
        imageUrl: sigil.imageUrl,
        createdAt: new Date(),
      });
      toast({
        title: "Sigil Bound",
        description: "The scripture has been bound to your personal Scriptorium.",
        action: (
          <button onClick={() => router.push('/forge')} className="p-2 bg-primary-foreground text-primary rounded-md">View Scriptorium</button>
        )
      });
    } catch(e: any) {
       toast({ title: "Binding Failed", description: e.message || "Could not bind sigil.", variant: "destructive" });
    }
  };


  return (
    <>
      <Head>
        <title>Scriptorium | Scribe</title>
      </Head>
      <AethericStreams isThinking={isPending} />
      <Header page="scribe">
        <div />
      </Header>
      
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
