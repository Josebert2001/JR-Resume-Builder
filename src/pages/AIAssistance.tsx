
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Settings, AlertCircle, Bot, Brain, Zap, Sparkles } from 'lucide-react';
import { ResumeAssistant } from '../components/ResumeAssistant';
import { SkillsAssistant } from '../components/SkillsAssistant';
import { CareerAssistant } from '../components/CareerAssistant';
import { AdvancedResumeAnalysis } from '../components/AdvancedResumeAnalysis';
import { ApiKeyConfig } from '../components/ApiKeyConfig';
import { SystemStatus } from '../components/SystemStatus';
import { Alert, AlertDescription } from '../components/ui/alert';
import { PageHeader } from '../components/PageHeader';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* More subtle animated background particles */}
      <div className="absolute inset-0 particle-bg opacity-8" />
      
      {/* Reduced floating orbs opacity */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/3 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        <PageHeader title="AI Career Assistant">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-cyan-100/70">
              <Brain className="h-4 w-4 animate-pulse" />
              <span>Intelligent career guidance powered by AI</span>
            </div>
            <Dialog open={isApiKeyConfigOpen} onOpenChange={setIsApiKeyConfigOpen}>
              <DialogTrigger asChild>
                <Button variant="cyber" size="sm" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass-panel border-white/20">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 gradient-text">
                    <Settings className="h-5 w-5" />
                    AI Configuration
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <ApiKeyConfig onApiKeyUpdate={handleApiKeyUpdate} />
                  <SystemStatus onOpenSettings={() => {}} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </PageHeader>

        <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto animate-slide-up">
            <div className="text-center mb-8">
              {isApiKeyValid === false && (
                <Alert className="mb-6 max-w-2xl mx-auto glass-panel border-red-500/20 bg-red-500/10 backdrop-blur-xl">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-100">
                    AI features require a valid Groq API key. Click the Settings button above to configure your API key.
                    Get a free API key from{' '}
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline font-medium"
                    >
                      Groq Console
                    </a>.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="glass-panel rounded-2xl p-8 border-white/20 mb-8 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="scan-line" />
                <div className="relative text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="relative">
                      <Bot className="h-12 w-12 text-cyan-400" />
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
                    </div>
                    <Zap className="h-8 w-8 text-purple-400 animate-pulse" />
                    <Brain className="h-10 w-10 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text mb-2">AI-Powered Career Enhancement</h2>
                  <p className="text-lg text-cyan-100/70">
                    Get personalized help with your resume, skills development, and career planning
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 border-white/20 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="scan-line" />
              <div className="relative">
                <Tabs defaultValue="resume" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 glass-panel rounded-2xl p-1.5 border-white/20 mb-6">
                    <TabsTrigger 
                      value="resume"
                      className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Bot className="h-4 w-4" />
                      Resume Help
                    </TabsTrigger>
                    <TabsTrigger 
                      value="skills"
                      className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Zap className="h-4 w-4" />
                      Skills Development
                    </TabsTrigger>
                    <TabsTrigger 
                      value="career"
                      className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Brain className="h-4 w-4" />
                      Career Guidance
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analysis"
                      className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Sparkles className="h-4 w-4" />
                      Advanced Analysis
                    </TabsTrigger>
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
        </div>
      </div>
    </div>
  );
};

export default AIAssistance;
