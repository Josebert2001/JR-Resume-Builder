import React from 'react';
import { PersonalInfoForm } from '@/components/PersonalInfoForm';
import { EducationForm } from '@/components/EducationForm';
import { ResumePreview } from '@/components/ResumePreview';
import { StepIndicator } from '@/components/StepIndicator';
import { useResumeContext } from '@/context/ResumeContext';
import { WorkExperienceForm } from '@/components/WorkExperienceForm';
import { SkillsForm } from '@/components/SkillsForm';
import { ResumeTemplates } from '@/components/ResumeTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsForm } from '@/components/ProjectsForm';
import { PageHeader } from '@/components/PageHeader';
import { ResumeImprover } from '@/components/ResumeImprover';
import { ResumeUpload } from '@/components/ResumeUpload';

const STEP_LABELS = ['Template', 'Info', 'Education', 'Work', 'Skills', 'Projects', 'Preview'];

const ResumeBuilder = () => {
  const { currentStep, resumeData } = useResumeContext();
  const totalSteps = STEP_LABELS.length;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="ResumAI Builder" />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} labels={STEP_LABELS} />

        {currentStep === 1 && <ResumeTemplates />}
        {currentStep === 2 && <PersonalInfoForm />}
        {currentStep === 3 && <EducationForm />}
        {currentStep === 4 && <WorkExperienceForm />}
        {currentStep === 5 && <SkillsForm />}
        {currentStep === 6 && <ProjectsForm />}

        {currentStep === 7 && (
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="templates">Template</TabsTrigger>
              <TabsTrigger value="upload">Analyze</TabsTrigger>
              <TabsTrigger value="improve">Improve</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <ResumePreview />
            </TabsContent>
            <TabsContent value="templates">
              <ResumeTemplates />
            </TabsContent>
            <TabsContent value="upload">
              <ResumeUpload />
            </TabsContent>
            <TabsContent value="improve">
              <ResumeImprover resumeData={resumeData} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
