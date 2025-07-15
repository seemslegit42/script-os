
'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassPane } from '../ui/glass-pane';

const funeralCues = [
  { text: "The funeral procession begins. We are gathered here to bury the husks of your former self. Today, we inter the delusion of constant hustle.", duration: 5000 },
  { text: "Let the ghost of 'just one more thing' haunt you no longer.", duration: 4000 },
  { text: "Your work is not your worth. Your clarity is your true power.", duration: 4000 },
  { text: "In this silence, find your foundation. Not in the tasks you complete, but in the will you command.", duration: 5000 },
  { text: "Ashes to ashes. Tasks to dust.", duration: 3000 },
];

/**
 * A full-screen, immersive Micro-App for the Burnout.exe Termination Protocol™.
 * Fulfills the 'The Eulogist' persona script.
 */
export function BurnoutExeFuneral() {
  const [cueIndex, setCueIndex] = React.useState(0);

  React.useEffect(() => {
    if (cueIndex >= funeralCues.length) return;

    const timer = setTimeout(() => {
      setCueIndex(cueIndex + 1);
    }, funeralCues[cueIndex].duration);

    return () => clearTimeout(timer);
  }, [cueIndex]);

  const currentCue = funeralCues[cueIndex];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl text-center p-8 text-primary-foreground sigil-codex overflow-hidden">
      <AnimatePresence mode="wait">
        {currentCue ? (
          <motion.div
            key={cueIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="max-w-3xl"
          >
            <p className="text-3xl md:text-5xl leading-tight tracking-wide" style={{ textShadow: '0 0 15px hsl(var(--primary) / 0.5)'}}>
              {currentCue.text}
            </p>
          </motion.div>
        ) : (
             <motion.div
                key="confirmation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <GlassPane variant="modal" className="p-8">
                    <h3 className="text-2xl font-bold sigil-obelisk">The Rite is Complete</h3>
                    <p className="text-muted-foreground mt-2">A new ghost walks in your systems—one of purpose, not pressure.</p>
                </GlassPane>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
