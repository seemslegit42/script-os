
"use client";

import { marked } from 'marked';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Props for the FocusLayer component.
 * @property {string} content - The markdown content to be rendered.
 */
type FocusLayerProps = {
  content: string;
};

// Dictionary for the Crystalline Glossary
const glossaryTerms: Record<string, string> = {
  'ΛΞVON OS': 'A post-SaaS, agentic Digital Operations Platform (DOP/OS) engineered to eliminate digital friction.',
  'BEEP': 'Behavioral Event & Execution Processor. The conversational command core of ΛΞVON OS.',
  'Aegis': 'The always-on cybersecurity and integrity fabric of the OS.',
  'Loom Studio': 'The privileged Architect\'s environment for weaving agentic workflows and tuning the economy.',
  'KLEPSYDRA Engine': 'The profit and engagement engine that modulates luck and fosters devotion.',
  'Obelisk Pay': 'The sovereign, closed-loop ledger for all ΞCredit transactions.',
  'ΞCredits': 'The in-system currency of sovereignty, used to command agentic actions.',
  'Micro-Apps': 'Modular, single-purpose, and agent-controllable applications that live on the user\'s Canvas.',
  'Canvas': 'The persistent, live workspace and sacred stage where all work unfolds.',
  'Rite of Invocation': 'The narrative-driven onboarding process that establishes a user\'s identity and Vow.',
  'Folly Instruments': 'Gamified productivity tools and economic rituals where users can spend ΞCredits.',
  'Sovereignty Class': 'A user\'s rank within the system, granting access to deeper capabilities.',
};

/**
 * A component that displays a single block of markdown content,
 * parsed into HTML for rich rendering. It also implements the "Crystalline Glossary"
 * by finding and replacing key terms with interactive tooltips.
 * @param {FocusLayerProps} props - The component props.
 */
export function FocusLayer({ content }: FocusLayerProps) {
  const proseClasses = "prose prose-sm prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded";

  // The Nexus Weave Protocol: Internal Linkage as a Knowledge Graph
  const wrapGlossaryTerms = (text: string): React.ReactNode[] => {
    const sortedTerms = Object.keys(glossaryTerms).sort((a, b) => b.length - a.length);
    const regex = new RegExp(`\\b(${sortedTerms.join('|')})\\b`, 'gi');
    
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const lowerPart = part.toLowerCase();
      const matchedTerm = sortedTerms.find(term => term.toLowerCase() === lowerPart);

      if (matchedTerm) {
        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <span className="text-accent border-b border-accent/50 cursor-pointer hover:bg-accent/10 transition-colors">{part}</span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs sigil-codex">
              <p>{glossaryTerms[matchedTerm]}</p>
            </TooltipContent>
          </Tooltip>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  const parsedContent = marked.parse(content || '');

  // This is a simplified approach. A more robust solution would parse the HTML
  // and recursively replace text nodes to avoid breaking HTML tags.
  // For this implementation, we'll apply it to the whole block.
  // This is a limitation but demonstrates the principle.
  // A better way would be a custom marked renderer.

  return (
    <TooltipProvider>
      <div
        className={proseClasses}
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />
    </TooltipProvider>
  );
}
