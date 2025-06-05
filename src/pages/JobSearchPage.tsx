
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { JobSearch } from '../components/JobSearch';
import { useResumeContext } from '../context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from 'lucide-react';

const JobSearchPage = () => {
  const { resumeData } = useResumeContext();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulate initialization
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Job Search">
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
            <div className="space-y-6">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
