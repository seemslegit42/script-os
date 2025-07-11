
'use client';

import React, { useRef, useEffect, useActionState, useTransition } from 'react';
import { unifiedConversationAction, ConversationState, ConversationMessage } from '@/app/actions';
import { useTypographicState } from '@/context/typographic-state-context';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, CircleDashed, Swords, ArrowLeft } from 'lucide-react';
import { FocusLayer } from './focus-layer';
import Image from 'next/image';
import { SaveSigil, ScribeSigil } from './icons';
import { cn } from '@/lib/utils';
import { Scripture } from '@/lib/types';


type ConversationManagerProps = {
    isPending: boolean;
    setIsPending: (isPending: boolean) => void;
    onSaveToForge: (sigil: any) => void;
}

const initialState: ConversationState = {
  conversation: [],
  context: null,
  contextImageUrl: null,
  contextQuery: null,
  error: null,
};


export function ConversationManager({ setIsPending, isPending, onSaveToForge }: ConversationManagerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { applyState } = useTypographicState();
  const [state, formAction, isActionPending] = useActionState(unifiedConversationAction, initialState);
  
  useEffect(() => {
    setIsPending(isActionPending);
  }, [isActionPending, setIsPending])

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

    formAction(formData);
    if (formRef.current) {
      formRef.current.reset();
    }
  };
  
  const handleSaveClick = () => {
    if (state.context && state.isCreation) {
        const creationMessage = state.conversation.find(m => m.isCreation);
        if (creationMessage && creationMessage.sigil) {
            onSaveToForge({
                query: state.contextQuery,
                why: creationMessage.sigil.why,
                how: creationMessage.sigil.how,
                imageUrl: state.contextImageUrl,
            });
        }
    }
  }


  return (
    <div className="flex flex-col h-full bg-card/70 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 rounded-t-lg">
      <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {state.conversation.length === 0 && (
            <div className="text-center text-muted-foreground sigil-codex pt-8 flex flex-col items-center gap-4">
              <ScribeSigil className="h-20 w-20 text-primary/70"/>
              <p>The Oracle is silent. State your intent to forge a scripture.</p>
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
         {state.context && (
            <div className="flex justify-end gap-2 mb-2">
                <Button onClick={handleSaveClick} variant="outline" size="sm">
                    <SaveSigil className="mr-2" />
                    Bind to Scriptorium
                </Button>
            </div>
         )}
        <form ref={formRef} onSubmit={handleFormSubmit} className="w-full flex items-center gap-2">
          <Textarea
            name="query"
            placeholder={state.context ? 'Interrogate the scripture...' : 'State your intent...'}
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
