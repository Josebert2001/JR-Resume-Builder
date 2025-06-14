
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
import { ResumeChecker } from '@/components/ResumeChecker';
import { ProjectsForm } from '@/components/ProjectsForm';
import { PageHeader } from '@/components/PageHeader';
import { FileText, Layers, Sparkles, Zap } from 'lucide-react';

const ResumeBuilder = () => {
  const { currentStep, resumeData } = useResumeContext();
  
  // Total number of steps in the resume building process
  const totalSteps = 7;
  
  console.log("Current step:", currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 particle-bg opacity-20" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        <PageHeader title="Resume Builder">
          <div className="flex items-center gap-2 text-sm text-cyan-100/70">
            <FileText className="h-4 w-4 animate-pulse" />
            <span>Build your professional resume with AI assistance</span>
          </div>
        </PageHeader>
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto animate-slide-up">
            <div className="glass-panel rounded-2xl p-6 mb-8 border-white/20">
              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </div>
            
            {/* Step 1: Template Selection */}
            {currentStep === 1 && (
              <div className="glass-panel rounded-2xl p-8 border-white/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="scan-line" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <Layers className="h-6 w-6 text-cyan-400" />
                    <h2 className="text-2xl font-bold gradient-text">Choose Your Template</h2>
                    <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                  </div>
                  <ResumeTemplates />
                </div>
              </div>
            )}
            
            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="glass-panel rounded-2xl p-8 border-white/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="scan-line" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md animate-pulse" />
                      <FileText className="relative h-6 w-6 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold gradient-text">Personal Information</h2>
                  </div>
                  <PersonalInfoForm />
                </div>
              </div>
            )}
            
            {/* Step 3: Education */}
            {currentStep === 3 && (
              <div className="glass-panel rounded-2xl p-8 border-white/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="scan-line" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="h-6 w-6 text-purple-400" />
                    <h2 className="text-2xl font-bold gradient-text">Education</h2>
                  </div>
                  <EducationForm />
                </div>
              </div>
            )}
            
            {/* Step 4: Work Experience */}
            {currentStep === 4 && (
              <div className="glass-panel rounded-2xl p-8 border-white/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="scan-line" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-md animate-pulse" />
                      <FileText className="relative h-6 w-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold gradient-text">Work Experience</h2>
                  </div>
                  <WorkExperienceForm />
                </div>
              </div>
            )}
            
            {/* Step 5: Skills */}
            {currentStep === 5 && (
              <div className="glass-panel rounded-2xl p-8 border-white/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="scan-line" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
                    <h2 className="text-2xl font-bold gradient-text">Skills</h2>
                  </div>
                  <SkillsForm />
                </div>
              </div>
            )}

            {/* Step 6: Projects */}
            {currentStep === 6 && (
              <div className="glass-panel rounded-2xl p-8 border-white/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="scan-line" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <Layers className="h-6 w-6 text-purple-400" />
                    <h2 className="text-2xl font-bold gradient-text">Projects</h2>
                  </div>
                  <ProjectsForm />
                </div>
              </div>
            )}
            
            {/* Step 7: Final Preview */}
            {currentStep === 7 && (
              <div className="glass-panel rounded-2xl p-8 border-white/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="scan-line" />
                <div className="relative">
                  <Tabs defaultValue="preview" className="max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-3 mb-8 glass-panel rounded-2xl p-1.5 border-white/20">
                      <TabsTrigger 
                        value="preview"
                        className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white transition-all duration-300"
                      >
                        Resume Preview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="templates"
                        className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white transition-all duration-300"
                      >
                        Change Template
                      </TabsTrigger>
                      <TabsTrigger 
                        value="check"
                        className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white transition-all duration-300"
                      >
                        Resume Check
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview">
                      <ResumePreview />
                    </TabsContent>
                    <TabsContent value="templates">
                      <ResumeTemplates />
                    </TabsContent>
                    <TabsContent value="check">
                      <ResumeChecker resumeData={resumeData} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
