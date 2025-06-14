
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 hover:-translate-y-0.5",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl hover:shadow-red-500/25",
        outline: "border border-white/20 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/30 hover:shadow-lg",
        secondary: "bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 border border-white/10",
        ghost: "text-white hover:bg-white/10 hover:text-cyan-100",
        link: "text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300",
        gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white hover:opacity-90 shadow-lg hover:shadow-xl",
        cyber: "bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-cyan-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1 relative overflow-hidden",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-12 w-12",
        xl: "h-16 rounded-xl px-12 text-lg",
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
          isMobile && size === "icon" && "h-14 w-14",
          // Add tap highlight color for mobile
          isMobile && "tap-highlight-color-transparent",
          // Cyber button animation
          variant === "cyber" && "before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-[100%]"
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
