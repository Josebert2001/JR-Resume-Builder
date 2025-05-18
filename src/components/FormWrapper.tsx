
import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { useSwipeNavigation } from '@/hooks/use-swipe-navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface FormWrapperProps {
  children: React.ReactNode;
  onNext?: () => boolean | void;
  onBack?: () => void;
  showBackButton?: boolean;
  nextDisabled?: boolean;
  title: string;
  description: string;
}

export const FormWrapper = ({
  children,
  onNext,
  onBack,
  showBackButton = true,
  nextDisabled = false,
  title,
  description
}: FormWrapperProps) => {
  const { currentStep, setCurrentStep } = useResumeContext();
  const isMobile = useIsMobile();
  
  const handleNext = () => {
    if (nextDisabled) return;
    
    // If onNext returns false, don't proceed
    if (onNext && onNext() === false) {
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
    setCurrentStep(currentStep - 1);
  };

  const { touchHandlers } = useSwipeNavigation({
    onSwipeLeft: handleNext,
    onSwipeRight: showBackButton ? handleBack : undefined,
    threshold: 75
  });

  const handleSwipeHint = () => {
    if (isMobile) {
      toast.info(
        showBackButton 
          ? 'Swipe left to continue, right to go back' 
          : 'Swipe left to continue',
        {
          position: 'bottom-center',
          duration: 2000
        }
      );
    }
  };

  return (
    <div 
      className="flex flex-col animate-in fade-in-50 overflow-y-visible"
      {...touchHandlers}
      onMouseEnter={handleSwipeHint}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex-grow overflow-y-visible">
        {children}
      </div>

      <div className={cn(
        "mt-6",
        isMobile && "pt-4 pb-6 bg-background/80 backdrop-blur-sm border-t"
      )}>
        <div className={cn(
          "flex gap-2",
          isMobile ? "flex-col" : "justify-between"
        )}>
          {showBackButton && (
            <button
              type="button"
              onClick={handleBack}
              className={cn(
                "px-4 h-10 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors",
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                isMobile && "order-2 h-12"
              )}
            >
              Previous Step
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={nextDisabled}
            className={cn(
              "px-4 h-10 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors",
              "bg-resume-primary text-white hover:bg-resume-secondary",
              "disabled:opacity-50 disabled:pointer-events-none",
              isMobile && "order-1 h-12",
              !showBackButton && "w-full"
            )}
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};
