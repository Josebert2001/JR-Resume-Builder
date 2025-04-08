
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GenerationResponse } from '@/services/aiService';

export type ResumeData = {
  name: string;
  email: string;
  phone: string;
  course: string;
  school: string;
  interests: string;
  summary?: string;
  skills?: string[];
};

type ResumeContextType = {
  resumeData: ResumeData;
  updateResumeData: (data: Partial<ResumeData>) => void;
  aiGenerated: GenerationResponse | null;
  setAiGenerated: (data: GenerationResponse | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    course: '',
    school: '',
    interests: '',
  });
  
  const [aiGenerated, setAiGenerated] = useState<GenerationResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateResumeData = (data: Partial<ResumeData>) => {
    setResumeData(prev => ({ ...prev, ...data }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateResumeData,
        aiGenerated,
        setAiGenerated,
        currentStep,
        setCurrentStep,
        isGenerating,
        setIsGenerating,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};
