
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ConversationMessage } from '@/app/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Bot, User, BookOpen, CircleDashed, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FocusLayer } from './focus-layer';
import { Button } from './ui/button';

/**
 * Props for the ConversationHistory component.
 */
type ConversationHistoryProps = {
    conversation: ConversationMessage[];
}

/**
 * A component that displays the history of the conversation, now with audio control.
 * @param {ConversationHistoryProps} props - The component's props.
 */
export function ConversationHistory({ conversation }: ConversationHistoryProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);
    const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // Effect to scroll to the bottom of the conversation
    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [conversation]);

    // Effect to auto-play the latest audio message
    useEffect(() => {
        const lastMessage = conversation[conversation.length - 1];
        if (lastMessage?.role === 'agent' && lastMessage.audioUrl) {
            // Stop any currently playing audio
            if (activeAudio) {
                activeAudio.pause();
            }

            const audio = new Audio(lastMessage.audioUrl);
            setActiveAudio(audio);
            setActiveAudioIndex(conversation.length - 1);

            audio.play().catch(e => console.error("Audio autoplay failed:", e));

            audio.onplay = () => setIsPlaying(true);
            audio.onpause = () => setIsPlaying(false);
            audio.onended = () => {
                setIsPlaying(false);
                setActiveAudioIndex(null);
            };
        }
    }, [conversation, activeAudio]);
    
    const handlePlayPause = (index: number, audioUrl?: string) => {
        if (activeAudioIndex === index) {
            // It's the currently active audio, so toggle it
            if (isPlaying) {
                activeAudio?.pause();
            } else {
                activeAudio?.play();
            }
        } else {
            // A different audio is requested
            if (activeAudio) {
                activeAudio.pause();
            }
            if (audioUrl) {
                const newAudio = new Audio(audioUrl);
                setActiveAudio(newAudio);
                setActiveAudioIndex(index);
                newAudio.play().catch(e => console.error("Audio play failed:", e));
                newAudio.onplay = () => setIsPlaying(true);
                newAudio.onpause = () => setIsPlaying(false);
                newAudio.onended = () => {
                    setIsPlaying(false);
                    setActiveAudioIndex(null);
                };
            }
        }
    };


    return (
        <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
                {conversation.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-3 w-full", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'agent' && <Bot className="flex-shrink-0 text-primary mt-2" />}
                        <div className={cn(
                            "p-3 rounded-lg max-w-2xl prose prose-invert prose-sm sigil-codex transition-all duration-500", 
                            msg.role === 'user' ? 'bg-primary/30' : 'bg-background/50',
                            msg.isError && 'bg-destructive/20 text-destructive-foreground',
                            activeAudioIndex === index && isPlaying && 'shadow-lg shadow-accent/20 ring-1 ring-accent/50'
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
                                <div className="mt-3">
                                    <Button variant="outline" size="sm" onClick={() => handlePlayPause(index, msg.audioUrl)}>
                                        {activeAudioIndex === index && isPlaying ? (
                                            <Pause className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Play className="mr-2 h-4 w-4" />
                                        )}
                                        {activeAudioIndex === index && isPlaying ? 'Pause' : 'Play'} Oracle
                                    </Button>
                                </div>
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
