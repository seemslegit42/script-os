
'use client';

import { ScribeSigil } from './icons';
import Link from 'next/link';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

export function EmptyForge() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
      <ScribeSigil className="h-24 w-24 text-primary/50" />
      <h2 className="mt-6 text-3xl font-bold sigil-obelisk">The Library is Empty</h2>
      <p className="mt-2 max-w-md text-lg text-muted-foreground sigil-codex">
        No canonical scriptures were found and no scriptures have been forged yet. The constellation awaits its first star.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
        <Link href="/">
          <Button size="lg" className="shadow-lg shadow-primary/20">
            <Sparkles className="mr-2" />
            Forge a Scripture
          </Button>
        </Link>
      </div>
    </div>
  );
}
