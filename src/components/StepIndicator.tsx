import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => {
  return (
    <div className="w-full mb-2">
      <div className="flex items-start justify-center">
        <div className="flex items-start w-full max-w-2xl">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            const isUpcoming = stepNum > currentStep;

            return (
              <React.Fragment key={index}>
                {/* Step circle + label */}
                <div className="flex flex-col items-center flex-1 first:items-start last:items-end">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200 font-medium text-sm',
                      isCompleted && 'bg-resume-primary border-resume-primary text-white',
                      isCurrent && 'border-resume-primary bg-white dark:bg-gray-900 text-resume-primary scale-110 shadow-sm shadow-blue-200 dark:shadow-blue-900',
                      isUpcoming && 'border-border bg-background text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    ) : (
                      <span>{stepNum}</span>
                    )}
                  </div>
                  {labels && (
                    <span
                      className={cn(
                        'mt-2 text-[11px] font-medium text-center leading-tight hidden sm:block',
                        isCurrent && 'text-resume-primary',
                        isCompleted && 'text-muted-foreground',
                        isUpcoming && 'text-muted-foreground/60'
                      )}
                    >
                      {labels[index]}
                    </span>
                  )}
                </div>

                {/* Connector line */}
                {index < totalSteps - 1 && (
                  <div className="flex-1 h-0.5 mt-4 mx-1 rounded-full overflow-hidden bg-border">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        isCompleted ? 'bg-resume-primary w-full' : 'w-0'
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
