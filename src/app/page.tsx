
"use client";

import React from "react";
import { motion } from "framer-motion";
import { AethericStreams } from "@/components/aetheric-streams";
import { Header } from "@/components/header";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScribeSigil } from "@/components/icons";

/**
 * The main page of the Scriptorium application.
 * This page serves as the primary interface for conversing with the AI Scribe.
 */
export default function ScriptoriumPage() {

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
        <title>Canvas - Scriptorium</title>
      </Head>
      <AethericStreams isThinking={false} />
      <Header />
      
      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen gap-8 pt-24 pb-8">
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
            className="w-full h-full flex flex-col items-center justify-center"
        >
            <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground sigil-codex bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 rounded-lg">
                <ScribeSigil className="h-20 w-20 text-primary/70 mb-4"/>
                <h1 className="text-2xl font-bold sigil-obelisk text-primary-foreground mb-2">The Canvas Awaits</h1>
                <p className="mb-6">This is your sovereign workspace. Please sign in to awaken it.</p>
                <Button asChild>
                    <Link href="/login">Enter the Scriptorium</Link>
                </Button>
            </div>
        </motion.div>
      </main>
    </>
  );
}
