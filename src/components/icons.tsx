// src/components/icons.tsx
'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * A decorative, animated SVG icon representing The Sovereign's Ledger.
 * It's a complex, multi-layered armillary sphere that embodies the project's philosophy.
 * @param {React.ComponentProps<'svg'>} props - Standard SVG component props.
 */
export const ScribeSigil = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-10 h-10', className)}
      {...props}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="core-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.8)" />
            <stop offset="50%" stopColor="hsl(var(--secondary) / 0.7)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
        </radialGradient>
        <linearGradient id="crest-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary-foreground) / 0.9)" />
            <stop offset="100%" stopColor="hsl(var(--primary-foreground) / 0.6)" />
        </linearGradient>
      </defs>

      <g id="rings">
        {/* Ring 1 - Outer */}
        <motion.circle
          cx="50" cy="50" r="45"
          fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="0.5"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        {/* Ring 2 - Inner Dashed */}
        <motion.circle
          cx="50" cy="50" r="38"
          fill="none" stroke="hsl(var(--accent) / 0.4)" strokeWidth="1" strokeDasharray="5 10"
          initial={{ rotate: 90 }}
          animate={{ rotate: -270 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />
         {/* Ring 3 - Vertical Ellipse */}
        <motion.ellipse
            cx="50" cy="50" rx="28" ry="42"
            fill="none" stroke="hsl(var(--secondary) / 0.3)" strokeWidth="0.75"
            initial={{ rotate: -20 }}
            animate={{ rotate: 340 }}
            transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        />
         {/* Ring 4 - Horizontal Ellipse */}
         <motion.ellipse
            cx="50" cy="50" rx="42" ry="28"
            fill="none" stroke="hsl(var(--secondary) / 0.3)" strokeWidth="0.75"
            initial={{ rotate: 20 }}
            animate={{ rotate: -340 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        />
      </g>

      {/* Central Core */}
      <motion.circle
        cx="50"
        cy="50"
        r="15"
        fill="url(#core-gradient)"
        filter="url(#glow)"
        animate={{ 
            scale: [1, 1.03, 1],
            opacity: [0.9, 1, 0.9]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
       {/* Winged Crest */}
       <g transform="translate(50 50) scale(0.3)">
        <motion.path
          d="M-35,2 L-15,2 L-15,10 C-15,10 -5,15 0,25 C5,15 15,10 15,10 L15,2 L35,2 L35,12 C35,12 25,20 10,35 L-10,35 C-25,20 -35,12 -35,12Z M0,0 L10,15 L-10,15Z"
          fill="url(#crest-gradient)"
          stroke="hsl(var(--primary-foreground) / 0.5)"
          strokeWidth="2"
          initial={{ y: 2, opacity: 0.8 }}
          animate={{ y: [2, 0, 2], opacity: [0.8, 0.95, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </g>

    </svg>
  );
};

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
