
import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormWrapperProps {
  children: React.ReactNode;
  onNext?: () => boolean | void;
  onBack?: () => void;
  onSkip?: () => void;
  showBackButton?: boolean;
  showSkip?: boolean;
  nextDisabled?: boolean;
  title: string;
  description: string;
}

export const FormWrapper = ({
  children,
  onNext,
  onBack,
  onSkip,
  showBackButton = true,
  showSkip = false,
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

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in-50 mobile-scrollable prevent-overflow">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex-grow">
        {children}
      </div>

      <div className={cn(
        "mt-6",
        isMobile && "sticky bottom-0 pt-4 pb-6 bg-background/80 backdrop-blur-sm border-t z-10"
      )}>
        <div className={cn(
          "flex gap-2",
          isMobile ? "flex-col" : "items-center"
        )}>
          <div className={cn(
            "flex gap-2",
            isMobile ? "flex-col w-full" : "flex-1"
          )}>
            {showBackButton && (
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className={cn(
                  isMobile && "order-2 h-12 w-full"
                )}
              >
                Previous Step
              </Button>
            )}
            <Button
              type="button"
              onClick={handleNext}
              disabled={nextDisabled}
              variant="default"
              className={cn(
                isMobile && "order-1 h-12 w-full",
                !showBackButton && !showSkip && "w-full"
              )}
            >
              Next Step
            </Button>
          </div>

          {showSkip && (
            <Button
              type="button"
              onClick={handleSkip}
              variant="ghost"
              className={cn(
                "flex items-center gap-1",
                isMobile && "order-3 h-12"
              )}
            >
              <span>Skip this section</span>
              <SkipForward className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
