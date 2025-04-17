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

export type Education = {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  graduationDate: string;
  description: string;
  gpa?: string;
};

export type Skill = {
  id: string;
  name: string;
  level: number;
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
  education: Education[];
  skills?: Skill[];
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
  nextStep: () => void;
  prevStep: () => void;
  education: Education[];
  updateEducation: (education: Education[]) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [storedResumeData, setStoredResumeData] = useLocalStorage<ResumeData>('resumeData', {
    name: '',
    email: '',
    phone: '',
    education: [],
    workExperience: [],
    certifications: [],
    projects: [],
    skills: [],
    template: 'professional',
  });
  
  const [aiGenerated, setAiGenerated] = useState<GenerationResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
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

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const updateEducation = (education: Education[]) => {
    updateResumeData({ education });
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
        nextStep,
        prevStep,
        education: storedResumeData.education,
        updateEducation,
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
