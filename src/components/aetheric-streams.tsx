
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState, useEffect, useMemo } from "react";

/**
 * Props for the AethericStreams component.
 * @property {boolean} isThinking - Whether the main process is active, which influences the stream animation.
 */
type AethericStreamsProps = {
  isThinking: boolean;
};

/**
 * A component that renders an animated, ambient background of "aetheric streams".
 * The animation speed and density change based on the `isThinking` prop.
 * This is a purely decorative component to enhance the visual aesthetic.
 * @param {AethericStreamsProps} props - The component's props.
 */
export function AethericStreams({ isThinking }: AethericStreamsProps) {
  const isMobile = useIsMobile();
  const [streams, setStreams] = useState<React.ReactNode[]>([]);

  const streamCount = useMemo(() => {
    if (isMobile === undefined) return 0; // Don't render on server or before mobile check
    const baseCount = isMobile ? 5 : 15; // Significantly reduced count
    return isThinking ? baseCount * 1.5 : baseCount;
  }, [isMobile, isThinking]);

  useEffect(() => {
    // Generate streams only on the client-side to avoid hydration mismatch
    const generatedStreams = Array.from({ length: streamCount }).map((_, i) => {
      // Significantly increased duration to slow down animation to a crawl
      const duration = isThinking ? 40 + Math.random() * 20 : 80 + Math.random() * 40;
      return (
        <div
          key={i}
          className="aether-stream"
          style={{
            left: `${Math.random() * 100}%`,
            '--delay': `${Math.random() * -duration}s`,
            '--duration': `${duration}s`,
            filter: isThinking ? `drop-shadow(0 0 3px hsl(var(--accent)))` : `drop-shadow(0 0 1px hsl(var(--accent)))`,
          } as React.CSSProperties}
        />
      );
    });
    setStreams(generatedStreams);
  }, [streamCount, isThinking]);


  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden transition-all duration-500 ease-in-out">
      {streams}
    </div>
  );
}
