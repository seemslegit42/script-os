
"use client";

import { marked } from 'marked';

/**
 * Props for the FocusLayer component.
 * @property {string} content - The markdown content to be rendered.
 */
type FocusLayerProps = {
  content: string;
};

/**
 * A component that displays a single block of markdown content,
 * parsed into HTML for rich rendering.
 * @param {FocusLayerProps} props - The component props.
 */
export function FocusLayer({ content }: FocusLayerProps) {
  const proseClasses = "prose prose-sm prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded";

  const parsedContent = marked.parse(content || '');
  
  return (
      <div
        className={proseClasses}
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />
  );
}
