
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AnnotationGlyph } from './icons';

export type Annotation = {
  id: string;
  selection: string;
  comment: string;
  targetId: string;
};

type AnnotatorProps = {
  children: React.ReactNode;
  contentId: string;
  onAnnotate: (annotation: Omit<Annotation, 'id'>) => void;
};

export function Annotator({ children, contentId, onAnnotate }: AnnotatorProps) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [comment, setComment] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSelection = useCallback(() => {
    const currentSelection = window.getSelection();
    if (currentSelection && currentSelection.toString().trim().length > 2 && contentRef.current?.contains(currentSelection.anchorNode)) {
      setSelection(currentSelection);
      setPopoverOpen(true);
    } else {
      // If popover is not being interacted with, close it.
      if (!popoverOpen) {
          setSelection(null);
      }
    }
  }, [popoverOpen]);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, [handleSelection]);
  
  const getPopoverStyle = (): React.CSSProperties => {
    if (!selection || selection.rangeCount === 0) {
      return { display: 'none' };
    }
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    return {
      position: 'absolute',
      top: `${rect.top + window.scrollY - 40}px`,
      left: `${rect.left + window.scrollX + rect.width / 2}px`,
      transform: 'translateX(-50%)',
      zIndex: 50,
    };
  };

  const handleAnnotate = () => {
    if (!selection || !comment.trim()) return;
    onAnnotate({
      selection: selection.toString(),
      comment: comment,
      targetId: contentId,
    });
    setComment('');
    setPopoverOpen(false);
    selection.removeAllRanges();
    setSelection(null);
  };
  
  return (
    <div ref={contentRef} className="relative">
      {selection && (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild style={getPopoverStyle()}>
                <Button variant="outline" size="icon" className="rounded-full shadow-lg shadow-primary/20 bg-card border-primary">
                    <AnnotationGlyph className="h-5 w-5 text-primary" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-card/90 backdrop-blur-lg border-primary/30">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none sigil-obelisk">Add Annotation</h4>
                        <p className="text-sm text-muted-foreground italic sigil-codex border-l-2 border-primary/50 pl-2">
                            &ldquo;{selection.toString()}&rdquo;
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Your insight..."
                            className="sigil-glyph bg-background/50"
                        />
                        <Button onClick={handleAnnotate}>Save Annotation</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
      )}
      {children}
    </div>
  );
}
