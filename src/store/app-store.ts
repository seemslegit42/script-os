
import { create } from 'zustand';
import { MicroApp, MicroAppType } from '@/lib/types';
import React from 'react';

/**
 * Defines the state and actions for the main application store.
 * This store, powered by Zustand, manages the global state for the Canvas,
 * including the list of open Micro-Apps and their states.
 */
interface AppState {
  microApps: MicroApp[];
  activeMicroAppId: string | null;
  appComponentRegistry: Record<MicroAppType, React.ComponentType<any>>;
  addMicroApp: (app: Omit<MicroApp, 'id' | 'x' | 'y' | 'width' | 'height' | 'zIndex'>) => void;
  removeMicroApp: (id: string) => void;
  setActiveMicroAppId: (id: string) => void;
  closeMicroApp: (id: string) => void;
}

// Function to get the highest z-index from the current apps
const getHighestZIndex = (apps: MicroApp[]): number => {
  if (apps.length === 0) return 0;
  return Math.max(...apps.map(app => app.zIndex));
};

export const useAppStore = create<AppState>((set) => ({
  microApps: [],
  activeMicroAppId: null,
  appComponentRegistry: {} as Record<MicroAppType, React.ComponentType<any>>,

  addMicroApp: (app) => set((state) => {
    // Prevent duplicate apps of the same type for now
    if (state.microApps.some(existingApp => existingApp.type === app.type)) {
      // Bring the existing app to the front instead of adding a new one
      const existingApp = state.microApps.find(a => a.type === app.type)!;
      const highestZIndex = getHighestZIndex(state.microApps);
      return {
        activeMicroAppId: existingApp.id,
        microApps: state.microApps.map(a =>
            a.id === existingApp.id ? { ...a, zIndex: highestZIndex + 1 } : a
        ),
      };
    }

    const newId = `${app.type}-${Date.now()}`;
    const highestZIndex = getHighestZIndex(state.microApps);
    
    const newApp: MicroApp = {
      ...app,
      id: newId,
      x: 100 + Math.random() * 200, // Random initial position
      y: 100 + Math.random() * 100,
      width: 550, // Default width
      height: 400, // Default height
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

}));
