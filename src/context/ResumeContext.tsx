import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GenerationResponse } from '@/services/aiService';
import { useLocalStorage } from '@/hooks/use-local-storage';

export type WorkExperience = {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
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

export type TemplateType = 
  | 'professional' 
  | 'modern' 
  | 'minimal' 
  | 'chronological'
  | 'functional'
  | 'combination'
  | 'infographic'
  | 'profile'
  | 'targeted'
  | 'mini'
  | 'creative';

export type ResumeData = {
  name: string;
  email: string;
  phone: string;
  location?: string;
  degree?: string;
  fieldOfStudy?: string;
  school?: string;
  graduationYear?: string;
  relevantCourses?: string[];
  achievements?: string[];
  summary?: string;
  skills?: string[];
  workExperience?: WorkExperience[];
  certifications?: Certification[];
  projects?: Project[];
  canRelocate?: boolean;
  openToRemote?: boolean;
  linkedIn?: string;
  githubUrl?: string;
  template?: TemplateType;
  interests?: string;
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
  setTemplate: (template: TemplateType) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [storedResumeData, setStoredResumeData] = useLocalStorage<ResumeData>('resumeData', {
    name: '',
    email: '',
    phone: '',
    fieldOfStudy: '',
    school: '',
    interests: '',
    workExperience: [],
    certifications: [],
    projects: [],
    skills: [],
    template: 'professional',
  });
  
  const [aiGenerated, setAiGenerated] = useState<GenerationResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // Changed to start with template selection (step 1)
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    console.log('ResumeContext state:', {
      currentStep,
      storedResumeData,
      isGenerating
    });
  }, [currentStep, storedResumeData, isGenerating]);

  const updateResumeData = (data: Partial<ResumeData>) => {
    console.log('Updating resume data:', data);
    setStoredResumeData((prev: ResumeData) => ({ ...prev, ...data }));
  };

  const setTemplate = (template: TemplateType) => {
    console.log('Setting template:', template);
    updateResumeData({ template });
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
        setTemplate,
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
