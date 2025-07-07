
import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { JobSearch } from '../components/JobSearch';
import { useResumeContext } from '../context/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const JobSearchPage = () => {
  const { resumeData } = useResumeContext();
  const hasApiKey = !!import.meta.env.VITE_GROQ_API_KEY;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="AI Job Search">
        <div className="text-sm text-muted-foreground">
          Find relevant job opportunities with AI-powered matching
        </div>
      </PageHeader>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {!hasApiKey && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                AI-powered job search is currently unavailable. Please contact the administrator to configure the API key.
              </AlertDescription>
            </Alert>
          )}
          
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
      </div>
    </div>
  );
};

export default JobSearchPage;
