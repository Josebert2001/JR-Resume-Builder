
import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';

const StepIndicator = () => {
  const { currentStep } = useResumeContext();
  const totalSteps = 3;

  return (
    <div className="step-indicator">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`step-indicator-dot ${
            index + 1 === currentStep
              ? 'active'
              : index + 1 < currentStep
              ? 'completed'
              : 'incomplete'
          }`}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
