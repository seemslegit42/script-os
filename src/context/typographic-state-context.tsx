'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type NexusState = 'active' | 'sanctuary' | 'contextSwitch' | 'echo' | 'default';

type TypographicState = {
  wght: number;
  slnt: number;
  casl: number;
  letterSpacing: number;
};

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

export const useTypographicState = () => {
  const context = useContext(TypographicStateContext);
  if (context === undefined) {
    throw new Error('useTypographicState must be used within a TypographicStateProvider');
  }
  return context;
};
