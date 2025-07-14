
'use client';

import React, { useRef, useEffect, useActionState } from 'react';
import { unifiedConversationAction, ConversationState, ConversationMessage } from '@/app/actions';
import { useTypographicState } from '@/context/typographic-state-context';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, CircleDashed, BookOpen } from 'lucide-react';
import { ScribeSigil } from './icons';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FocusLayer } from './focus-layer';
import { Annotator } from './annotator';

/**
 * Props for the ConversationManager component.
 * @property {React.TransitionStartFunction} startTransition - The startTransition function from `useTransition`.
 * @property {boolean} isPending - The pending state from `useTransition`.
 */
type ConversationManagerProps = {
    startTransition: React.TransitionStartFunction;
    isPending: boolean;
}

const initialState: ConversationState = {
  conversation: [],
  error: null,
};

/**
 * The main component for managing and displaying the conversation with the AI Scribe.
 * It handles form submission and displays messages revealed from the canon.
 * @param {ConversationManagerProps} props - The component's props.
 */
export function ConversationManager({ startTransition, isPending }: ConversationManagerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { applyState } = useTypographicState();
  const [state, formAction, isActionPending] = useActionState(unifiedConversationAction, initialState);

  useEffect(() => {
    startTransition(() => {});
  }, [isActionPending, startTransition]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [state.conversation]);
  
  useEffect(() => {
    if(isPending) {
      applyState('active');
    } else {
      applyState('default');
    }
  }, [isPending, applyState]);

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
    }
    const event = new Event('input', { bubbles: true });
    textarea?.dispatchEvent(event);
  };

  return (
    <>
      <div className="flex flex-col h-full w-full max-w-4xl bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 rounded-lg">
        <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {state.conversation.length === 0 && (
              <div className="text-center text-muted-foreground sigil-codex pt-8 flex flex-col items-center gap-4">
                <ScribeSigil className="h-20 w-20 text-primary/70"/>
                <p>The Oracle is silent. Pose your query to the canon.</p>
              </div>
            )}
            {state.conversation.map((msg, index) => (
              <div key={index} className={cn("flex items-start gap-3 w-full", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'agent' && <Bot className="flex-shrink-0 text-primary mt-2" />}
                <div className={cn(
                    "p-3 rounded-lg max-w-2xl prose prose-invert prose-sm sigil-codex w-full", 
                    msg.role === 'user' ? 'bg-primary/30' : 'bg-background/50',
                    msg.isError && 'bg-destructive/20 text-destructive-foreground'
                  )}>

                  {msg.isThinking ? (
                       <div className="flex items-center gap-2">
                          <CircleDashed className="animate-spin h-4 w-4" />
                          <p className="m-0">{msg.content}</p>
                       </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`item-${index}`} className="border-b-0">
                          {msg.sourceTitle && (
                              <div className="border-b border-primary/20 pb-2 mb-3">
                                  <h4 className="text-xs uppercase tracking-widest text-primary sigil-obelisk not-prose flex items-center justify-between">
                                      <span>Spoken by: &quot;{msg.sourceTitle}&quot;</span>
                                  </h4>
                              </div>
                          )}
                          <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: msg.content }} />

                          {msg.audioUrl && (
                            <audio controls src={msg.audioUrl} className="w-full mt-3 h-8" />
                          )}

                          {msg.sourceMarkdown && (
                            <AccordionTrigger asChild>
                               <Button variant="ghost" size="sm" className="mt-3 -ml-3 text-muted-foreground hover:text-foreground">
                                    <BookOpen className="mr-2 h-4 w-4"/>
                                    View Full Scripture
                                </Button>
                            </AccordionTrigger>
                          )}
                          <AccordionContent>
                              <div className="border-t border-primary/20 mt-4 pt-4">
                                <Annotator contentId={msg.sourceTitle || index.toString()}>
                                    <FocusLayer
                                        whyContent={msg.sourceMarkdown || ''}
                                        howContent={''}
                                    />
                                </Annotator>
                              </div>
                          </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
                {msg.role === 'user' && <User className="flex-shrink-0 text-accent mt-2" />}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-primary/20 bg-background/50 rounded-b-lg">
          <form ref={formRef} onSubmit={handleFormSubmit} className="w-full flex items-start gap-2">
            <Textarea
              name="query"
              placeholder={'Pose your query to the canon...'}
              required
              className="flex-grow sigil-glyph bg-background/80 focus:bg-background resize-none"
              disabled={isPending}
              onFocus={() => applyState('active')}
              onBlur={() => applyState('default')}
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
        </div>
      </div>
    </>
  );
}
