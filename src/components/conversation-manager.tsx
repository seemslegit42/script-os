
'use client';

import React, { useRef, useEffect, useActionState, useState } from 'react';
import { unifiedConversationAction, ConversationState, ConversationMessage } from '@/app/actions';
import { useTypographicState } from '@/context/typographic-state-context';
import { useScriptorium } from '@/context/scriptorium-context';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, CircleDashed, RotateCcw, Sparkles } from 'lucide-react';
import { FocusLayer } from './focus-layer';
import Image from 'next/image';
import { ScribeSigil } from './icons';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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
  const { addScripture } = useScriptorium();
  const { toast } = useToast();
  const [state, formAction, isActionPending] = useActionState(unifiedConversationAction, initialState);
  const [hasSaved, setHasSaved] = useState(false);
  
  useEffect(() => {
    startTransition(() => {
      // This is a no-op, but it correctly links the parent's transition state
      // to the action's pending state.
    });
  }, [isActionPending, startTransition]);

  useEffect(() => {
    setHasSaved(false); // Reset save state when context changes
  }, [state.context]);

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
  
  const handleReset = () => {
    startTransition(() => {
        const formData = new FormData();
        formData.append('reset', 'true');
        formAction(formData);
    });
  }

  const handleSaveToForge = (msg: ConversationMessage) => {
    if (!msg.sigil || !msg.query) return;

    const newScripture = {
        id: `forged-${Date.now()}`,
        query: msg.query,
        why: msg.sigil.why,
        how: msg.sigil.how,
        imageUrl: msg.imageUrl,
        createdAt: new Date().toISOString(),
    };
    addScripture(newScripture);
    setHasSaved(true);
    toast({
        title: "Scripture Saved",
        description: "It is now available in your Library.",
    });
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 rounded-lg">
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
                  msg.role === 'user' ? 'bg-primary/30' : 'bg-background/50',
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
                        <Button onClick={() => handleSaveToForge(msg)} variant="outline" className="w-full" disabled={hasSaved}>
                            <Sparkles className="mr-2" />
                            {hasSaved ? 'Bound to Scriptorium' : 'Bind to Scriptorium'}
                        </Button>
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
          {state.context && (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" onClick={handleReset} disabled={isPending}>
                            <RotateCcw />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>New Scripture</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          )}
          <Button type="submit" size="icon" disabled={isPending}>
            {isPending ? <CircleDashed className="animate-spin" /> : <Send />}
          </Button>
        </form>
      </div>
    </div>
  );
}
