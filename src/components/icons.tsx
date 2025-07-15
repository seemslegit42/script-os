// src/components/icons.tsx
'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * A decorative, animated SVG icon representing the canonical sigil of ΛΞVON OS.
 * It's an interwoven, continuous path with a pulsing core, embodying flow and intelligence.
 * @param {React.ComponentProps<'svg'>} props - Standard SVG component props.
 */
export const ScribeSigil = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 3, bounce: 0, delay: 0.5 },
        opacity: { duration: 0.01 }
      }
    }
  };

  const pulse = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 3,
    },
  };

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-20 h-20', className)}
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
      </defs>
      
      {/* Outer Circle */}
      <motion.circle
        cx="50"
        cy="50"
        r="48"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="1.5"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      />
      
      {/* Interwoven Path - The True Form */}
      <motion.path
        d="M50 12C50 21 42 21 42 30V42H30C21 42 21 50 12 50C21 50 21 58 30 58H42V70C42 79 50 79 50 88C50 79 58 79 58 70V58H70C79 58 79 50 88 50C79 50 79 42 70 42H58V30C58 21 50 21 50 12Z"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        initial="hidden"
        animate="visible"
      />

      {/* Central Core (Agentic Spark) */}
       <motion.rect
        x="42"
        y="42"
        width="16"
        height="16"
        rx="2"
        fill="hsl(var(--primary))"
        filter="url(#glow)"
        initial={{ opacity: 0 }}
        animate={{...pulse.animate, opacity: [0, 0, 1] }}
        transition={{...pulse.transition, opacity: { duration: 1, delay: 2.5 } }}
      />
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
