
'use client';

import React, { useRef, useEffect, useActionState } from 'react';
import { unifiedConversationAction, ConversationState, ConversationMessage } from '@/app/actions';
import { useTypographicState } from '@/context/typographic-state-context';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, CircleDashed } from 'lucide-react';
import { FocusLayer } from './focus-layer';
import Image from 'next/image';
import { ScribeSigil } from './icons';
import { cn } from '@/lib/utils';

type ConversationManagerProps = {
    startTransition: React.TransitionStartFunction;
    isPending: boolean;
}

const initialState: ConversationState = {
  conversation: [],
  context: null,
  contextImageUrl: null,
  contextQuery: null,
  error: null,
};


export function ConversationManager({ startTransition, isPending }: ConversationManagerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { applyState } = useTypographicState();
  const [state, formAction, isActionPending] = useActionState(unifiedConversationAction, initialState);
  
  // Effect to scroll to the bottom of the conversation
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [state.conversation]);
  
  // Effect to manage typographic state based on pending status
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
    if (textarea) textarea.value = '';
  };
  
  return (
    <div className="flex flex-col h-full bg-card/70 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 rounded-t-lg">
      <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {state.conversation.length === 0 && (
            <div className="text-center text-muted-foreground sigil-codex pt-8 flex flex-col items-center gap-4">
              <ScribeSigil className="h-20 w-20 text-primary/70"/>
              <p>{state.context ? `Interrogating scripture: "${state.contextQuery}"` : "The Oracle is silent. State your intent to forge a scripture."}</p>
              {state.contextImageUrl && (
                <Image 
                    src={state.contextImageUrl}
                    alt={`Sigil for ${state.contextQuery}`}
                    width={512}
                    height={288}
                    className="w-full max-w-md h-auto rounded-lg border border-primary/30 aspect-video object-cover"
                    data-ai-hint="abstract symbol"
                />
              )}
            </div>
          )}
          {state.conversation.map((msg, index) => (
            <div key={index} className={cn("flex items-start gap-3 w-full", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'agent' && <Bot className="flex-shrink-0 text-primary mt-2" />}
              <div className={cn(
                  "p-3 rounded-lg max-w-2xl prose prose-invert prose-sm sigil-codex", 
                  msg.role === 'user' ? 'bg-primary/20 text-primary-foreground' : 'bg-background/50',
                  msg.isError && 'bg-destructive/20 text-destructive-foreground'
                )}>

                {msg.isThinking ? (
                     <div className="flex items-center gap-2">
                        <CircleDashed className="animate-spin h-4 w-4" />
                        <p className="m-0">{msg.content}</p>
                     </div>
                ) : msg.isCreation && msg.sigil ? (
                    <div className="space-y-4">
                        <p>{msg.content}</p>
                         {msg.imageUrl && (
                          <Image 
                            src={msg.imageUrl}
                            alt={`Generated Sigil for ${msg.query}`}
                            width={1024}
                            height={576}
                            className="w-full h-auto rounded-lg border border-primary/30 aspect-video object-cover"
                            priority
                            data-ai-hint="abstract spiritual"
                          />
                        )}
                        <FocusLayer whyContent={msg.sigil.why} howContent={msg.sigil.how} />
                    </div>
                ) : (
                    <p className="m-0">{msg.content}</p>
                )}

                {msg.audioUrl && (
                  <audio controls autoPlay src={msg.audioUrl} className="w-full mt-3 h-8" />
                )}
              </div>
              {msg.role === 'user' && <User className="flex-shrink-0 text-accent mt-2" />}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-primary/20 bg-background/50 rounded-b-lg">
        <form ref={formRef} onSubmit={handleFormSubmit} className="w-full flex items-center gap-2">
          <input type="hidden" name="context" value={state.context || ''} />
          <input type="hidden" name="contextImageUrl" value={state.contextImageUrl || ''} />
          <input type="hidden" name="contextQuery" value={state.contextQuery || ''} />
          <Textarea
            name="query"
            placeholder={state.context ? `Interrogate "${state.contextQuery}"...` : 'State your intent...'}
            required
            className="flex-grow sigil-glyph bg-background/80 focus:bg-background resize-none"
            rows={1}
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
  );
}
