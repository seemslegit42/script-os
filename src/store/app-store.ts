
import { create } from 'zustand';
import { MicroApp, MicroAppType } from '@/lib/types';
import React from 'react';
import { processUserCommand } from '@/app/actions';

/**
 * Defines the state and actions for the main application store.
 * This store, powered by Zustand, manages the global state for the Canvas,
 * including the list of open Micro-Apps and their states, and a registry
 * for dynamically rendering Micro-App components.
 */
interface AppState {
  microApps: MicroApp[];
  activeMicroAppId: string | null;
  appComponentRegistry: Partial<Record<MicroAppType, React.ComponentType<any>>>; // Use Partial as it's populated at runtime
  addMicroApp: (app: Omit<MicroApp, 'id' | 'zIndex'>) => void;
  removeMicroApp: (id: string) => void;
  setActiveMicroAppId: (id: string) => void;
  closeMicroApp: (id: string) => void;
  handleCommandSubmit: (command: string) => Promise<string>; // Returns a response for the terminal
}

// Function to get the highest z-index from the current apps
const getHighestZIndex = (apps: MicroApp[]): number => {
  if (apps.length === 0) return 0;
  return Math.max(...apps.map(app => app.zIndex));
};

export const useAppStore = create<AppState>((set, get) => ({
  microApps: [],
  activeMicroAppId: null,
  appComponentRegistry: {},

  addMicroApp: (app) => set((state) => {
    // Prevent duplicate apps of the same type.
    const existingApp = state.microApps.find(a => a.type === app.type);
    if (existingApp) {
      // Bring the existing app to the front instead of adding a new one.
      const highestZIndex = getHighestZIndex(state.microApps);
      set({
        activeMicroAppId: existingApp.id,
        microApps: state.microApps.map(a =>
            a.id === existingApp.id ? { ...a, zIndex: highestZIndex + 1 } : a
        ),
      });
      return;
    }

    const newId = `${app.type}-${Date.now()}`;
    const highestZIndex = getHighestZIndex(state.microApps);
    
    const newApp: MicroApp = {
      ...app,
      id: newId,
      zIndex: highestZIndex + 1,
    };

    set({ 
      microApps: [...get().microApps, newApp],
      activeMicroAppId: newId 
    });
  }),
  
  removeMicroApp: (id) => set((state) => ({
    microApps: state.microApps.filter(app => app.id !== id),
    activeMicroAppId: state.activeMicroAppId === id ? null : state.activeMicroAppId,
  })),

  setActiveMicroAppId: (id) => set((state) => {
    const highestZIndex = getHighestZIndex(state.microApps);
    return {
      activeMicroAppId: id,
      microApps: state.microApps.map(app => 
        app.id === id ? { ...app, zIndex: highestZIndex + 1 } : app
      ),
    };
  }),

  closeMicroApp: (id: string) => {
    set((state) => ({
      microApps: state.microApps.filter((app) => app.id !== id),
      activeMicroAppId: state.activeMicroAppId === id ? null : state.activeMicroAppId
    }));
  },

  handleCommandSubmit: async (command: string): Promise<string> => {
    const { addMicroApp, microApps } = get();

    // Call the server-side BEEP agent
    const result = await processUserCommand(command);

    // If the agent wants to launch an app, do it.
    if (result.appToLaunch) {
      const existingApp = microApps.find(a => a.type === result.appToLaunch!.type);
      addMicroApp(result.appToLaunch);

      if (existingApp) {
        return `BEEP: ${result.appToLaunch.title} is already active. Bringing it to the forefront.`;
      }
    }

    // Return the agent's natural language response to be displayed in the terminal
    return result.response;
  },
}));
