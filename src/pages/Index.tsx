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
import { ProjectsForm } from '@/components/ProjectsForm';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { JobSearch } from "@/components/JobSearch";
import { JobApplicationTracker } from "@/components/JobApplicationTracker";
import { FileText, 
  Search, 
  Calendar,
  CheckSquare,
  Palette,
  ArrowRight,
  ArrowLeft,
  Bot,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Main content that uses useResumeContext
const ResumeBuilder = () => {
  const { currentStep, resumeData } = useResumeContext();
  
  // Total number of steps in the resume building process
  const totalSteps = 7;
  
  console.log("Current step:", currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-center py-8">Resume Builder</h1>
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
            <ResumeChecker resumeData={resumeData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resume');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
      
      {/* ResumeBuilder is already inside ResumeProvider from main.tsx */}
      <ResumeBuilder />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Build Your Perfect Resume
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create a professional resume in minutes with our AI-powered builder
          </p>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setActiveTab('resume')}
            >
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                <CardTitle>Resume Builder</CardTitle>
                <CardDescription>Create and customize your resume</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => navigate('/ai-assistance')}
            >
              <CardHeader className="text-center">
                <Bot className="h-12 w-12 mx-auto text-purple-600 mb-2" />
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Get personalized career guidance</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setActiveTab('job-search')}
            >
              <CardHeader className="text-center">
                <Search className="h-12 w-12 mx-auto text-green-600 mb-2" />
                <CardTitle>Job Search</CardTitle>
                <CardDescription>Find relevant job opportunities</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setActiveTab('templates')}
            >
              <CardHeader className="text-center">
                <Palette className="h-12 w-12 mx-auto text-orange-600 mb-2" />
                <CardTitle>Templates</CardTitle>
                <CardDescription>Choose from professional designs</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/ai-assistance')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <MessageSquare className="h-4 w-4" />
              Chat with AI Assistant
            </Button>
            <Button 
              onClick={() => navigate('/templates')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Palette className="h-4 w-4" />
              Browse Templates
            </Button>
            <Button 
              onClick={() => navigate('/interview-prep')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <TrendingUp className="h-4 w-4" />
              Interview Prep
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
