"use client";

import React from 'react';
import { ScribeSigil } from '../icons';

/**
 * The Pantheon Micro-App.
 * A ritual interface for sovereign relationship and operational memory.
 * Fulfills the 'The Pantheon' scripture.
 */
export function ThePantheon() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-card p-8 text-center sigil-codex">
        <ScribeSigil className="h-24 w-24 text-primary/70 mb-6" />
        <h2 className="text-2xl font-bold sigil-obelisk text-primary-foreground">The Pantheon</h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
            A ritual interface for sovereign relationship and operational memory. The age of dashboards is over.
        </p>
        <div className="mt-8 text-sm text-muted-foreground/50 sigil-glyph space-y-2">
            <p>Codex | Concord | Grimoire</p>
            <p>Shrine | Vault</p>
        </div>
    </div>
  );
}
