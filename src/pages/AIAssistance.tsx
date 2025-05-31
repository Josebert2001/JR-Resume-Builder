
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ResumeAssistant } from '../components/ResumeAssistant';
import { SkillsAssistant } from '../components/SkillsAssistant';
import { CareerAssistant } from '../components/CareerAssistant';
import { AdvancedResumeAnalysis } from '../components/AdvancedResumeAnalysis';

const AIAssistance = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">AI Career Assistant</h1>
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
  );
};

export default AIAssistance;
