// src/components/icons.tsx
'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';


/**
 * A 3D, interactive representation of the Sovereign's Ledger, the canonical sigil of ΛΞVON OS.
 * This component renders a full `react-three-fiber` scene.
 * @param {React.ComponentProps<'div'>} props - Standard div component props.
 */
export const ScribeSigil = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div className={className} {...props}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 10]} intensity={2.5} color="hsl(var(--primary))" />
        <pointLight position={[10, 10, 5]} intensity={1.5} color="hsl(var(--secondary))" />
        <Ledger />
      </Canvas>
    </div>
  );
};

function Ledger() {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
        const rotationSpeed = hovered ? 0.3 : 0.05;
        groupRef.current.rotation.y += delta * rotationSpeed;
        groupRef.current.rotation.x += delta * (rotationSpeed * 0.5);
    }
  });

  return (
    <group ref={groupRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Crystalline Core */}
      <Icosahedron args={[1, 1]}>
        <meshStandardMaterial
          color="hsl(var(--secondary))"
          emissive="hsl(var(--secondary))"
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.7}
          roughness={0.1}
        />
      </Icosahedron>

      {/* Runic Rings - a simplified representation of the complex interwoven paths */}
       <Torus args={[3, 0.15, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="hsl(var(--muted-foreground))" metalness={0.9} roughness={0.1} emissive="hsl(var(--muted))" emissiveIntensity={0.1}/>
      </Torus>
      <Torus args={[3, 0.15, 16, 100]} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
         <meshStandardMaterial color="hsl(var(--muted-foreground))" metalness={0.9} roughness={0.1} emissive="hsl(var(--muted))" emissiveIntensity={0.1}/>
      </Torus>
       <Torus args={[2.2, 0.08, 16, 100]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
         <meshStandardMaterial color="hsl(var(--ring))" metalness={0.9} roughness={0.2} emissive="hsl(var(--ring))" emissiveIntensity={hovered ? 0.5 : 0.2}/>
      </Torus>
    </group>
  );
}


/**
 * A decorative, animated SVG icon used to provide feedback when saving a scripture.
 * It features inward-spiraling lines that converge on a stable core.
 * @param {React.ComponentProps<'svg'>} props - Standard SVG component props.
 */
export const SaveSigil = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-8 h-8', className)}
      {...props}
    >
      <defs>
         <filter id="save-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
       {/* Stable Core */}
      <motion.circle
        cx="50"
        cy="50"
        r="10"
        fill="hsl(var(--primary-foreground))"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
      />
      {/* Inward Spirals */}
      <g filter="url(#save-glow)">
        <motion.path
          d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="2"
          strokeDasharray="251" // Circumference of circle with r=40
          initial={{ strokeDashoffset: 251, opacity: 0, rotate: -90, transformOrigin: 'center' }}
          animate={{ strokeDashoffset: 0, opacity: [0, 1, 1, 0], scale: [1, 1, 1, 0.3] }}
          transition={{ duration: 1.5, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}
        />
        <motion.path
          d="M 50,50 m -25,0 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="2"
          strokeDasharray="157" // Circumference of circle with r=25
          initial={{ strokeDashoffset: 157, opacity: 0, rotate: 90, transformOrigin: 'center' }}
          animate={{ strokeDashoffset: 0, opacity: [0, 1, 1, 0], scale: [1, 1, 1, 0.4] }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2, times: [0, 0.2, 0.8, 1] }}
        />
      </g>
    </svg>
  );
};
