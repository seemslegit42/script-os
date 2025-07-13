
'use client';

import React, { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ConstellationNode } from './constellation-node';
import { Scripture } from '@/lib/types';

/**
 * Props for the ConstellationCanvas component.
 * @property {Scripture[]} scriptures - The array of scriptures to display as nodes.
 * @property {(scripture: Scripture) => void} onNodeClick - Callback function when a node is clicked.
 * @property {string | null} selectedNodeId - The ID of the currently selected scripture node.
 * @property {(e: React.MouseEvent, scripture: Scripture) => void} onDeleteRequest - Callback function when a delete action is initiated on a node.
 */
type ConstellationCanvasProps = {
  scriptures: Scripture[];
  onNodeClick: (scripture: Scripture) => void;
  selectedNodeId: string | null;
  onDeleteRequest: (e: React.MouseEvent, scripture: Scripture) => void;
};

/**
 * A simple pseudo-random number generator for deterministic positioning.
 * This ensures that the constellation layout is the same every time for the same set of scriptures.
 * @param {number} seed - The seed for the random number generator.
 * @returns {() => number} A function that returns a pseudo-random number between 0 and 1.
 */
const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * A component that renders scriptures as an interactive, draggable constellation of nodes.
 * The layout is deterministic based on the scripture IDs.
 * @param {ConstellationCanvasProps} props - The component's props.
 */
export function ConstellationCanvas({ scriptures, onNodeClick, selectedNodeId, onDeleteRequest }: ConstellationCanvasProps) {
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
                            onDeleteRequest={(e) => onDeleteRequest(e, scripture)}
                        />
                    );
                })}
            </div>
        </motion.div>
    </div>
  );
}
