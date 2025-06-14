
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { JobSearch } from '../components/JobSearch';
import { ApiKeyConfig } from '../components/ApiKeyConfig';
import { useResumeContext } from '../context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, Key, Zap, Sparkles, Bot } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JobSearchPage = () => {
  const { resumeData } = useResumeContext();
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasValidApiKey, setHasValidApiKey] = useState(false);

  useEffect(() => {
    // Check if API key exists and is valid
    const apiKey = localStorage.getItem('groq_api_key');
    setHasValidApiKey(!!apiKey);
    
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleApiKeyUpdate = (isValid: boolean) => {
    setHasValidApiKey(isValid);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 particle-bg opacity-30" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        <PageHeader title="AI Job Search">
          <div className="flex items-center gap-2 text-sm text-cyan-100/70">
            <Bot className="h-4 w-4 animate-pulse" />
            <span>Find relevant opportunities with AI-powered matching</span>
          </div>
        </PageHeader>

        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {isInitializing ? (
              <Card className="group relative overflow-hidden animate-slide-up">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-8">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
                      <Loader2 className="relative h-12 w-12 animate-spin text-cyan-400" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold gradient-text">Initializing AI Job Search</h3>
                      <p className="text-cyan-100/70 max-w-md">
                        Setting up AI-powered job matching based on your profile...
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 bg-cyan-400/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
                      </div>
                      <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="animate-slide-up">
                <Tabs defaultValue={hasValidApiKey ? "search" : "setup"} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 glass-panel rounded-2xl p-1.5 border-white/20">
                    <TabsTrigger 
                      value="setup" 
                      className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white/20 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Key className="h-4 w-4" />
                      <span>API Setup</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="search" 
                      disabled={!hasValidApiKey} 
                      className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Search className="h-4 w-4" />
                      <span>Job Search</span>
                      {hasValidApiKey && <Zap className="h-3 w-3 text-cyan-400" />}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="setup" className="space-y-4">
                    <Card className="group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="scan-line" />
                      <CardHeader className="relative">
                        <CardTitle className="flex items-center gap-3">
                          <div className="relative">
                            <Key className="h-6 w-6 text-cyan-400" />
                            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md animate-pulse" />
                          </div>
                          <span>Configure AI Access</span>
                        </CardTitle>
                        <CardDescription>
                          Set up your Groq API key to enable AI-powered job search functionality.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative">
                        <ApiKeyConfig onApiKeyUpdate={handleApiKeyUpdate} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="search" className="space-y-4">
                    <Card className="group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="scan-line" />
                      <CardHeader className="relative">
                        <CardTitle className="flex items-center gap-3">
                          <div className="relative">
                            <Search className="h-6 w-6 text-cyan-400" />
                            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md animate-pulse" />
                          </div>
                          <span className="gradient-text">AI-Powered Job Search</span>
                          <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                        </CardTitle>
                        <CardDescription>
                          Our AI will search for jobs that match your skills, experience, and location preferences.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative">
                        <JobSearch resumeData={resumeData} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
