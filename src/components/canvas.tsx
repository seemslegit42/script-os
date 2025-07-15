
'use client';

import React from 'react';
import { MicroApp, MicroAppType } from '@/lib/types';
import { AethericStreams } from './aetheric-streams';
import { useAppStore } from '@/store/app-store';
import { MicroAppWindow } from './micro-app-window';
import { AnimatePresence } from 'framer-motion';

/**
 * Defines the props for the Canvas component.
 * @property {MicroApp[]} apps - An array of Micro-App instances to be rendered.
 * @property {string | null} activeAppId - The ID of the currently active (top-most) app.
 * @property {(id: string) => void} onAppSelect - Callback function when an app is selected (clicked).
 * @property {(id:string)=>void} onAppClose - Callback to close an app
 */
interface CanvasProps {
  apps: MicroApp[];
  activeAppId: string | null;
  onAppSelect: (id: string) => void;
  onAppClose: (id: string) => void;
}

/**
 * The main Canvas component, serving as the workspace for all Micro-Apps.
 * It renders the grid of apps and handles their lifecycle. It uses the
 * appComponentRegistry from the Zustand store to dynamically render app content.
 * @param {CanvasProps} props - The component's props.
 */
export function Canvas({ apps, activeAppId, onAppSelect, onAppClose }: CanvasProps) {
  const { appComponentRegistry } = useAppStore.getState();

  const renderAppContent = (appType: MicroAppType) => {
    const AppComponent = appComponentRegistry[appType];
    return AppComponent ? <AppComponent /> : <div>Error: App type '{appType}' not found in registry.</div>;
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AethericStreams isThinking={false} />

      <AnimatePresence>
        {apps.map((app) => (
            <MicroAppWindow
              key={app.id}
              id={app.id}
              title={app.title}
              isActive={app.id === activeAppId}
              onSelect={() => onAppSelect(app.id)}
              onClose={() => onAppClose(app.id)}
              zIndex={app.zIndex}
            >
              {renderAppContent(app.type)}
            </MicroAppWindow>
        ))}
      </AnimatePresence>

      {apps.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <h2 className="text-2xl text-muted-foreground/80 sigil-obelisk">The Canvas is Ready</h2>
            <p className="text-muted-foreground/60 sigil-codex">Issue a command to BEEP to begin your work.</p>
          </div>
        </div>
      )}
    </div>
  );
}
