
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scripture } from '@/lib/types';
import Image from 'next/image';
import { BookOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type ConstellationNodeProps = {
  scripture: Scripture;
  position: { x: string; y: string };
  onClick: () => void;
  isSelected: boolean;
};

export function ConstellationNode({ scripture, position, onClick, isSelected }: ConstellationNodeProps) {
  const title = scripture.title || scripture.query || scripture.fileName || "Untitled";

  const variants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.15, zIndex: 10 },
    selected: { scale: 1.25, zIndex: 20 },
  };

  return (
    <motion.div
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      variants={variants}
      initial="initial"
      animate={isSelected ? "selected" : "animate"}
      whileHover="hover"
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
      onClick={onClick}
    >
      <div className="relative group flex flex-col items-center justify-center cursor-pointer w-24 h-24 sm:w-32 sm:h-32">
        {/* Glowing aura */}
        <motion.div 
            className={cn(
                "absolute inset-0 rounded-full transition-colors",
                isSelected ? 'bg-accent/30 animate-pulse' : 'bg-primary/20 group-hover:bg-accent/20'
            )}
            style={{ filter: `blur(${isSelected ? '24px' : '16px'})` }}
        />

        {/* Core element */}
        <div className={cn(
            "relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border flex items-center justify-center bg-card/80 backdrop-blur-sm transition-all duration-300",
            isSelected ? "border-accent shadow-accent/40 shadow-lg" : "border-primary/50 group-hover:border-accent"
        )}>
          {scripture.imageUrl ? (
            <Image
              src={scripture.imageUrl}
              alt={`Sigil for ${title}`}
              width={80}
              height={80}
              className="w-full h-full object-cover rounded-full"
              data-ai-hint="abstract symbol"
            />
          ) : (
            <>
                {scripture.id.startsWith('canonical-') ? 
                    <BookOpen className={cn("w-8 h-8 transition-colors", isSelected ? "text-accent" : "text-primary/70 group-hover:text-accent")} /> :
                    <FileText className={cn("w-8 h-8 transition-colors", isSelected ? "text-accent" : "text-primary/70 group-hover:text-accent")} />
                }
            </>
          )}
        </div>
        
        {/* Title */}
        <motion.p 
            className={cn(
                "absolute bottom-[-20px] text-center w-40 text-xs px-2 py-1 rounded-md transition-all duration-300 sigil-codex truncate",
                isSelected ? 'opacity-100 bg-accent/20 text-accent-foreground font-bold' : 'opacity-0 group-hover:opacity-100 bg-popover text-popover-foreground'
            )}
        >
          {title}
        </motion.p>
      </div>
    </motion.div>
  );
}
