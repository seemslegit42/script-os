
"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/app-store";
import React, { useState, useRef, useEffect } from "react";

/**
 * A Terminal Micro-App that provides a raw interface to the BEEP agent.
 * Fulfills the 'Terminal.md' scripture.
 */
export function Terminal() {
    const [history, setHistory] = useState<string[]>(['Welcome to the BEEP command core. The raw conduit is open.']);
    const [command, setCommand] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const handleCommandSubmit = useAppStore((state) => state.handleCommandSubmit);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (command.trim() && !isLoading) {
            setIsLoading(true);
            const currentCommand = command;
            setHistory(prev => [...prev, `> ${currentCommand}`]);
            setCommand('');

            // The central store now handles the command asynchronously
            const response = await handleCommandSubmit(currentCommand);
            
            // Add BEEP's response to history
            setHistory(prev => [...prev, response]);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [history]);

    return (
        <div className="h-full w-full flex flex-col bg-black/50 sigil-glyph">
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                <div className="flex flex-col gap-2 text-sm text-primary-foreground/80">
                    {history.map((line, index) => (
                        <p key={index} className={line.startsWith('>') ? 'text-accent' : ''}>{line}</p>
                    ))}
                    {isLoading && <p className="text-muted-foreground animate-pulse">BEEP is thinking...</p>}
                </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="p-2 border-t border-border">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent">&gt;</span>
                    <Input 
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Speak directly into the storm..."
                        className="w-full pl-8 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        autoFocus
                        disabled={isLoading}
                    />
                </div>
            </form>
        </div>
    );
}
