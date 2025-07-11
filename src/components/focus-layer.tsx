// src/components/focus-layer.tsx
"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type FocusLayerProps = {
  whyContent: string;
  howContent: string;
};

export function FocusLayer({ whyContent, howContent }: FocusLayerProps) {
  const [activeTab, setActiveTab] = useState('why');

  const proseClasses = "prose prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded";

  return (
    <Tabs defaultValue="why" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 bg-black/20">
        <TabsTrigger value="why">The 'Why'</TabsTrigger>
        <TabsTrigger value="how">The 'How'</TabsTrigger>
      </TabsList>
      <TabsContent value="why" className="mt-4">
        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: whyContent }}
        />
      </TabsContent>
      <TabsContent value="how" className="mt-4">
        <div
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: howContent }}
        />
      </TabsContent>
    </Tabs>
  );
}
