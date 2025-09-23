import React from 'react';
import { NavHeader } from '@/components/NavHeader';
import { PageHeader } from '@/components/PageHeader';
import { ResumeUpload } from '@/components/ResumeUpload';

const ResumeUploadPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />
      <PageHeader title="Upload & Improve Resume" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-xl text-gray-600 text-center">
            Upload your existing resume and get AI-powered suggestions for improvement
          </p>
        </div>
        <ResumeUpload />
      </div>
    </div>
  );
};

export default ResumeUploadPage;