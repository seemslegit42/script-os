
"use client";

import { marked } from 'marked';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

/**
 * Props for the FocusLayer component.
 * @property {string} content - The markdown content to be rendered.
 */
type FocusLayerProps = {
  content: string;
};

// Dictionary for the Crystalline Glossary, now including the document ID for linking.
const glossaryTerms: Record<string, { definition: string, id: string }> = {
  'ΛΞVON OS': { definition: 'A post-SaaS, agentic Digital Operations Platform (DOP/OS) engineered to eliminate digital friction.', id: 'agentic-operating-system' },
  'BEEP': { definition: 'Behavioral Event & Execution Processor. The conversational command core of ΛΞVON OS.', id: 'beep' },
  'Aegis': { definition: 'The always-on cybersecurity and integrity fabric of the OS.', id: 'core-subsystems-aegis' },
  'Loom Studio': { definition: 'The privileged Architect\'s environment for weaving agentic workflows and tuning the economy.', id: 'core-subsystems-loom-studio' },
  'KLEPSYDRA Engine': { definition: 'The profit and engagement engine that modulates luck and fosters devotion.', id: 'core-subsystems-klepsydra' },
  'Obelisk Pay': { definition: 'The sovereign, closed-loop ledger for all ΞCredit transactions.', id: 'core-subsystems-obelisk-pay' },
  'ΞCredits': { definition: 'The in-system currency of sovereignty, used to command agentic actions.', id: 'doctrine-of-sovereign-economy' },
  'Micro-Apps': { definition: 'Modular, single-purpose, and agent-controllable applications that live on the user\'s Canvas.', id: 'instrument-protocol' },
  'Canvas': { definition: 'The persistent, live workspace and sacred stage where all work unfolds.', id: 'frontend-canvas-ux-laws' },
  'Rite of Invocation': { definition: 'The narrative-driven onboarding process that establishes a user\'s identity and Vow.', id: 'rite-of-invocation' },
  'Folly Instruments': { definition: 'Gamified productivity tools and economic rituals where users can spend ΞCredits.', id: 'chaos-cards' },
  'Sovereignty Class': { definition: 'A user\'s rank within the system, granting access to deeper capabilities.', id: 'master-blueprint' },
  'Obelisk Marketplace': { definition: 'A privileged, end-game utility for transmuting ΞCredits into real-world assets.', id: 'obelisk-marketplace' },
};

/**
 * A component that displays a single block of markdown content,
 * parsed into HTML for rich rendering. It implements the "Crystalline Glossary"
 * by linking key terms and the "Forged Command" by injecting interactive buttons.
 * @param {FocusLayerProps} props - The component props.
 */
export function FocusLayer({ content }: FocusLayerProps) {
  const { toast } = useToast();
  const proseClasses = "prose prose-sm prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded";

  const handleCommandClick = (command: string) => {
    toast({
      title: "Command Forged",
      description: `Action triggered: "${command}" (This is a demonstration).`,
    });
  };

  const renderContentWithCommands = () => {
    const commandRegex = /\[CMD: "([^"]+)"\s*\|\s*"([^"]+)"\]/g;
    const parts = content.split(commandRegex);
    
    const elements = [];
    let textIndex = 0;

    for (let i = 0; i < parts.length; i++) {
        if (i % 3 === 0) {
            elements.push(<div key={`text-${textIndex++}`} dangerouslySetInnerHTML={{ __html: parseMarkdownWithGlossary(parts[i]) }} />);
        } else if (i % 3 === 1) {
            const buttonText = parts[i];
            const command = parts[i+1];
            elements.push(
                <div key={`cmd-${textIndex}`} className="flex justify-center my-4">
                    <Button onClick={() => handleCommandClick(command)} variant="outline" className="shadow-lg shadow-primary/10 border-primary hover:bg-primary/10 hover:shadow-primary/20">
                        {buttonText}
                    </Button>
                </div>
            );
            i++; // Skip next part as it's the command
        }
    }
    return elements;
  };
  
  const parseMarkdownWithGlossary = (markdown: string): string => {
    let processedContent = markdown || '';
    const sortedTerms = Object.keys(glossaryTerms).sort((a, b) => b.length - a.length);
    
    sortedTerms.forEach(term => {
      const termData = glossaryTerms[term];
      const regex = new RegExp(`\\b(${term})(?![^<]*>|[^<>]*<\\/a>)\\b`, 'gi');
      
      const replacement = `<a href="/library/${termData.id}" class="nexus-link text-accent border-b border-accent/50 hover:bg-accent/10 transition-colors">${term}</a>`;
      
      processedContent = processedContent.replace(regex, (match, p1) => {
        // A simple check to avoid replacing inside existing links.
        // This is not foolproof but handles many cases.
        return replacement;
      });
    });

    return marked.parse(processedContent);
  };
  
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    breaks: false,
    pedantic: false,
  });

  return <div className={proseClasses}>{renderContentWithCommands()}</div>;
}
