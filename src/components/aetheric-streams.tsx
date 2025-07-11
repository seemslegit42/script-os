
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import * as React from "react";

export function AethericStreams() {
  const isMobile = useIsMobile();
  const streamCount = React.useMemo(() => (isMobile ? 20 : 50), [isMobile]);

  // Use useEffect to ensure this runs only on the client
  const [streams, setStreams] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    setStreams(
      Array.from({ length: streamCount }).map((_, i) => (
        <div
          key={i}
          className="aether-stream"
          style={{
            left: `${Math.random() * 100}%`,
            '--delay': `${Math.random() * -20}s`,
            '--duration': `${10 + Math.random() * 10}s`,
          } as React.CSSProperties}
        />
      ))
    );
  }, [streamCount]);


  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {streams}
    </div>
  );
}
