
'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { Scripture } from '@/lib/types';
import { cn } from '@/lib/utils';

type SigilProps = {
  position: [number, number, number];
  doc: Scripture;
};

/**
 * A 3D component representing a single documentation scripture as an
 * interactive, glowing, crystalline object in the library constellation.
 * @param {SigilProps} props - The component's props.
 * @returns {React.ReactElement} The rendered 3D sigil.
 */
export function Sigil({ position, doc }: SigilProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const handleClick = () => {
    router.push(`/library/${doc.id}`);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  // Assign color based on keywords in title
  const getColor = () => {
    const title = doc.title?.toLowerCase() || '';
    if (title.includes('aegis') || title.includes('security') || title.includes('threat') || title.includes('phalanx')) return '#3EB991'; // Patina Green
    if (title.includes('obelisk') || title.includes('economy') || title.includes('klepsydra') || title.includes('tribute')) return '#20B2AA'; // Roman Aqua
    return '#6A0DAD'; // Imperial Purple
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={hovered ? 1.5 : 1}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color={getColor()}
        emissive={getColor()}
        emissiveIntensity={hovered ? 0.7 : 0.2}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={hovered ? 1 : 0.8}
      />
      <Html position={[0, 1.5, 0]} center>
        <div
          className={cn(
            "text-center bg-background/50 backdrop-blur-sm p-2 rounded-md shadow-lg transition-opacity duration-300 pointer-events-none w-48",
            hovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <h3 className="text-sm font-bold sigil-obelisk text-primary-foreground">{doc.title}</h3>
        </div>
      </Html>
    </mesh>
  );
}
