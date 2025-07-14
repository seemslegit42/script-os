
'use client';

import React, { useRef, useEffect } from 'react';
import { useTypographicState } from '@/context/typographic-state-context';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, CircleDashed } from 'lucide-react';
import { ExampleQuestions } from './example-questions';

/**
 * Props for the ConversationForm component.
 */
type ConversationFormProps = {
    formAction: (query: string) => void;
    isPending: boolean;
    onQuestionSelect?: (query: string) => void;
}

/**
 * A form component for submitting queries to the Oracle.
 * @param {ConversationFormProps} props - The component's props.
 */
export function ConversationForm({ formAction, isPending, onQuestionSelect }: ConversationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { applyState } = useTypographicState();
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = textareaRef.current?.value;
    if (!query?.trim()) return;
    
    formAction(query);

    if (textareaRef.current) {
      textareaRef.current.value = '';
      // Manually trigger resize after clearing
      textareaRef.current.style.height = 'auto';
    }
  };
  
  useEffect(() => {
    if(isPending) {
      applyState('active');
    } else {
      // Revert to default only if the textarea isn't focused
      if (document.activeElement !== textareaRef.current) {
        applyState('default');
      }
    }
  }, [isPending, applyState]);


  return (
    <div className="flex flex-col gap-4">
      {onQuestionSelect && <ExampleQuestions onQuestionSelect={onQuestionSelect} />}
      <form ref={formRef} onSubmit={handleFormSubmit} className="w-full flex items-start gap-2">
        <Textarea
          ref={textareaRef}
          name="query"
          placeholder={'Pose your query to the canon...'}
          required
          className="flex-grow sigil-glyph bg-background/80 focus:bg-background resize-none"
          disabled={isPending}
          onFocus={() => applyState('active')}
          onBlur={() => {
              if (!isPending) {
                applyState('default');
              }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isPending) {
                formRef.current?.requestSubmit();
              }
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isPending}>
          {isPending ? <CircleDashed className="animate-spin" /> : <Send />}
          <span className="sr-only">Submit Query</span>
        </Button>
      </form>
    </div>
  );
}
