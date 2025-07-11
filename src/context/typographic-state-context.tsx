
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

/**
 * Defines the possible states for the application's typography.
 * Each state corresponds to a different typographic style.
 */
type NexusState = 'active' | 'sanctuary' | 'contextSwitch' | 'echo' | 'default';

/**
 * Defines the CSS font-variation-settings for a typographic state.
 * @property {number} wght - The font weight.
 * @property {number} slnt - The font slant.
 * @property {number} casl - The casual style setting.
 * @property {number} letterSpacing - The letter spacing percentage.
 */
type TypographicState = {
  wght: number;
  slnt: number;
  casl: number;
  letterSpacing: number;
};

/**
 * The context type for managing typographic state.
 * @property {(nexusState: NexusState) => void} applyState - Function to change the global typographic state.
 * @property {NexusState} currentState - The currently active typographic state name.
 */
interface TypographicStateContextType {
  applyState: (nexusState: NexusState) => void;
  currentState: NexusState;
}

const TypographicStateContext = createContext<TypographicStateContextType | undefined>(undefined);

const stateMappings: Record<NexusState, TypographicState> = {
  default: { wght: 400, slnt: 0, casl: 0.2, letterSpacing: 0 },
  active: { wght: 700, slnt: -5, casl: 0.5, letterSpacing: 0 },
  sanctuary: { wght: 400, slnt: 0, casl: 0.2, letterSpacing: 2 },
  contextSwitch: { wght: 500, slnt: 0, casl: 0.3, letterSpacing: 0 },
  echo: { wght: 600, slnt: -10, casl: 1, letterSpacing: 0 },
};

/**
 * A provider that manages and applies global typographic styles to the application.
 * It allows components to dynamically change font styles based on application state.
 * @param {{ children: ReactNode }} props - The child components to be rendered within the provider.
 */
export const TypographicStateProvider = ({ children }: { children: ReactNode }) => {
  const [typographicState, setTypographicState] = useState<TypographicState>(stateMappings.default);
  const [currentState, setCurrentState] = useState<NexusState>('default');

  const applyState = (nexusState: NexusState) => {
    setTypographicState(stateMappings[nexusState]);
    setCurrentState(nexusState);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--sigil-wght', String(typographicState.wght));
    document.documentElement.style.setProperty('--sigil-slnt', String(typographicState.slnt));
    document.documentElement.style.setProperty('--sigil-casl', String(typographicState.casl));
    document.documentElement.style.setProperty('--sigil-letterspacing', `${typographicState.letterSpacing}%`);
  }, [typographicState]);

  return (
    <TypographicStateContext.Provider value={{ applyState, currentState }}>
      {children}
    </TypographicStateContext.Provider>
  );
};

/**
 * A custom hook to access the typographic state context.
 * @returns {TypographicStateContextType} The typographic state context.
 * @throws {Error} If used outside of a `TypographicStateProvider`.
 */
export const useTypographicState = () => {
  const context = useContext(TypographicStateContext);
  if (context === undefined) {
    throw new Error('useTypographicState must be used within a TypographicStateProvider');
  }
  return context;
};
