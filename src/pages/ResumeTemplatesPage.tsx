import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ResumeProvider, useResumeContext } from '@/context/ResumeContext';
import type { TemplateType } from '@/context/ResumeContext';
import { toast } from 'sonner';
import Footer from '@/components/Footer';

const TemplateCard = ({ 
  title, 
  description, 
  template 
}: { 
  title: string; 
  description: string; 
  template: TemplateType 
}) => {
  const { setTemplate } = useResumeContext();
  
  const handleSelect = () => {
    setTemplate(template);
    toast.success(`${title} template selected! Head to the resume builder to use it.`);
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 group focus-within:ring-2 focus-within:ring-resume-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl text-resume-dark">{title}</CardTitle>
        <CardDescription className="text-sm text-resume-muted">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow h-64 sm:h-72 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
        <TemplatePreview template={template} />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button 
          className="w-full bg-resume-primary hover:bg-resume-secondary transition-colors duration-200 focus:ring-2 focus:ring-resume-accent focus:ring-offset-2"
          onClick={handleSelect}
          aria-label={`Select ${title} template`}
        >
          Select Template
        </Button>
        <Link 
          to="/" 
          className="w-full"
          aria-label={`Use ${title} template to create resume`}
        >
          <Button className="w-full border-2 border-resume-primary text-resume-primary hover:bg-resume-light focus:ring-2 focus:ring-resume-accent focus:ring-offset-2 transition-colors duration-200">
            Use This Template
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const TemplatesContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 border-b border-gray-200" role="banner">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 sm:space-x-4 focus:outline-none focus:ring-2 focus:ring-resume-primary rounded-lg"
            aria-label="Home"
          >
            <img 
              src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" 
              alt="JR Resume Builder Logo" 
              className="h-8 md:h-12 w-auto"
            />
            <div>
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-resume-primary to-coral-red text-transparent bg-clip-text font-heading">
                JR Resume Builder
              </h1>
              <p className="text-resume-muted text-xs md:text-sm">Create professional resumes with ease</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-4" role="navigation">
            <Link 
              to="/" 
              className="text-resume-muted hover:text-resume-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-resume-primary rounded px-2 py-1"
            >
              Home
            </Link>
            <Link 
              to="/templates" 
              className="text-resume-primary font-medium focus:outline-none focus:ring-2 focus:ring-resume-primary rounded px-2 py-1"
              aria-current="page"
            >
              Templates
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-12" role="main">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-resume-primary mb-4 md:mb-6 font-heading">Resume Templates</h2>
          <p className="text-resume-muted mb-6 md:mb-10 text-sm md:text-base">Choose from our professionally designed resume templates to get started with your job application.</p>
          
          <div className="mb-8 md:mb-10">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-resume-secondary">Most Popular Resume Formats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <TemplateCard 
                title="Chronological" 
                description="Emphasizes your career path and work history" 
                template="chronological" 
              />
              
              <TemplateCard 
                title="Functional" 
                description="Highlights your skills and abilities" 
                template="functional" 
              />
              
              <TemplateCard 
                title="Combination" 
                description="Blends chronological and functional approaches" 
                template="combination" 
              />
            </div>
          </div>
          
          <div className="mb-8 md:mb-10">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-resume-secondary">Specialized Resume Formats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <TemplateCard 
                title="Targeted" 
                description="Customized for a specific job or company" 
                template="targeted" 
              />
              
              <TemplateCard 
                title="Infographic" 
                description="Visual representation of your qualifications" 
                template="infographic" 
              />
              
              <TemplateCard 
                title="Profile" 
                description="Highlights your professional persona" 
                template="profile" 
              />
            </div>
          </div>
          
          <div className="mb-8 md:mb-10">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-resume-secondary">Traditional Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <TemplateCard 
                title="Professional" 
                description="Clean and traditional design" 
                template="professional" 
              />
              
              <TemplateCard 
                title="Modern" 
                description="Contemporary layout with creative touches" 
                template="modern" 
              />
              
              <TemplateCard 
                title="Minimal" 
                description="Simple and elegant design" 
                template="minimal" 
              />
            </div>
          </div>
          
          <div className="mb-8 md:mb-10">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-resume-secondary">Special Formats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
              <TemplateCard
                title="Mini Resume"
                description="Compact format for networking events"
                template="mini"
              />
              
              <Card className="h-full flex flex-col bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg md:text-xl">Video Resume</CardTitle>
                  <CardDescription className="text-sm">Coming soon - Dynamic video presentation of your skills</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow h-64 sm:h-72 flex items-center justify-center">
                  <p className="text-gray-500 text-center italic">Premium feature coming soon</p>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="w-full bg-gray-300 hover:bg-gray-400 cursor-not-allowed">
                    Coming Soon
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ResumeTemplatesPage = () => {
  return (
    <ResumeProvider>
      <TemplatesContent />
    </ResumeProvider>
  );
};

export default ResumeTemplatesPage;
