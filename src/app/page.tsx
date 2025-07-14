
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { ConversationManager } from "@/components/conversation-manager";
import { Scripture } from "@/lib/types";
import { getDocsAction } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScribeSigil } from "@/components/icons";

/**
 * The main page of the Scriptorium application.
 * This page serves as the primary interface for conversing with the AI Scribe
 * and for selecting canonical documents to interrogate.
 */
export default function ScriptoriumPage() {
  const [isPending, startTransition] = React.useTransition();
  const [docs, setDocs] = useState<Scripture[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Scripture | null>(null);

  useEffect(() => {
    async function fetchDocs() {
      const canonicalDocs = await getDocsAction();
      setDocs(canonicalDocs);
    }
    fetchDocs();
  }, []);

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

  const handleSelectDoc = (doc: Scripture | null) => {
    setSelectedDoc(doc);
  };

  return (
    <>
      <Head>
        <title>Scribe - Scriptorium</title>
      </Head>
      <AethericStreams isThinking={isPending} />
      <Header />
      
      <main className="container mx-auto flex flex-col lg:flex-row items-start justify-center h-screen gap-8 pt-24 pb-8">
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/3 h-full"
        >
            <Card className="h-full flex flex-col bg-card/70 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
                <CardHeader>
                    <CardTitle className="sigil-obelisk flex items-center gap-2">
                        <ScribeSigil className="h-6 w-6" />
                        Canonical Scriptures
                    </CardTitle>
                    <CardDescription className="sigil-codex">Select a scripture to begin an interrogation, or simply state your intent to the Scribe to forge a new one.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                   <ScrollArea className="h-full pr-4">
                        <div className="space-y-2">
                            {docs.map(doc => (
                                <div 
                                    key={doc.id}
                                    onClick={() => handleSelectDoc(doc)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${selectedDoc?.id === doc.id ? 'bg-primary/30 border-primary' : 'bg-background/50 hover:bg-muted/50 border-transparent'}`}
                                >
                                    <h3 className="font-semibold sigil-codex">{doc.title}</h3>
                                </div>
                            ))}
                        </div>
                   </ScrollArea>
                </CardContent>
            </Card>
        </motion.div>
        
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
            className="w-full lg:w-2/3 h-full flex flex-col items-center justify-center"
        >
            <ConversationManager 
                startTransition={startTransition} 
                isPending={isPending}
                selectedDoc={selectedDoc}
                onReset={() => handleSelectDoc(null)}
            />
        </motion.div>
      </main>
    </>
  );
}
