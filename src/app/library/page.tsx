
'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Header } from '@/components/header';
import { Sigil } from '@/components/sigil';
import { ScribeSigil } from '@/components/icons';
import useSWR from 'swr';
import { Scripture } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then(res => res.json());

/**
 * The main library page, envisioned as the "Grand Hall" or "Pantheon."
 * It displays all available scriptures as an interactive 3D constellation
 * of Aetheric Sigils orbiting a central point.
 * @returns {React.ReactElement} The rendered library pantheon page.
 */
export default function LibraryPage() {
  const { data: docs, error } = useSWR<Scripture[]>('/api/docs', fetcher);

  const sigilPositions = React.useMemo(() => {
    if (!docs) return [];
    const num = docs.length;
    const radius = Math.max(8, num * 0.4); // Dynamic radius
    return docs.map((doc, i) => {
      const angle = (i / num) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = (Math.random() - 0.5) * 4; // Add some vertical variation
      return { position: [x, y, z] as [number, number, number], doc };
    });
  }, [docs]);

  return (
    <>
      <Header />
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <Canvas camera={{ position: [0, 5, 20], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 10, 0]} intensity={1.5} color="#6A0DAD" />
          <pointLight position={[15, 5, -15]} intensity={1} color="#3EB991" />
          <pointLight position={[-15, -5, 15]} intensity={1} color="#20B2AA" />
          
          <Suspense fallback={null}>
            {error && <p className="text-destructive">Failed to load scriptures.</p>}
            {!docs && !error && Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
            {docs && sigilPositions.map(({ position, doc }) => (
              <Sigil key={doc.id} position={position} doc={doc} />
            ))}
          </Suspense>

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minDistance={5} 
            maxDistance={40} 
            autoRotate 
            autoRotateSpeed={0.2}
          />
        </Canvas>
      </div>
       <main className="container mx-auto max-w-6xl py-24 px-4 h-screen flex flex-col justify-end items-center pointer-events-none">
        <div className="text-center mb-12 bg-background/30 backdrop-blur-sm p-6 rounded-lg border border-primary/20 pointer-events-auto">
            <h1 className="text-4xl font-bold sigil-obelisk text-primary-foreground">The Scriptorium</h1>
            <p className="text-lg text-muted-foreground sigil-codex mt-2">A constellation of self-contained truths from the Nexus canon.</p>
            <p className="text-sm text-muted-foreground/70 sigil-glyph mt-4">Click and drag to explore the canon. Scroll to zoom.</p>
        </div>
      </main>
    </>
  );
}
