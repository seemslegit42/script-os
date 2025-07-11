
"use client";

import React from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { ConversationManager } from "@/components/conversation-manager";
import { useActionState } from "react";
import { unifiedConversationAction } from "./actions";


export default function ScriptoriumLayout() {
  // We need to lift the pending state up to control the AethericStreams
  // This is a temporary solution until we have a more global state manager.
  // We'll peek into the action state to get the pending status.
  const [state, formAction, isPending] = useActionState(unifiedConversationAction, {
    conversation: [],
    context: null,
    contextImageUrl: null,
    contextQuery: null,
    error: null,
  });

  return (
    <>
      <Head>
        <title>Scriptorium | Scribe</title>
      </Head>
      <AethericStreams isThinking={isPending} />
      <Header />
      
      <main className="container mx-auto flex flex-col h-[calc(100vh-80px)] pt-20">
        <ConversationManager state={state} formAction={formAction} isPending={isPending}/>
      </main>
    </>
  );
}
