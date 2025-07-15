
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
  appComponentRegistry: Partial<Record<MicroAppType, React.ComponentType<any>>>;
  addMicroApp: (app: Omit<MicroApp, 'id' | 'zIndex'>) => void;
  removeMicroApp: (id: string) => void;
  setActiveMicroAppId: (id: string) => void;
  closeMicroApp: (id: string) => void;
  handleCommandSubmit: (command: string) => Promise<string>;
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
    const existingApp = state.microApps.find(a => a.type === app.type);
    if (existingApp) {
      const highestZIndex = getHighestZIndex(state.microApps);
      set({
        activeMicroAppId: existingApp.id,
        microApps: state.microApps.map(a =>
            a.id === existingApp.id ? { ...a, zIndex: highestZIndex + 1 } : a
        ),
      });
      return {}; 
    }

    const newId = `${app.type}-${Date.now()}`;
    const highestZIndex = getHighestZIndex(state.microApps);
    
    const newApp: MicroApp = {
      ...app,
      id: newId,
      zIndex: highestZIndex + 1,
    };

    return { 
      microApps: [...state.microApps, newApp],
      activeMicroAppId: newId 
    };
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
    try {
        const { addMicroApp } = get();
        const result = await processUserCommand(command);

        if (result.appToLaunch) {
            addMicroApp(result.appToLaunch);
        }
        
        return result.response;
    } catch (error) {
        console.error("Error in handleCommandSubmit:", error);
        return "Aegis Alert: A critical error occurred in the command processing pipeline.";
    }
  },
}));
