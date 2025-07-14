
"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { ConversationContainer } from "@/components/conversation-container";
import { streamFlow } from '@genkit-ai/next/client';
import type { ConversationState, ConversationMessage } from '@/app/actions';

/**
 * The main page of the Scriptorium application.
 * This page serves as the primary interface for conversing with the AI Scribe.
 */
export default function ScriptoriumPage() {
  const [state, setState] = React.useState<ConversationState>({ conversation: [], error: null });
  const { run: runConversation, value, running, traces } = streamFlow(
    'unifiedConversationAction',
    {
      onSuccess: (result) => {
        // This is called after the stream is fully complete.
        // The final message with the audioUrl is handled by the `value` effect.
      },
      onError: (err) => {
        const agentErrorMessage: ConversationMessage = {
          role: 'agent',
          content: `An error occurred: ${err.message || 'Unknown error.'}`,
          isError: true,
        };
        setState(prevState => {
            const newConversation = [...prevState.conversation];
            if (newConversation[newConversation.length-1]?.isThinking) {
                newConversation[newConversation.length - 1] = agentErrorMessage;
            } else {
                newConversation.push(agentErrorMessage);
            }
            return { ...prevState, conversation: newConversation, error: err.message };
        });
      },
    }
  );

  const handleSubmit = (query: string) => {
    if (!query.trim()) return;

    const userMessage: ConversationMessage = { role: 'user', content: query };
    const agentThinkingMessage: ConversationMessage = {
      role: 'agent',
      content: 'The Oracle is contemplating...',
      isThinking: true,
    };
    
    setState(prevState => ({
      ...prevState,
      conversation: [...prevState.conversation, userMessage, agentThinkingMessage],
      error: null,
    }));

    runConversation(query);
  };
  
  useEffect(() => {
    if(value) {
        setState(prevState => {
            const newConversation = [...prevState.conversation];
            if (newConversation.length > 0 && newConversation[newConversation.length - 1].isThinking) {
                // First chunk, replace thinking message
                newConversation[newConversation.length - 1] = value;
            } else if (newConversation.length > 0 && newConversation[newConversation.length - 1].role === 'agent') {
                // Subsequent chunks, update the last agent message
                newConversation[newConversation.length - 1] = value;
            }
            return { ...prevState, conversation: newConversation };
        });
    }
  }, [value]);


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
      <AethericStreams isThinking={running} />
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
              formAction={handleSubmit}
              isPending={running}
            />
        </motion.div>
      </main>
    </>
  );
}
