
"use client";

import React from "react";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { ConversationManager } from "@/components/conversation-manager";


export default function ScriptoriumLayout() {
  return (
    <>
      <Head>
        <title>Scriptorium | Scribe</title>
      </Head>
      <AethericStreams />
      <Header />
      
      <main className="container mx-auto flex flex-col h-[calc(100vh-80px)] pt-20">
        <ConversationManager />
      </main>
    </>
  );
}
