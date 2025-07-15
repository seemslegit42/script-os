
"use client";

import React, { useEffect } from "react";
import { Canvas } from "@/components/canvas";
import { Header } from "@/components/header";
import { useAppStore } from "@/store/app-store";
import { Terminal } from "@/components/micro-apps/terminal";
import { FinancialAdvisor } from "@/components/micro-apps/financial-advisor";
import { BeepWingman } from "@/components/micro-apps/beep-wingman";
import { InfidelityRadar } from "@/components/micro-apps/infidelity-radar";
import { DossierViewer } from "@/components/micro-apps/dossier-viewer";
import { TheSovereignArsenal } from "@/components/micro-apps/the-sovereign-arsenal";
import { UsageMonitor } from "@/components/micro-apps/usage-monitor";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * The main page for an authenticated user, representing the Canvas.
 * This is the primary workspace where all user interaction with Micro-Apps occurs.
 */
export default function CanvasPage() {
  const { microApps, activeMicroAppId, setActiveMicroAppId, closeMicroApp, addMicroApp } = useAppStore();

  // For this example, we'll treat the Canvas as a public-facing demo.
  // We'll show a welcome screen instead of a login-gated canvas.
  // In a real app, this would be protected by authentication.

  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold sigil-obelisk tracking-tight text-primary-foreground">
                The Scriptorium
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground sigil-codex max-w-xl mx-auto">
                A living, sentient codex for personal and operational myth. This is not a product. It is a mythware artifact.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                    <Link href="/library">Explore the Constellation</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/library/CORE-MANIFESTO">Read the Doctrine</Link>
                </Button>
            </div>
        </div>
      </main>
      <footer className="p-4 text-xs text-muted-foreground/50 text-center">
          <p>This is a technical demonstration of ΛΞVON OS. All rights reserved.</p>
      </footer>
    </div>
  );
}
