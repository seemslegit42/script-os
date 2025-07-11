
'use client';

import React, { useRef, useMemo } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { ConstellationNode } from './constellation-node';
import { Scripture } from '@/lib/types';
import { ScribeSigil } from './icons';

type ConstellationCanvasProps = {
  scriptures: Scripture[];
  onNodeClick: (scripture: Scripture) => void;
  selectedNodeId: string | null;
};

// A simple pseudo-random number generator for deterministic positioning
const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export function ConstellationCanvas({ scriptures, onNodeClick, selectedNodeId }: ConstellationCanvasProps) {
  const constraintsRef = useRef(null);

  const nodePositions = useMemo(() => {
    return scriptures.map(scripture => {
      // Create a unique-ish numeric seed from the scripture ID string
      const seed = scripture.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const random = mulberry32(seed);
      
      // Generate positions within a large virtual canvas to spread them out
      const x = (random() * 200) - 100; // % values, e.g., -100% to 100% of the viewport
      const y = (random() * 200) - 100;

      return { id: scripture.id, x, y };
    });
  }, [scriptures]);
  
  return (
    <div ref={constraintsRef} className="w-full h-full bg-background overflow-hidden cursor-grab active:cursor-grabbing relative">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
            <ScribeSigil className="h-[80vh] w-[80vh] text-primary/5 opacity-50" />
        </div>
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragTransition={{ power: 0.1, timeConstant: 200 }}
            className="w-full h-full relative z-10"
        >
            <div className="absolute w-[300%] h-[300%] top-[-100%] left-[-100%]">
                {scriptures.map(scripture => {
                    const position = nodePositions.find(p => p.id === scripture.id);
                    if (!position) return null;
                    
                    return (
                        <ConstellationNode
                            key={scripture.id}
                            scripture={scripture}
                            position={{ x: `${50 + position.x / 3}%`, y: `${50 + position.y / 3}%` }} // Convert to percentage for positioning
                            onClick={() => onNodeClick(scripture)}
                            isSelected={selectedNodeId === scripture.id}
                        />
                    );
                })}
            </div>
        </motion.div>
    </div>
  );
}
