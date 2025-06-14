
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl",
        outline: "border-2 border-slate-600 bg-transparent text-slate-200 shadow-sm hover:bg-slate-800/50 hover:border-slate-500 hover:text-white transition-colors",
        secondary: "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md hover:from-slate-600 hover:to-slate-700 hover:shadow-lg hover:scale-[1.02]",
        ghost: "text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors",
        link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
        xl: "h-14 rounded-2xl px-10 text-lg font-semibold",
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
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isMobile && "active:scale-95 touch-callout-none tap-highlight-color-transparent",
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
