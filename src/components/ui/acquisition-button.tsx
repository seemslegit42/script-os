"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const acquisitionButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30",
        tribute: "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/30",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:shadow-accent/20",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface AcquisitionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof acquisitionButtonVariants> {
  asChild?: boolean;
  pulse?: boolean;
}

const AcquisitionButton = React.forwardRef<HTMLButtonElement, AcquisitionButtonProps>(
  ({ className, variant, size, asChild = false, pulse = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(acquisitionButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
        {pulse && (
          <span className="absolute -z-10 h-full w-full bg-primary-foreground/20 rounded-full animate-ping opacity-0 group-hover:opacity-100" />
        )}
        <span className="absolute -z-10 -left-1/4 -top-1/4 h-0 w-0 bg-primary-foreground/10 rounded-full group-hover:h-[200%] group-hover:w-[200%] transition-all duration-500 ease-out"></span>
      </Comp>
    )
  }
)
AcquisitionButton.displayName = "AcquisitionButton"

export { AcquisitionButton, acquisitionButtonVariants }
