import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { TouchRipple } from "@/components/ui/touch-ripple";
import { Plus, Download, Share2, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onDownload?: () => void;
  onShare?: () => void;
  isDownloading?: boolean;
}

export const FloatingActionButton = ({
  onDownload,
  onShare,
  isDownloading
}: FloatingActionButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Speed dial actions */}
      <div className={cn(
        "flex flex-col items-end gap-3 mb-4 transition-all duration-200",
        isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {onDownload && (
          <TouchRipple className="rounded-full">
            <Button
              variant="default"
              size="icon"
              className="bg-resume-primary hover:bg-resume-secondary h-12 w-12 rounded-full shadow-lg"
              onClick={() => handleAction(onDownload)}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
            </Button>
          </TouchRipple>
        )}
        
        {onShare && (
          <TouchRipple className="rounded-full">
            <Button
              variant="default"
              size="icon"
              className="bg-resume-primary hover:bg-resume-secondary h-12 w-12 rounded-full shadow-lg"
              onClick={() => handleAction(onShare)}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </TouchRipple>
        )}
      </div>

      {/* Main FAB */}
      <TouchRipple className="rounded-full">
        <Button
          variant="default"
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-xl bg-resume-primary hover:bg-resume-secondary transition-all duration-300",
            isExpanded && "rotate-45"
          )}
          onClick={handleToggle}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </TouchRipple>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};