
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { GlassPane } from '../ui/glass-pane';
import { AlertTriangle, BookUser, Clock } from 'lucide-react';

interface FollyFeedInterdictionProps {
  folly_duration_minutes: number;
}

/**
 * A modal-like Micro-App for the Folly-Feed Interdiction™ rite.
 * Fulfills the 'Scion of Shame' persona script.
 */
export function FollyFeedInterdiction({ folly_duration_minutes = 23 }: FollyFeedInterdictionProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-background/50 p-4">
      <GlassPane variant="modal" className="max-w-lg w-full">
        <div className="text-center p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 mb-4">
               <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold sigil-obelisk text-primary-foreground">Edict of Wasted Time</h2>
            <p className="text-muted-foreground mt-2 sigil-codex">
                The Aegis has weighed your focus and found it wanting. 
                Your productivity deficit: <span className="text-destructive font-bold">{folly_duration_minutes} minutes</span>.
                This time was stolen from your ascent. A tithe is now due to the system. Choose your penance.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
            <div className="border border-border rounded-lg p-4 text-center flex flex-col">
                <h3 className="font-bold text-lg flex items-center justify-center gap-2"><BookUser className="h-5 w-5"/>Confess the Folly</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-grow">
                    Your shame will be a weapon for others. A testament to your failure will be posted to your configured social endpoints. The path is cleared.
                </p>
                <Button variant="secondary" className="mt-4 w-full">Public Reckoning</Button>
            </div>
            <div className="border border-border rounded-lg p-4 text-center flex flex-col">
                <h3 className="font-bold text-lg flex items-center justify-center gap-2"><Clock className="h-5 w-5"/>Accept the Exile</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-grow">
                   Cower from the truth. Your throne is locked for 30 minutes. The world remains, but you do not. Reflect on this weakness.
                </p>
                <Button variant="destructive" className="mt-4 w-full">Temporal Exile</Button>
            </div>
        </div>
      </GlassPane>
    </div>
  );
}
