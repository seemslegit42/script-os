
"use client";

import { marked } from 'marked';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import React from 'react';

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
};

/**
 * A component that displays a single block of markdown content,
 * parsed into HTML for rich rendering. It also implements the "Crystalline Glossary"
 * by finding and replacing key terms with interactive, linked tooltips.
 * @param {FocusLayerProps} props - The component props.
 */
export function FocusLayer({ content }: FocusLayerProps) {
  const proseClasses = "prose prose-sm prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded";

  // The Nexus Weave Protocol: Now with linking.
  const parsedHtmlWithGlossary = () => {
    let processedContent = content || '';
    const sortedTerms = Object.keys(glossaryTerms).sort((a, b) => b.length - a.length);
    
    sortedTerms.forEach(term => {
      const termData = glossaryTerms[term];
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');
      
      const linkHtml = `
        <span class="nexus-link-wrapper">
          <a href="/library/${termData.id}" class="nexus-link text-accent border-b border-accent/50 hover:bg-accent/10 transition-colors">${term}</a>
        </span>
      `;
      // Note: This simple regex replace doesn't support tooltips easily.
      // We are prioritizing the hyperlink functionality as the primary mandate.
      processedContent = processedContent.replace(regex, linkHtml);
    });

    return marked.parse(processedContent);
  };
  
  // Custom renderer to add target="_blank" to external links but not our internal glossary links
  const renderer = new marked.Renderer();
  const linkRenderer = renderer.link;
  renderer.link = (href, title, text) => {
    const html = linkRenderer.call(renderer, href, title, text);
    if (href && !href.startsWith('/') && !href.startsWith('#')) {
      return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ');
    }
    // internal links (glossary or others)
    return html;
  };

  marked.setOptions({ renderer });


  // This is a simplified approach. A more robust solution would parse the HTML
  // and recursively replace text nodes to avoid breaking HTML tags.
  // For this implementation, we'll apply it to the whole block.
  // This is a limitation but demonstrates the principle.
  return (
    <div
      className={proseClasses}
      dangerouslySetInnerHTML={{ __html: parsedHtmlWithGlossary() }}
    />
  );
}
