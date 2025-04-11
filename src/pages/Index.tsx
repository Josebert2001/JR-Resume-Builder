import React from 'react';
import { ResumeProvider } from '@/context/ResumeContext';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import EducationForm from '@/components/EducationForm';
import ResumePreview from '@/components/ResumePreview';
import StepIndicator from '@/components/StepIndicator';
import { useResumeContext } from '@/context/ResumeContext';
import JobApplicationTracker from '@/components/JobApplicationTracker';
import WorkExperienceForm from '@/components/WorkExperienceForm';
import SkillsForm from '@/components/SkillsForm';
import ProjectsForm from '@/components/ProjectsForm';
import ResumeTemplates from '@/components/ResumeTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeChecker from '@/components/ResumeChecker';
import { Link } from 'react-router-dom';
const ResumeBuilder = () => {
  const {
    currentStep
  } = useResumeContext();
  return <div className="min-h-screen bg-gray-50 py-10">
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
          <div className="container mx-auto px-4 mt-8">
            <JobApplicationTracker />
          </div>
        </>}
    </div>;
};
const Index = () => {
  return <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" alt="JR Resume Builder Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-resume-primary to-coral-red text-transparent bg-clip-text">JR Resume Builder</h1>
              
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#features" className="text-gray-600 hover:text-resume-primary transition-colors">Features</a>
            <a href="#templates" className="text-gray-600 hover:text-resume-primary transition-colors">Templates</a>
            <a href="#tips" className="text-gray-600 hover:text-resume-primary transition-colors">Resume Tips</a>
          </div>
        </div>
      </header>
      
      <ResumeProvider>
        <ResumeBuilder />
      </ResumeProvider>
      
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" alt="JR Resume Builder Logo" className="h-10 w-auto mb-4" />
              <p className="text-gray-600 text-sm">Building professional resumes that help you stand out to recruiters.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/templates" className="text-gray-600 hover:text-resume-primary">Resume Templates</Link></li>
                <li><Link to="/cover-letter-guide" className="text-gray-600 hover:text-resume-primary">Cover Letter Guide</Link></li>
                <li><Link to="/job-search-tips" className="text-gray-600 hover:text-resume-primary">Job Search Tips</Link></li>
                <li><Link to="/interview-preparation" className="text-gray-600 hover:text-resume-primary">Interview Preparation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-600">Email: support@jrresumebuilder.com</li>
                <li className="text-gray-600">Phone: +123 456 7890</li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-600 hover:text-resume-primary">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-resume-primary">
                    
                  </a>
                  <a href="#" className="text-gray-600 hover:text-resume-primary">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} JR Resume Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;