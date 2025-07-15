"use client";

import React, { useEffect } from "react";
import { Canvas } from "@/components/canvas";
import { Header } from "@/components/header";
import { useAppStore } from "@/store/app-store";
import { Terminal } from "@/components/micro-apps/terminal";
import { UsageMonitor } from "@/components/micro-apps/usage-monitor";
import { ThePantheon } from "@/components/micro-apps/the-pantheon";

/**
 * The main page for an authenticated user, representing the Canvas.
 * This is the primary workspace where all user interaction with Micro-Apps occurs.
 */
export default function CanvasPage() {
  const { microApps, activeMicroAppId, setActiveMicroAppId, closeMicroApp, addMicroApp } = useAppStore();

  useEffect(() => {
    // Register all available Micro-Apps with the central store.
    // This allows BEEP to summon them by their type string.
    useAppStore.setState({ 
      appComponentRegistry: {
        'Terminal': Terminal,
        'UsageMonitor': UsageMonitor,
        'ThePantheon': ThePantheon,
      } 
    });

    // Launch the Terminal by default for immediate interaction.
    addMicroApp({ type: 'Terminal', title: 'BEEP Command Core' });
  }, [addMicroApp]);

  // Mock user and workspace for demonstration purposes.
  // In a real application, this would come from a session context.
  const mockUser = {
    id: 'user_clx01',
    firstName: 'Sovereign',
    lastName: 'Initiate',
    email: 'initiate@aevonos.com',
    avatarUrl: 'https://placehold.co/100x100.png',
  };
  const mockWorkspace = {
    id: 'ws_clx01',
    name: 'The First Foundry',
    creditBalance: 10000,
  };

  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex flex-col">
      <Header user={mockUser} workspace={mockWorkspace} />
      <main className="flex-1">
        <Canvas 
          apps={microApps} 
          activeAppId={activeMicroAppId}
          onAppSelect={setActiveMicroAppId}
          onAppClose={closeMicroApp}
        />
      </main>
    </div>
  );
}
