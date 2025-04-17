import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center relative">
        {/* Progress bar */}
        <div className="absolute h-0.5 bg-gray-200 w-full max-w-2xl" />
        <div 
          className="absolute h-0.5 bg-resume-primary transition-all duration-300 w-full max-w-2xl" 
          style={{ 
            width: `${(currentStep / (totalSteps - 1)) * 100}%`,
            maxWidth: '32rem'
          }} 
        />

        {/* Step dots */}
        <div className="relative flex justify-between w-full max-w-2xl px-2">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center"
              >
                <button
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                    isCompleted ? "bg-resume-primary border-resume-primary text-white" :
                    isCurrent ? "border-resume-primary bg-white" :
                    "border-gray-300 bg-white",
                    "relative group touch-none",
                    isMobile ? "active:scale-110" : "hover:scale-110"
                  )}
                  style={{
                    transform: isCurrent ? 'scale(1.1)' : undefined
                  }}
                >
                  {isCompleted ? (
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  ) : (
                    <span className={cn(
                      "text-sm font-medium",
                      isCurrent ? "text-resume-primary" : "text-gray-400"
                    )}>
                      {index + 1}
                    </span>
                  )}
                </button>

                {/* Step labels */}
                {labels && (
                  <span 
                    className={cn(
                      "absolute mt-10 text-xs font-medium text-center whitespace-nowrap transition-colors duration-200",
                      isCurrent ? "text-resume-primary" : "text-gray-500",
                      "max-w-[120px] overflow-hidden text-ellipsis"
                    )}
                  >
                    {labels[index]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
