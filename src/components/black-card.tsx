
'use client';

import { Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScribeGlyph } from './icons';

interface BlackCardProps {
  isLocked: boolean;
  userName: string;
  sovereigntyClass: string;
}

export function BlackCard({ isLocked, userName, sovereigntyClass }: BlackCardProps) {
  return (
    <div className="relative aspect-[1.586] w-full max-w-sm mx-auto">
      {/* Background and Gloss Effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl transition-all duration-500',
          'bg-gradient-to-br from-gray-900 to-gray-950',
          'shadow-2xl shadow-primary/20'
        )}
      >
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-repeat opacity-5" />
        <div 
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/40 rounded-full blur-[100px] opacity-50"
          style={{ transform: 'translateZ(-100px)' }}
        />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full blur-[80px] opacity-30" />
        <div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-30"
            style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 10%, 0% 50%)'
            }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col justify-between h-full p-6 text-white">
        <div className="flex justify-between items-start">
          <ScribeGlyph className="h-10 w-10 text-primary" />
          <div className="text-right">
            <h3 className="font-bold text-lg leading-tight sigil-obelisk">ΛΞVON</h3>
            <p className="text-xs opacity-70 sigil-codex">Sovereign's Sigil</p>
          </div>
        </div>

        <div className="text-center">
            {/* Placeholder for a chip */}
            <div className="h-10 w-14 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md mx-auto mb-4 border-2 border-yellow-600/50" />
        </div>
        
        <div className="text-left">
          <p className="text-xs opacity-70 sigil-codex">Architect</p>
          <p className="font-mono text-lg tracking-widest">{userName.toUpperCase()}</p>
          <p className="text-xs font-mono opacity-70">{sovereigntyClass}</p>
        </div>
      </div>

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-center p-4">
          <Lock className="h-12 w-12 text-accent/80 mb-4" />
          <h3 className="text-lg font-bold sigil-obelisk text-accent">COMMAND CARD LOCKED</h3>
          <p className="text-sm text-white/80 sigil-codex">
            Achieve <span className="text-accent font-bold">Sovereign</span> class to transmute power.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 text-xs bg-accent/20 text-accent px-3 py-1 rounded-full border border-accent/50 hover:bg-accent/30 transition-colors">
            <Sparkles className="h-3 w-3" />
            Learn More
          </button>
        </div>
      )}
    </div>
  );
}
