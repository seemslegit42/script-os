
'use client';

import React, { useActionState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, CircleDashed } from 'lucide-react';
import { interrogationAction, InterrogationFormState } from './actions';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const initialState: InterrogationFormState = {
  conversation: [],
  error: null,
};

/**
 * Props for the InterrogationPanel component.
 * @property {string} context - The full text content of the document to be interrogated.
 */
type InterrogationPanelProps = {
  context: string;
};

/**
 * A component that provides a chat-like interface for users to "interrogate" a document.
 * It manages the conversation state and calls a server action to get answers from an AI agent.
 * @param {InterrogationPanelProps} props - The component props.
 */
export function InterrogationPanel({ context }: InterrogationPanelProps) {
  const [state, formAction, isPending] = useActionState(interrogationAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [state.conversation]);
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formAction(formData);
    // Reset the textarea after submission
    if(formRef.current) {
        const textarea = formRef.current.querySelector('textarea[name="query"]') as HTMLTextAreaElement;
        if(textarea) textarea.value = "";
    }
  }

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="sigil-obelisk flex items-center gap-2">
            <Bot />
            Interrogation Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow min-h-0">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                  {state.conversation.map((msg, index) => (
                      <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                           {msg.role === 'agent' && <Bot className="flex-shrink-0 text-primary" />}
                           <div className={cn("p-3 rounded-lg max-w-sm prose prose-invert prose-sm sigil-codex", msg.role === 'user' ? 'bg-primary/20 text-primary-foreground' : 'bg-background/50')}>
                                <p className="m-0">{msg.content}</p>
                                {msg.audioUrl && (
                                  <audio controls autoPlay src={msg.audioUrl} className="w-full mt-3 h-8" />
                                )}
                           </div>
                           {msg.role === 'user' && <User className="flex-shrink-0 text-accent" />}
                      </div>
                  ))}
                  {isPending && (
                       <div className="flex items-start gap-3 justify-start">
                            <Bot className="flex-shrink-0 text-primary animate-pulse" />
                             <div className="p-3 rounded-lg max-w-sm bg-background/50 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                             </div>
                        </div>
                  )}
              </div>
          </ScrollArea>
      </CardContent>
      <CardFooter>
        <form ref={formRef} onSubmit={handleFormSubmit} className="w-full flex items-center gap-2">
          <input type="hidden" name="context" value={context} />
          <Textarea
            name="query"
            placeholder="Ask a question about this document..."
            required
            className="flex-grow sigil-glyph bg-background/50 focus:bg-background/80 resize-none"
            rows={1}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    formRef.current?.requestSubmit();
                }
            }}
          />
          <Button type="submit" size="icon" disabled={isPending}>
            {isPending ? <CircleDashed className="animate-spin"/> : <Send />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
