
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { ResumeAssistant } from '../components/ResumeAssistant';
import { SkillsAssistant } from '../components/SkillsAssistant';
import { CareerAssistant } from '../components/CareerAssistant';
import { AdvancedResumeAnalysis } from '../components/AdvancedResumeAnalysis';
import { SystemStatus } from '../components/SystemStatus';
import { Alert, AlertDescription } from '../components/ui/alert';
import { PageHeader } from '../components/PageHeader';

const AIAssistance = () => {
  const hasApiKey = !!import.meta.env.VITE_GROQ_API_KEY;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="AI Career Assistant" />

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            {!hasApiKey && (
              <Alert className="mb-6 max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  AI features are currently unavailable. Please contact the administrator to configure the API key.
                </AlertDescription>
              </Alert>
            )}
            
            <p className="text-lg text-muted-foreground">
              Get personalized help with your resume, skills development, and career planning
            </p>
          </div>
          
          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="resume">Resume Help</TabsTrigger>
              <TabsTrigger value="skills">Skills Development</TabsTrigger>
              <TabsTrigger value="career">Career Guidance</TabsTrigger>
              <TabsTrigger value="analysis">Advanced Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume" className="mt-6">
              <div className="max-w-4xl mx-auto">
                <ResumeAssistant />
              </div>
            </TabsContent>
            
            <TabsContent value="skills" className="mt-6">
              <div className="max-w-4xl mx-auto">
                <SkillsAssistant />
              </div>
            </TabsContent>
            
            <TabsContent value="career" className="mt-6">
              <div className="max-w-4xl mx-auto">
                <CareerAssistant />
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-6">
              <AdvancedResumeAnalysis />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIAssistance;
