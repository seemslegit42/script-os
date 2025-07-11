
'use client';

import { ScribeSigil } from './icons';
import { UploadSigil } from '@/app/forge/upload-sigil';
import Link from 'next/link';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

export function EmptyForge() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
      <ScribeSigil className="h-24 w-24 text-primary/50" />
      <h2 className="mt-6 text-3xl font-bold sigil-obelisk">The Void Awaits</h2>
      <p className="mt-2 max-w-md text-lg text-muted-foreground sigil-codex">
        Your Scriptorium is a tabula rasa, an empty constellation awaiting its first star. Forge a new scripture from pure intent, or bind one from an existing text.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
        <Link href="/">
          <Button size="lg" className="shadow-lg shadow-primary/20">
            <Sparkles className="mr-2" />
            Forge Scripture from Intent
          </Button>
        </Link>
        <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-border"></div>
            <span className="text-muted-foreground sigil-codex">OR</span>
            <div className="h-px w-8 bg-border"></div>
        </div>
        <UploadSigil />
      </div>
    </div>
  );
}
