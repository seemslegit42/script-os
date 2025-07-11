// src/components/icons.tsx
'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const ScribeSigil = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-8 h-8', className)}
      {...props}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="core-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary-foreground))" />
            <stop offset="70%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
        </radialGradient>
      </defs>

      {/* Central Core */}
      <motion.circle
        cx="50"
        cy="50"
        r="12"
        fill="url(#core-gradient)"
        filter="url(#glow)"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Orbiting Elements */}
      <g>
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="hsl(var(--accent) / 0.5)"
          strokeWidth="1.5"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.circle
          cx="80" // 50 + 30 * cos(0)
          cy="50" // 50 + 30 * sin(0)
          r="4"
          fill="hsl(var(--accent))"
          filter="url(#glow)"
          initial={{ transform: 'rotate(0deg) translateX(30px) rotate(0deg)' }}
          animate={{ transform: 'rotate(360deg) translateX(30px) rotate(-360deg)' }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </g>
      
      <g>
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--secondary) / 0.3)"
          strokeWidth="1"
          strokeDasharray="4 8"
           initial={{ rotate: 45 }}
          animate={{ rotate: -315 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
         <motion.circle
          cx="50"
          cy="5.5" // 50 - 45.5 * cos(0)
          r="3"
          fill="hsl(var(--secondary))"
          initial={{ transform: 'rotate(0deg) translateX(45px) rotate(0deg)' }}
          animate={{ transform: 'rotate(-360deg) translateX(45px) rotate(360deg)' }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 1 }}
        />
      </g>
    </svg>
  );
};
