
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { ConversationContainer } from "@/components/conversation-container";
import { streamFlow } from '@genkit-ai/next/client';
import type { ConversationState, ConversationMessage } from '@/app/actions';

const CONVERSATION_SESSION_KEY = 'scriptoriumConversation';

/**
 * The main page of the Scriptorium application.
 * This page serves as the primary interface for conversing with the AI Scribe.
 */
export default function ScriptoriumPage() {
  const [state, setState] = useState<ConversationState>({ conversation: [], error: null });

  // Load conversation from sessionStorage on initial render
  useEffect(() => {
    try {
      const savedConversation = sessionStorage.getItem(CONVERSATION_SESSION_KEY);
      if (savedConversation) {
        const parsedConversation = JSON.parse(savedConversation);
        // Ensure we don't restore thinking or error states
        const cleanConversation = parsedConversation.filter((msg: ConversationMessage) => !msg.isThinking && !msg.isError);
        setState(prevState => ({ ...prevState, conversation: cleanConversation }));
      }
    } catch (e) {
      console.error("Could not load conversation from session storage", e);
    }
  }, []);

  // Save conversation to sessionStorage whenever it changes
  useEffect(() => {
    try {
      // Don't save transient states like 'thinking' or errors to the session
      const storableConversation = state.conversation.filter(msg => !msg.isThinking && !msg.isError);
      if (storableConversation.length > 0) {
        sessionStorage.setItem(CONVERSATION_SESSION_KEY, JSON.stringify(storableConversation));
      } else {
        sessionStorage.removeItem(CONVERSATION_SESSION_KEY);
      }
    } catch (e) {
      console.error("Could not save conversation to session storage", e);
    }
  }, [state.conversation]);

  const { run: runConversation, value, running } = streamFlow(
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
            if (newConversation[newConversation.length - 1]?.isThinking) {
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
