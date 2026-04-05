import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
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
import { CertificationsForm } from '@/components/CertificationsForm';
import { PageHeader } from '@/components/PageHeader';
import { ResumeImprover } from '@/components/ResumeImprover';
import { ResumeUpload } from '@/components/ResumeUpload';
import { ResumeScorePanel } from '@/components/ResumeScorePanel';
import { JobMatchPanel } from '@/components/JobMatchPanel';
import { ShareableResumePanel } from '@/components/ShareableLink';

const STEP_LABELS = ['Template', 'Info', 'Education', 'Work', 'Skills', 'Projects', 'Certifications', 'Preview'];

const ResumeBuilder = () => {
  const { currentStep, resumeData, prevStep } = useResumeContext();
  const totalSteps = STEP_LABELS.length;

  return (
    <div className="min-h-screen bg-[#f7f3ed] dark:bg-[#0e0b08]">
      <PageHeader title="Talory Builder" />

      <div className="container mx-auto px-4 py-5 max-w-5xl">
        <div className="bg-white dark:bg-[#1a1510] rounded-3xl px-6 pt-6 pb-3 mb-4 shadow-sm">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} labels={STEP_LABELS} />
        </div>

        {currentStep === 1 && <ResumeTemplates />}
        {currentStep === 2 && <PersonalInfoForm />}
        {currentStep === 3 && <EducationForm />}
        {currentStep === 4 && <WorkExperienceForm />}
        {currentStep === 5 && <SkillsForm />}
        {currentStep === 6 && <ProjectsForm />}
        {currentStep === 7 && <CertificationsForm />}

        {currentStep === 8 && (
          <>
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 px-2"
              data-testid="button-back-to-builder"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <Tabs defaultValue="preview" className="w-full">
            <div className="overflow-x-auto mb-8 -mx-1 px-1">
              <TabsList className="inline-flex min-w-max gap-1 p-1 h-auto">
                <TabsTrigger value="preview" className="text-xs sm:text-sm whitespace-nowrap px-3 py-1.5" data-testid="tab-preview">Preview</TabsTrigger>
                <TabsTrigger value="score" className="text-xs sm:text-sm whitespace-nowrap px-3 py-1.5" data-testid="tab-score">Score</TabsTrigger>
                <TabsTrigger value="job-match" className="text-xs sm:text-sm whitespace-nowrap px-3 py-1.5" data-testid="tab-job-match">Job Match</TabsTrigger>
                <TabsTrigger value="share" className="text-xs sm:text-sm whitespace-nowrap px-3 py-1.5" data-testid="tab-share">Share</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs sm:text-sm whitespace-nowrap px-3 py-1.5" data-testid="tab-template">Template</TabsTrigger>
                <TabsTrigger value="analyze" className="text-xs sm:text-sm whitespace-nowrap px-3 py-1.5" data-testid="tab-analyze">Analyze</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="preview">
              <ResumePreview />
            </TabsContent>
            <TabsContent value="score">
              <ResumeScorePanel />
            </TabsContent>
            <TabsContent value="job-match">
              <JobMatchPanel />
            </TabsContent>
            <TabsContent value="share">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Share Your Resume</h2>
                <ShareableResumePanel />
              </div>
            </TabsContent>
            <TabsContent value="templates">
              <ResumeTemplates />
            </TabsContent>
            <TabsContent value="analyze">
              <ResumeImprover resumeData={resumeData} />
            </TabsContent>
          </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
