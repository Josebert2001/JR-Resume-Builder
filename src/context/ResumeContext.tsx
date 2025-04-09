
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GenerationResponse } from '@/services/aiService';
import { useLocalStorage } from '@/hooks/use-local-storage';

export type WorkExperience = {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description?: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  technologies?: string;
  url?: string;
};

export type ResumeData = {
  name: string;
  email: string;
  phone: string;
  course: string;
  school: string;
  interests: string;
  summary?: string;
  skills?: string[];
  workExperience?: WorkExperience[];
  certifications?: Certification[];
  projects?: Project[];
  location?: string;
  canRelocate?: boolean;
  openToRemote?: boolean;
  linkedIn?: string;
  githubUrl?: string;
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
  const [storedResumeData, setStoredResumeData] = useLocalStorage<ResumeData>('resumeData', {
    name: '',
    email: '',
    phone: '',
    course: '',
    school: '',
    interests: '',
    workExperience: [],
    certifications: [],
    projects: [],
    skills: [],
  });
  
  const [aiGenerated, setAiGenerated] = useState<GenerationResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateResumeData = (data: Partial<ResumeData>) => {
    setStoredResumeData((prev: ResumeData) => ({ ...prev, ...data }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData: storedResumeData,
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
