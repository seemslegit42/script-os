
'use client';

import React, { useRef, useEffect, useActionState, useState } from 'react';
import { unifiedConversationAction, ConversationState, ConversationMessage } from '@/app/actions';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { addDocument } from '@/app/scriptorium/actions';
import { useTypographicState } from '@/context/typographic-state-context';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bot, User, Send, CircleDashed, Swords, ArrowLeft, MessageSquareQuote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { FocusLayer } from './focus-layer';
import Image from 'next/image';
import { SaveSigil, ScribeSigil } from './icons';
import { cn } from '@/lib/utils';
import { InterrogationPanel } from '@/components/scribe/interrogation-panel';
import { Scripture } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Annotator, Annotation } from '@/components/annotator';
import { useIsMobile } from '@/hooks/use-mobile';


type ConversationManagerProps = {
    isPending: boolean;
    setIsPending: (isPending: boolean) => void;
    selectedScripture: Scripture | null;
    onReturnToScribe: () => void;
    onScriptureCreated: (scripture: Scripture) => void;
}

const initialState: ConversationState = {
  conversation: [],
  context: null,
  contextImageUrl: null,
  contextQuery: null,
  error: null,
};


export function ConversationManager({ isPending, setIsPending, selectedScripture, onReturnToScribe, onScriptureCreated }: ConversationManagerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { applyState } = useTypographicState();
  const [state, formAction] = useActionState(unifiedConversationAction, initialState);
  const isMobile = useIsMobile();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending, setIsPending])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [state.conversation]);
  
  useEffect(() => {
    // When the agent is thinking, shift the typographic state.
    if(isPending) {
      applyState('active');
    } else {
      applyState('default');
    }
  }, [isPending, applyState]);
  
  useEffect(() => {
    // When a scripture is created, pass it up to the parent
    if (state.context && state.isCreation) {
        const creationMessage = state.conversation.find(m => m.isCreation);
        if (creationMessage && creationMessage.sigil) {
            onScriptureCreated({
                id: `creation-${Date.now()}`,
                query: state.contextQuery || '',
                why: creationMessage.sigil.why,
                how: creationMessage.sigil.how,
                imageUrl: state.contextImageUrl || undefined,
                markdown: `${creationMessage.sigil.why}\n\n${creationMessage.sigil.how}`,
            });
        }
    }
  }, [state, onScriptureCreated]);


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
  
  const handleSaveToForge = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be an Initiate to bind a sigil to your Scriptorium.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedScripture) {
       toast({ title: "Error", description: "Cannot bind an incomplete sigil.", variant: "destructive" });
       return;
    }

    try {
      await addDocument({
        userId: user.uid,
        query: selectedScripture.query,
        why: selectedScripture.why,
        how: selectedScripture.how,
        imageUrl: selectedScripture.imageUrl,
        createdAt: new Date(),
      });
      toast({
        title: "Sigil Bound",
        description: "The scripture has been bound to your personal Scriptorium.",
      });
    } catch(e: any) {
       toast({ title: "Binding Failed", description: e.message || "Could not bind sigil.", variant: "destructive" });
    }
  };
  
  const handleAddAnnotation = (annotation: Omit<Annotation, 'id'>) => {
    const newAnnotation: Annotation = { ...annotation, id: `ann-${Date.now()}` };
    setAnnotations(prev => [...prev, newAnnotation]);
  }
  
  const handleBackToScribe = () => {
    setAnnotations([]);
    onReturnToScribe();
  }


  if (selectedScripture) {
     const sigilContext = selectedScripture.markdown || `${selectedScripture.why}\n\n${selectedScripture.how}`;
     const contentId = selectedScripture.id || selectedScripture.query;

     return (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
             <Card className="bg-card/70 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 flex flex-col">
                <CardHeader className="flex-row items-center justify-between">
                  <h2 className="text-xl sigil-obelisk text-primary truncate flex-grow">{selectedScripture.query || selectedScripture.fileName || selectedScripture.title}</h2>
                   <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size={isMobile ? 'icon' : 'sm'} disabled={annotations.length === 0}>
                          <MessageSquareQuote />
                          <span className="hidden sm:inline sm:ml-2">Annotations ({annotations.length})</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="bg-card/90 backdrop-blur-lg border-primary/30">
                        <SheetHeader>
                          <SheetTitle className="sigil-obelisk">Session Annotations</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-[calc(100%-4rem)] mt-4 pr-4">
                          <div className="space-y-4">
                            {annotations.length > 0 ? (
                              annotations.map(ann => (
                                <div key={ann.id} className="p-3 rounded-lg bg-background/50 border border-primary/20">
                                  <p className="text-sm text-muted-foreground italic border-l-2 border-accent/70 pl-2 sigil-codex">
                                    &ldquo;{ann.selection}&rdquo;
                                  </p>
                                  <p className="mt-2 sigil-glyph">{ann.comment}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted-foreground text-center mt-8">No annotations for this session.</p>
                            )}
                          </div>
                        </ScrollArea>
                      </SheetContent>
                    </Sheet>
                    <Button onClick={handleBackToScribe} variant="outline" size={isMobile ? 'icon' : 'sm'}>
                      <ArrowLeft />
                      <span className="hidden sm:inline sm:ml-2">Return to Scribe</span>
                    </Button>
                  </div>
                </CardHeader>
                 <CardContent className="p-6 pt-0 flex-grow min-h-0">
                   <ScrollArea className="h-full pr-4">
                      <Annotator contentId={contentId} onAnnotate={handleAddAnnotation}>
                         <div className="space-y-6">
                             {selectedScripture.imageUrl && (
                                 <Image 
                                     src={selectedScripture.imageUrl}
                                     alt={`Sigil for ${selectedScripture.query}`}
                                     width={1024}
                                     height={576}
                                     className="w-full h-auto rounded-lg border border-primary/30 aspect-video object-cover"
                                     data-ai-hint="abstract symbol"
                                 />
                             )}
                             {selectedScripture.html ? (
                                 <div
                                     className="prose prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded"
                                     dangerouslySetInnerHTML={{ __html: selectedScripture.html }}
                                 />
                             ) : selectedScripture.why && selectedScripture.how ? (
                                 <FocusLayer whyContent={selectedScripture.why} howContent={selectedScripture.how} />
                             ) : null}
                         </div>
                      </Annotator>
                   </ScrollArea>
                 </CardContent>
             </Card>
              <InterrogationPanel context={sigilContext} />
         </div>
     );
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
                <Button onClick={handleSaveToForge} variant="outline" size="sm">
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
