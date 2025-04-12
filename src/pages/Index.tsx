import React, { useState } from 'react';
import { ResumeProvider } from '@/context/ResumeContext';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import EducationForm from '@/components/EducationForm';
import ResumePreview from '@/components/ResumePreview';
import StepIndicator from '@/components/StepIndicator';
import { useResumeContext } from '@/context/ResumeContext';
import WorkExperienceForm from '@/components/WorkExperienceForm';
import SkillsForm from '@/components/SkillsForm';
import ProjectsForm from '@/components/ProjectsForm';
import ResumeTemplates from '@/components/ResumeTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeChecker from '@/components/ResumeChecker';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Footer from '@/components/Footer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const ResumeBuilder = () => {
  const {
    currentStep
  } = useResumeContext();
  return <div className="min-h-screen bg-gray-50">
      <StepIndicator />
      
      {currentStep === 1 && <PersonalInfoForm />}
      {currentStep === 2 && <EducationForm />}
      {currentStep === 3 && <WorkExperienceForm />}
      {currentStep === 4 && <SkillsForm />}
      {currentStep === 5 && <ProjectsForm />}
      {currentStep === 6 && <>
          <Tabs defaultValue="preview" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="preview">Resume Preview</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="check">Resume Check</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <ResumePreview />
            </TabsContent>
            <TabsContent value="templates">
              <ResumeTemplates />
            </TabsContent>
            <TabsContent value="check">
              <ResumeChecker />
            </TabsContent>
          </Tabs>
        </>}
    </div>;
};

const Index = () => {
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" alt="JR Resume Builder Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-resume-primary to-coral-red text-transparent bg-clip-text">JR Resume Builder</h1>
            </div>
          </div>
          <div className="md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex flex-col space-y-1.5 cursor-pointer">
                  <Separator className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400" />
                  <Separator className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400" />
                  <Separator className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <a href="#features" className="cursor-pointer">Features</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/templates" className="cursor-pointer">Templates</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="#tips" className="cursor-pointer">Resume Tips</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cover-letter-guide" className="cursor-pointer">Cover Letter Guide</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/job-search-tips" className="cursor-pointer">Job Search Tips</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/interview-preparation" className="cursor-pointer">Interview Preparation</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <ResumeProvider>
        <ResumeBuilder />
      </ResumeProvider>
      
      <Footer />
    </div>;
};

export default Index;
