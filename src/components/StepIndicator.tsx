import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';

const StepIndicator = () => {
  const { currentStep } = useResumeContext();

  const steps = [
    'Choose Template',
    'Personal Info',
    'Education',
    'Work Experience',
    'Skills',
    'Preview & Download'
  ];

  console.log('StepIndicator rendering, current step:', currentStep);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                index + 1 === currentStep
                  ? 'bg-resume-primary text-white'
                  : index + 1 < currentStep
                  ? 'bg-resume-success text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
              style={{ outline: '2px solid transparent', outlineOffset: '2px' }}
            >
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={`text-sm ${
                index + 1 === currentStep
                  ? 'text-resume-primary font-medium'
                  : index + 1 < currentStep
                  ? 'text-resume-success'
                  : 'text-gray-500'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-1 bg-gray-200 rounded">
        <div
          className="h-full bg-resume-primary rounded transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;
