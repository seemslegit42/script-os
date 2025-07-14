
"use client";

import React from "react";
import { motion } from "framer-motion";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { useActionState } from 'react';
import { unifiedConversationAction, ConversationState } from '@/app/actions';
import { ConversationContainer } from "@/components/conversation-container";

const initialState: ConversationState = {
  conversation: [],
  error: null,
};

/**
 * The main page of the Scriptorium application.
 * This page serves as the primary interface for conversing with the AI Scribe.
 */
export default function ScriptoriumPage() {
  const [state, formAction, isPending] = useActionState(unifiedConversationAction, initialState);
  const [isTransitioning, startTransition] = React.useTransition();

  // Combine the pending states
  const isThinking = isPending || isTransitioning;

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
      <AethericStreams isThinking={isThinking} />
      <Header />
      
      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen gap-8 pt-24 pb-8">
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
            className="w-full h-full flex flex-col items-center"
        >
            <ConversationContainer
              state={state}
              formAction={formAction}
              isPending={isThinking}
              startTransition={startTransition}
            />
        </motion.div>
      </main>
    </>
  );
}
