import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { GenerationResponse } from '@/services/aiService';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

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
  | 'creative';

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location?: string;
  portfolio?: string;
  summary?: string;
};

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
  personalInfo?: PersonalInfo;
};

const EMPTY_RESUME: ResumeData = {
  name: '',
  email: '',
  phone: '',
  education: [],
  workExperience: [],
  certifications: [],
  projects: [],
  skills: [],
  template: 'professional',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    portfolio: '',
    summary: '',
  },
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
  template: TemplateType;
  nextStep: () => void;
  prevStep: () => void;
  education: Education[];
  updateEducation: (education: Education[]) => void;
  certifications: Certification[];
  updateCertifications: (certifications: Certification[]) => void;
  personalInfo: PersonalInfo;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [storedResumeData, setStoredResumeData] = useLocalStorage<ResumeData>('resumeData', EMPTY_RESUME);
  const [aiGenerated, setAiGenerated] = useState<GenerationResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Track the Supabase record ID and guard against overwriting during load
  const supabaseRecordId = useRef<string | null>(null);
  const isSyncingFromCloud = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load resume from Supabase when user signs in
  useEffect(() => {
    if (!user) {
      supabaseRecordId.current = null;
      return;
    }

    const loadFromSupabase = async () => {
      isSyncingFromCloud.current = true;
      const { data } = await supabase
        .from('user_resumes')
        .select('id, data')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.data) {
        supabaseRecordId.current = data.id as string;
        setStoredResumeData(data.data as ResumeData);
      }
      isSyncingFromCloud.current = false;
    };

    loadFromSupabase();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced save to Supabase whenever resume data changes
  useEffect(() => {
    if (!user || isSyncingFromCloud.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const title = [
        storedResumeData.personalInfo?.firstName,
        storedResumeData.personalInfo?.lastName,
      ]
        .filter(Boolean)
        .join(' ') || 'My Resume';

      const payload = {
        user_id: user.id,
        title,
        data: storedResumeData,
        template_name: storedResumeData.template ?? 'professional',
        is_default: true,
      };

      if (supabaseRecordId.current) {
        await supabase
          .from('user_resumes')
          .update(payload)
          .eq('id', supabaseRecordId.current);
      } else {
        const { data } = await supabase
          .from('user_resumes')
          .insert(payload)
          .select('id')
          .single();
        if (data) supabaseRecordId.current = data.id as string;
      }
    }, 2000);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [storedResumeData, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateResumeData = (data: Partial<ResumeData>) => {
    setStoredResumeData((prev: ResumeData) => ({ ...prev, ...data }));
  };

  const setTemplate = (template: TemplateType) => {
    updateResumeData({ template });
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const updateEducation = (education: Education[]) => updateResumeData({ education });
  const updateCertifications = (certifications: Certification[]) => updateResumeData({ certifications });

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setStoredResumeData((prev: ResumeData) => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo ?? EMPTY_RESUME.personalInfo!),
        ...info,
      },
    }));
  };

  const personalInfo = storedResumeData.personalInfo ?? EMPTY_RESUME.personalInfo!;

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
        template: storedResumeData.template ?? 'professional',
        nextStep,
        prevStep,
        education: storedResumeData.education ?? [],
        updateEducation,
        certifications: storedResumeData.certifications ?? [],
        updateCertifications,
        personalInfo,
        updatePersonalInfo,
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
