
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const glassPaneVariants = cva(
  "border shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default:
          "bg-[rgba(var(--glass-rgb),var(--glass-opacity))] backdrop-blur-[20px] border-[rgba(var(--glass-border-rgb),0.3)] shadow-[0_8px_32px_0_rgba(28,25,52,0.1)] rounded-xl",
        modal:
          "bg-[rgba(var(--glass-rgb),var(--glass-opacity))] backdrop-blur-[30px] border-[rgba(var(--glass-border-rgb),0.35)] shadow-[0_12px_40px_0_rgba(28,25,52,0.15)] rounded-2xl",
        sidebar:
          "bg-[rgba(var(--glass-rgb),var(--glass-opacity))] backdrop-blur-[25px] border-[rgba(var(--glass-border-rgb),0.25)] shadow-[4px_0_24px_0_rgba(28,25,52,0.1)] rounded-xl",
        notification:
          "bg-[rgba(var(--glass-rgb),var(--glass-opacity))] backdrop-blur-[15px] border-[rgba(var(--glass-border-rgb),0.4)] shadow-[0_4px_20px_0_rgba(28,25,52,0.12)] rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const variantDefaults = {
  default: { opacity: 0.15, blur: 20 },
  modal: { opacity: 0.20, blur: 30 },
  sidebar: { opacity: 0.10, blur: 25 },
  notification: { opacity: 0.25, blur: 15 },
}

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
      '--glass-rgb': '245, 255, 250', // Vitreous White
      '--glass-border-rgb': '245, 255, 250', // Vitreous White for border
      '--glass-opacity': opacity !== undefined ? opacity : (variant ? variantDefaults[variant].opacity : variantDefaults.default.opacity),
    } as React.CSSProperties;

    const currentBlur = blurIntensity !== undefined ? blurIntensity : (variant ? variantDefaults[variant].blur : variantDefaults.default.blur);
    
    // We must handle backdropFilter separately to apply the value correctly
    style.backdropFilter = `blur(${currentBlur}px)`;
    // For cross-browser compatibility
    style.WebkitBackdropFilter = `blur(${currentBlur}px)`;
    
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
