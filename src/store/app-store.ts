
import { create } from 'zustand';
import { MicroApp } from '@/lib/types';

/**
 * Defines the state and actions for the main application store.
 * This store, powered by Zustand, manages the global state for the Canvas,
 * including the list of open Micro-Apps and their states.
 */
interface AppState {
  microApps: MicroApp[];
  activeMicroAppId: string | null;
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

  addMicroApp: (app) => set((state) => {
    const newId = `${app.type}-${Date.now()}`;
    const highestZIndex = getHighestZIndex(state.microApps);
    
    const newApp: MicroApp = {
      ...app,
      id: newId,
      x: 100 + Math.random() * 200, // Random initial position
      y: 100 + Math.random() * 100,
      width: 400,
      height: 300,
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
