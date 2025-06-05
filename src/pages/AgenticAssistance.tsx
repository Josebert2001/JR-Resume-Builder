
import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { AgenticDashboard } from '../components/AgenticDashboard';

const AgenticAssistance = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Agentic Career Assistant">
        <div className="text-sm text-muted-foreground">
          AI agents working autonomously on your career advancement
        </div>
      </PageHeader>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-lg text-muted-foreground">
              Let AI agents autonomously optimize your resume, find job opportunities, and plan your career growth
            </p>
          </div>
          
          <AgenticDashboard />
        </div>
      </div>
    </div>
  );
};

export default AgenticAssistance;
