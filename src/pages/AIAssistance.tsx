
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Settings, AlertCircle } from 'lucide-react';
import { ResumeAssistant } from '../components/ResumeAssistant';
import { SkillsAssistant } from '../components/SkillsAssistant';
import { CareerAssistant } from '../components/CareerAssistant';
import { AdvancedResumeAnalysis } from '../components/AdvancedResumeAnalysis';
import { ApiKeyConfig } from '../components/ApiKeyConfig';
import { SystemStatus } from '../components/SystemStatus';
import { Alert, AlertDescription } from '../components/ui/alert';

const AIAssistance = () => {
  const [isApiKeyConfigOpen, setIsApiKeyConfigOpen] = useState(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean | null>(null);

  const handleApiKeyUpdate = (isValid: boolean) => {
    setIsApiKeyValid(isValid);
    if (isValid) {
      setIsApiKeyConfigOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-3xl font-bold">AI Career Assistant</h1>
            <Dialog open={isApiKeyConfigOpen} onOpenChange={setIsApiKeyConfigOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>AI Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <ApiKeyConfig onApiKeyUpdate={handleApiKeyUpdate} />
                  <SystemStatus onOpenSettings={() => {}} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {isApiKeyValid === false && (
            <Alert className="mb-6 max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                AI features require a valid Groq API key. Click the Settings button above to configure your API key.
                Get a free API key from{' '}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Groq Console
                </a>.
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
  );
};

export default AIAssistance;
