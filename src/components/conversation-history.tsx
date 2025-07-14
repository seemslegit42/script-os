
'use client';

import React, { useRef, useEffect } from 'react';
import { ConversationMessage } from '@/app/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Bot, User, BookOpen, CircleDashed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FocusLayer } from './focus-layer';

/**
 * Props for the ConversationHistory component.
 */
type ConversationHistoryProps = {
    conversation: ConversationMessage[];
}

/**
 * A component that displays the history of the conversation.
 * @param {ConversationHistoryProps} props - The component's props.
 */
export function ConversationHistory({ conversation }: ConversationHistoryProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [conversation]);

    return (
        <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
                {conversation.map((msg, index) => (
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
                        ) : (
                            <>
                            {msg.sourceTitle && (
                                <div className="border-b border-primary/20 pb-2 mb-3">
                                    <h4 className="text-xs uppercase tracking-widest text-primary sigil-obelisk not-prose">
                                        <span>Spoken by: &quot;{msg.sourceTitle}&quot;</span>
                                    </h4>
                                </div>
                            )}
                            <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: msg.content }} />

                            {msg.audioUrl && (
                                <audio controls src={msg.audioUrl} className="w-full mt-3 h-8" />
                            )}

                            {msg.sourceMarkdown && (
                                <Accordion type="single" collapsible className="w-full mt-3">
                                    <AccordionItem value="item-1" className="border-none">
                                        <AccordionTrigger>
                                            <span className="flex items-center text-sm text-primary hover:underline">
                                                <BookOpen className="mr-2 h-4 w-4"/>
                                                Full Scripture
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <FocusLayer content={msg.sourceMarkdown}/>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                            </>
                        )}
                        </div>
                        {msg.role === 'user' && <User className="flex-shrink-0 text-accent mt-2" />}
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
