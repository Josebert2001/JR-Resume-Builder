import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NavHeader } from '@/components/NavHeader';
import { PageHeader } from '@/components/PageHeader';
import { ResumeUpload } from '@/components/ResumeUpload';

const ResumeUploadPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <PageHeader title="Upload & Improve Resume" />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto mb-8 border-0 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-lg text-muted-foreground text-center">
              Upload your existing resume and get AI-powered suggestions for improvement
            </p>
          </CardContent>
        </Card>
        <ResumeUpload />
      </div>
    </div>
  );
};

export default ResumeUploadPage;