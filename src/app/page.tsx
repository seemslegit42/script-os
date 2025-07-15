
"use client";

import React, { useEffect } from "react";
import { Canvas } from "@/components/canvas";
import { useAppStore } from "@/store/app-store";
import { Header } from "@/components/header";
import { Terminal } from "@/components/micro-apps/terminal";

// Register Micro-App components into the store.
// This fulfills the "Micro-App Registry" requirement.
useAppStore.setState({ 
  appComponentRegistry: {
    ...useAppStore.getState().appComponentRegistry,
    Terminal: Terminal,
  } 
});

/**
 * The main page for an authenticated user, representing the Canvas.
 * This is the primary workspace where all user interaction with Micro-Apps occurs.
 */
export default function CanvasPage() {
  // A mock user and workspace for demonstration purposes.
  // In a real application, this would come from a session context.
  const mockUser = {
    id: 'user_clx01',
    firstName: 'Sovereign',
    lastName: 'Initiate',
    email: 'initiate@aevonos.com',
    avatarUrl: 'https://placehold.co/100x100.png',
  }
  const mockWorkspace = {
    id: 'ws_clx01',
    name: 'The First Foundry',
    creditBalance: 10000,
  }

  const { microApps, activeMicroAppId, setActiveMicroAppId, closeMicroApp, addMicroApp } = useAppStore();

  useEffect(() => {
    // Launch the terminal by default on first load for demonstration
    if (microApps.length === 0) {
      addMicroApp({ type: 'Terminal', title: 'Terminal' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
