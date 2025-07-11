
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import * as React from "react";

type AethericStreamsProps = {
  isThinking: boolean;
};

export function AethericStreams({ isThinking }: AethericStreamsProps) {
  const isMobile = useIsMobile();
  
  const streamCount = React.useMemo(() => {
    const baseCount = isMobile ? 15 : 40;
    return isThinking ? baseCount * 3 : baseCount;
  }, [isMobile, isThinking]);

  const streams = React.useMemo(() => {
    return Array.from({ length: streamCount }).map((_, i) => {
      const duration = isThinking ? 3 + Math.random() * 5 : 10 + Math.random() * 10;
      return (
        <div
          key={i}
          className="aether-stream"
          style={{
            left: `${Math.random() * 100}%`,
            '--delay': `${Math.random() * -duration}s`,
            '--duration': `${duration}s`,
            filter: isThinking ? `drop-shadow(0 0 5px hsl(var(--accent)))` : `drop-shadow(0 0 3px hsl(var(--accent)))`,
          } as React.CSSProperties}
        />
      );
    });
  }, [streamCount, isThinking]);


  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden transition-all duration-500 ease-in-out">
      {streams}
    </div>
  );
}
