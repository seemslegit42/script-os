
'use client';

import React, { useRef, useEffect } from 'react';
import { useTypographicState } from '@/context/typographic-state-context';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, CircleDashed } from 'lucide-react';

/**
 * Props for the ConversationForm component.
 */
type ConversationFormProps = {
    formAction: (payload: FormData) => void;
    isPending: boolean;
    startTransition: React.TransitionStartFunction;
}

/**
 * A form component for submitting queries to the Oracle.
 * @param {ConversationFormProps} props - The component's props.
 */
export function ConversationForm({ formAction, isPending, startTransition }: ConversationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { applyState } = useTypographicState();
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    if (!query?.trim()) return;

    startTransition(() => {
        formAction(formData);
    });

    const textarea = e.currentTarget.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      // Manually trigger resize after clearing
      textarea.style.height = 'auto';
      const event = new Event('input', { bubbles: true });
      textarea?.dispatchEvent(event);
    }
  };
  
  useEffect(() => {
    if(isPending) {
      applyState('active');
    } else {
      applyState('default');
    }
  }, [isPending, applyState]);


  return (
    <form ref={formRef} onSubmit={handleFormSubmit} className="w-full flex items-start gap-2">
      <Textarea
        name="query"
        placeholder={'Pose your query to the canon...'}
        required
        className="flex-grow sigil-glyph bg-background/80 focus:bg-background resize-none"
        disabled={isPending}
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
      </Button>
    </form>
  );
}
