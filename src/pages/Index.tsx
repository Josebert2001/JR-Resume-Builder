import React from 'react';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import EducationForm from '@/components/EducationForm';
import ResumePreview from '@/components/ResumePreview';
import StepIndicator from '@/components/StepIndicator';
import { useResumeContext } from '@/context/ResumeContext';
import WorkExperienceForm from '@/components/WorkExperienceForm';
import SkillsForm from '@/components/SkillsForm';
import ResumeTemplates from '@/components/ResumeTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeChecker from '@/components/ResumeChecker';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const ResumeBuilder = () => {
  const { currentStep } = useResumeContext();
  
  console.log("Current step:", currentStep);

  return (
    <div className="min-h-screen bg-gray-50" style={{ border: '2px solid red' }}>
      <h1 className="text-4xl font-bold text-center py-8">Resume Builder</h1>
      <StepIndicator />
      
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
      
      {/* Step 6: Projects and Final Preview */}
      {currentStep === 6 && (
        <Tabs defaultValue="preview" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="preview">Resume Preview</TabsTrigger>
            <TabsTrigger value="templates">Change Template</TabsTrigger>
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
      )}
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Resources <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
      
      <ResumeBuilder />
      
      <Footer />
    </div>
  );
};

export default Index;
