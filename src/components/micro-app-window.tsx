
'use client';

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScribeSigil } from './icons';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface MicroAppWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
  zIndex: number;
}

/**
 * A draggable, resizable window container for Micro-Apps.
 * It provides the standard window "chrome" like a title bar and close button.
 */
export function MicroAppWindow({ 
  id, 
  title, 
  children, 
  isActive, 
  onSelect,
  onClose,
  zIndex 
}: MicroAppWindowProps) {
  const [position, setPosition] = useState({ 
    x: window.innerWidth / 2 - 275 + (Math.random() - 0.5) * 100, 
    y: window.innerHeight / 2 - 200 + (Math.random() - 0.5) * 100 
  });
  const [size, setSize] = useState({ width: 550, height: 400 });
  const nodeRef = useRef(null);

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: position.x + data.deltaX, y: position.y + data.deltaY });
  };

  const onResize = (event: any, {node, size, handle}: any) => {
    setSize({ width: size.width, height: size.height });
  };

  return (
    <DraggableCore handle=".handle" onDrag={handleDrag} onStart={onSelect} nodeRef={nodeRef}>
      <Resizable height={size.height} width={size.width} onResize={onResize} minConstraints={[300, 200]} handleSize={[20, 20]}>
        <motion.div
          ref={nodeRef}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height
          }}
          exit={{ opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex,
          }}
          className="flex"
          onMouseDown={onSelect}
        >
          <Card 
            className={`w-full h-full flex flex-col bg-card/80 backdrop-blur-lg border transition-all duration-300 ${isActive ? 'border-primary/50 shadow-2xl shadow-primary/20' : 'border-border/50 shadow-xl'}`}
          >
            <CardHeader className="flex flex-row items-center justify-between p-2 pl-3 border-b cursor-move handle">
              <div className="flex items-center gap-2">
                <ScribeSigil className="h-5 w-5 text-primary/80" />
                <h3 className="text-sm font-medium text-foreground">{title}</h3>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-auto">
              {children}
            </CardContent>
          </Card>
        </motion.div>
      </Resizable>
    </DraggableCore>
  );
}
