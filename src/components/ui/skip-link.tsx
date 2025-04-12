import React from 'react';
import { cn } from "@/lib/utils";

interface SkipLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  contentId: string;
}

export const SkipLink = ({ contentId, className, ...props }: SkipLinkProps) => {
  return (
    <a
      href={`#${contentId}`}
      className={cn(
        "skip-to-content",
        "focus:ring-2 focus:ring-resume-primary",
        className
      )}
      {...props}
    >
      Skip to main content
    </a>
  );
};