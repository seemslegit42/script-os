
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { marked } from 'marked';

/**
 * Props for the FocusLayer component.
 * @property {string} whyContent - The markdown or HTML content for the 'Why' tab.
 * @property {string} howContent - The markdown or HTML content for the 'How' tab.
 */
type FocusLayerProps = {
  whyContent: string;
  howContent: string;
};

/**
 * A component that displays content in two tabs: 'Why' (conceptual) and 'How' (technical).
 * It parses Markdown content into HTML for rich rendering.
 * @param {FocusLayerProps} props - The component props.
 */
export function FocusLayer({ whyContent, howContent }: FocusLayerProps) {
  const proseClasses = "prose prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded";

  // The content might already be HTML if it's from the AI, but we run it through marked to be safe
  // and to handle any raw markdown that might be passed in.
  const parsedWhy = marked.parse(whyContent);
  const parsedHow = marked.parse(howContent);

  return (
    <Tabs defaultValue="why" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-black/20">
        <TabsTrigger value="why">The 'Why'</TabsTrigger>
        <TabsTrigger value="how">The 'How'</TabsTrigger>
      </TabsList>
      <TabsContent value="why" className="mt-4">
        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: parsedWhy }}
        />
      </TabsContent>
      <TabsContent value="how" className="mt-4">
        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: parsedHow }}
        />
      </TabsContent>
    </Tabs>
  );
}
