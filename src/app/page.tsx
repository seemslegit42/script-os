
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
import { User, Workspace } from "@/lib/types";

// Mock data for authenticated user state, as per doctrine.
// In a real application, this would come from a session provider.
const mockUser: User = {
  id: 'user_clx01_sovereign_initiate',
  email: 'initiate@aevonos.com',
  firstName: 'Sovereign',
  lastName: 'Initiate',
};

const mockWorkspace: Workspace = {
  id: 'ws_clx01_nexus',
  name: 'The Nexus',
  aetherBalance: 147820,
};

/**
 * The main page for an authenticated user, representing the Canvas.
 * This is the primary workspace where all user interaction with Micro-Apps occurs.
 */
export default function CanvasPage() {
  const { microApps, activeMicroAppId, setActiveMicroAppId, closeMicroApp, appComponentRegistry } = useAppStore();

  // Register all available Micro-Apps on component mount.
  // This is the "Agent Registry" for the frontend.
  useEffect(() => {
    useAppStore.setState({ 
      appComponentRegistry: {
        Terminal,
        FinancialAdvisor,
        BeepWingman,
        InfidelityRadar,
        DossierViewer,
        TheSovereignArsenal,
        UsageMonitor,
      }
    });
  }, []);


  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex flex-col">
      <Header user={mockUser} workspace={mockWorkspace} />
      <main className="flex-1 relative">
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
