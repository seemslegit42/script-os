"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const glassPaneVariants = cva(
  "rounded-lg border shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default:
          "bg-[rgba(40,38,62,0.5)] backdrop-blur-lg border-primary/20 shadow-primary/10", // Adjusted for better visibility from card
        modal:
          "bg-[rgba(40,38,62,0.6)] backdrop-blur-xl border-primary/30 shadow-primary/20",
        sidebar:
          "bg-[rgba(40,38,62,0.4)] backdrop-blur-xl border-primary/10 shadow-primary/5",
        notification:
          "bg-[rgba(40,38,62,0.7)] backdrop-blur-md border-primary/40 shadow-primary/25",
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
  ({ className, variant, children, blurIntensity, opacity, ...props }, ref) => {
    const style = {
      ...props.style,
    } as React.CSSProperties;

    if (blurIntensity !== undefined) {
      style.backdropFilter = `blur(${blurIntensity}px)`;
      style.WebkitBackdropFilter = `blur(${blurIntensity}px)`;
    }
    if (opacity !== undefined) {
      // This is tricky as we can't easily override the alpha of the variant's bg color.
      // For now, we'll recommend using variants or className overrides for opacity.
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
