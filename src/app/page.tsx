
"use client";

import React from "react";
import { motion } from "framer-motion";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { ConversationManager } from "@/components/conversation-manager";

export default function ScriptoriumPage() {
  const [isPending, startTransition] = React.useTransition();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -20
    }
  };

  return (
    <>
      <Head>
        <title>Scribe - Scriptorium</title>
      </Head>
      <AethericStreams isThinking={isPending} />
      <Header />
      
      <main className="container mx-auto flex flex-col items-center justify-center h-screen pt-20 pb-4">
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
            className="w-full h-full flex flex-col items-center justify-center"
        >
            <ConversationManager startTransition={startTransition} isPending={isPending} />
        </motion.div>
      </main>
    </>
  );
}
