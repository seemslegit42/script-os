
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const glassPaneVariants = cva(
  "shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-[rgba(245,255,250,0.15)] border border-[rgba(245,255,250,0.3)] shadow-[0_8px_32px_0_rgba(28,25,52,0.1)] rounded-xl backdrop-blur-[20px]",
        modal: "bg-[rgba(245,255,250,0.20)] border border-[rgba(245,255,250,0.35)] shadow-[0_12px_40px_0_rgba(28,25,52,0.15)] rounded-2xl backdrop-blur-[30px]",
        sidebar: "bg-[rgba(245,255,250,0.10)] border border-[rgba(245,255,250,0.25)] shadow-[4px_0_24px_0_rgba(28,25,52,0.1)] rounded-xl backdrop-blur-[25px]",
        notification: "bg-[rgba(245,255,250,0.25)] border border-[rgba(245,255,250,0.4)] shadow-[0_4px_20px_0_rgba(28,25,52,0.12)] rounded-lg backdrop-blur-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface GlassPaneProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassPaneVariants> {
  blurIntensity?: number;
  opacity?: number;
}

const GlassPane = React.forwardRef<HTMLDivElement, GlassPaneProps>(
  ({ className, variant, children, blurIntensity, opacity, style: propStyle, ...props }, ref) => {

    const style = { ...propStyle } as React.CSSProperties;

    if (blurIntensity !== undefined) {
      style.backdropFilter = `blur(${blurIntensity}px)`;
      style.WebkitBackdropFilter = `blur(${blurIntensity}px)`;
    }
    
    if (opacity !== undefined) {
        // This will override the background color defined in the variant
        style.backgroundColor = `rgba(245, 255, 250, ${opacity})`;
    }

    return (
      <div
        className={cn(glassPaneVariants({ variant, className }))}
        ref={ref}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GlassPane.displayName = "GlassPane"

export { GlassPane }
