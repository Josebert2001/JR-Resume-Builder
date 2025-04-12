
import React from 'react';
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-w-3 aspect-h-4 bg-gray-100 border rounded">
          <div className="p-4 flex flex-col">
            {template === 'professional' && (
              <>
                <div className="h-6 bg-resume-primary mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-300 mb-4"></div>
                <div className="h-3 w-1/2 bg-gray-300 mb-6"></div>
                <div className="h-4 w-1/3 bg-resume-secondary mb-2"></div>
                <div className="flex-1 flex flex-col space-y-2">
                  <div className="h-2 bg-gray-200"></div>
                  <div className="h-2 bg-gray-200"></div>
                  <div className="h-2 w-3/4 bg-gray-200"></div>
                </div>
              </>
            )}
            
            {template === 'modern' && (
              <>
                <div className="flex space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-resume-secondary"></div>
                  <div className="flex-1">
                    <div className="h-4 w-2/3 bg-gray-300 mb-2"></div>
                    <div className="h-3 w-1/2 bg-gray-300"></div>
                  </div>
                </div>
                <div className="flex space-x-3 mb-4">
                  <div className="w-1/3">
                    <div className="h-4 bg-resume-primary mb-2"></div>
                    <div className="h-2 bg-gray-200 mb-1"></div>
                    <div className="h-2 bg-gray-200 mb-1"></div>
                    <div className="h-2 bg-gray-200"></div>
                  </div>
                  <div className="w-2/3">
                    <div className="h-4 bg-resume-primary mb-2"></div>
                    <div className="h-2 bg-gray-200 mb-1"></div>
                    <div className="h-2 bg-gray-200 mb-1"></div>
                    <div className="h-2 bg-gray-200"></div>
                  </div>
                </div>
              </>
            )}
            
            {template === 'minimal' && (
              <>
                <div className="h-5 w-1/2 bg-gray-300 mb-6"></div>
                <div className="h-3 w-1/3 bg-gray-200 mb-1"></div>
                <div className="h-3 w-2/3 bg-gray-200 mb-4"></div>
                
                <div className="h-4 w-1/4 bg-gray-300 mb-2"></div>
                <div className="h-2 bg-gray-200 mb-1"></div>
                <div className="h-2 bg-gray-200 mb-1"></div>
                <div className="h-2 w-2/3 bg-gray-200 mb-4"></div>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button 
          className="w-full bg-resume-primary hover:bg-resume-secondary"
          onClick={handleSelect}
        >
          Select Template
        </Button>
        <Link to="/" className="w-full">
          <Button className="w-full variant-outline">
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
      <header className="bg-white shadow-sm py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" 
              alt="JR Resume Builder Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-resume-primary to-coral-red text-transparent bg-clip-text">JR Resume Builder</h1>
              <p className="text-gray-600 text-sm">Create professional resumes with ease</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-resume-primary transition-colors">Home</Link>
            <Link to="/templates" className="text-resume-primary font-medium">Templates</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-resume-primary mb-6">Resume Templates</h2>
          <p className="text-gray-600 mb-10">Choose from our professionally designed resume templates to get started with your job application.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
