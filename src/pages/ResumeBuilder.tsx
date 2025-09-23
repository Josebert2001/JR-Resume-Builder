
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

const ResumeBuilder = () => {
  const { currentStep, resumeData } = useResumeContext();
  
  // Total number of steps in the resume building process
  const totalSteps = 7;
  
  console.log("Current step:", currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="ResumAI Builder" />
      
      <div className="container mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Step 1: Template Selection */}
        {currentStep === 1 && <ResumeTemplates />}
        
        {/* Step 2: Personal Information */}
        {currentStep === 2 && <PersonalInfoForm />}
        
        {/* Step 3: Education */}
        {currentStep === 3 && <EducationForm />}
        
        {/* Step 4: Work Experience */}
        {currentStep === 4 && <WorkExperienceForm />}
        
        {/* Step 5: Skills */}
        {currentStep === 5 && <SkillsForm />}

        {/* Step 6: Projects */}
        {currentStep === 6 && <ProjectsForm />}
        
        {/* Step 7: Final Preview */}
        {currentStep === 7 && (
          <Tabs defaultValue="preview" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="preview">Resume Preview</TabsTrigger>
              <TabsTrigger value="templates">Change Template</TabsTrigger>
              <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
              <TabsTrigger value="improve">Improve Resume</TabsTrigger>
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
