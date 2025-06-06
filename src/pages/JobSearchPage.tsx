
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { JobSearch } from '../components/JobSearch';
import { ApiKeyConfig } from '../components/ApiKeyConfig';
import { useResumeContext } from '../context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, Key } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <PageHeader title="AI Job Search">
        <div className="text-sm text-muted-foreground">
          Find relevant job opportunities with AI-powered matching
        </div>
      </PageHeader>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {isInitializing ? (
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-resume-primary" />
                <h3 className="text-lg font-medium">Initializing Job Search</h3>
                <p className="text-muted-foreground text-center">
                  Setting up AI-powered job matching based on your profile...
                </p>
              </div>
            </Card>
          ) : (
            <Tabs defaultValue={hasValidApiKey ? "search" : "setup"} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="setup" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Setup
                </TabsTrigger>
                <TabsTrigger value="search" disabled={!hasValidApiKey} className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Job Search
                </TabsTrigger>
              </TabsList>

              <TabsContent value="setup">
                <Card>
                  <CardHeader>
                    <CardTitle>Configure AI Access</CardTitle>
                    <CardDescription>
                      Set up your Groq API key to enable AI-powered job search functionality.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ApiKeyConfig onApiKeyUpdate={handleApiKeyUpdate} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="search">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      AI-Powered Job Search
                    </CardTitle>
                    <CardDescription>
                      Our AI will search for jobs that match your skills, experience, and location preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <JobSearch resumeData={resumeData} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
