
import React from 'react';
import { ResumeProvider } from '@/context/ResumeContext';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import EducationForm from '@/components/EducationForm';
import ResumePreview from '@/components/ResumePreview';
import StepIndicator from '@/components/StepIndicator';
import { useResumeContext } from '@/context/ResumeContext';

const ResumeBuilder = () => {
  const { currentStep } = useResumeContext();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <StepIndicator />
      
      {currentStep === 1 && <PersonalInfoForm />}
      {currentStep === 2 && <EducationForm />}
      {currentStep === 3 && <ResumePreview />}
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-resume-primary text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">AI Resume Generator</h1>
          <p className="mt-2 opacity-80">Create professional resumes with AI-powered content</p>
        </div>
      </header>
      
      <ResumeProvider>
        <ResumeBuilder />
      </ResumeProvider>
      
      <footer className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} AI Resume Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
