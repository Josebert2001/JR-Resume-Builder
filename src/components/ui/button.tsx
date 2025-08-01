
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-resume-primary to-resume-secondary text-white hover:opacity-90 shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-12 rounded-md px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const isMobile = useIsMobile();
    const Comp = asChild ? Slot : "button";
    
    // Auto-adjust size for better touch targets on mobile
    const mobileAdjustedSize = isMobile && size === "default" ? "lg" : 
                              isMobile && size === "sm" ? "default" : 
                              isMobile && size === "icon" ? "icon" : size;
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size: mobileAdjustedSize, className }),
          // Enhanced touch feedback for mobile
          isMobile && "active:scale-[0.98] active:opacity-90 touch-callout-none",
          // Improved tap target size for mobile
          isMobile && size === "icon" && "h-12 w-12",
          // Add tap highlight color for mobile
          isMobile && "tap-highlight-color-transparent",
          // Add hover animation for desktop
          !isMobile && "hover:-translate-y-px transition-transform duration-200"
        )}
        ref={ref}
        // Enhanced mobile accessibility
        {...(isMobile && {
          role: "button",
          tabIndex: props.disabled ? -1 : 0,
          "aria-disabled": props.disabled,
        })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
