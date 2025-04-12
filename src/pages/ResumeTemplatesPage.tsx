
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ResumeProvider, useResumeContext } from '@/context/ResumeContext';
import type { TemplateType } from '@/context/ResumeContext';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import { Download, Mail, Phone, MapPin, Briefcase, Calendar, Code, GraduationCap } from 'lucide-react';

const TemplatePreview = ({ template }: { template: TemplateType }) => {
  // Sample data for the templates
  const sampleData = {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    location: "New York, NY",
    position: "Software Engineer",
    company: "Tech Solutions Inc.",
    school: "University of Technology",
    course: "Computer Science",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "HTML/CSS"],
  };

  if (template === 'professional') {
    return (
      <div className="border rounded bg-white p-4 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <div className="border-b-2 border-resume-primary pb-3 mb-3">
          <h1 className="text-lg font-bold text-resume-primary">{sampleData.name}</h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Mail size={10} />
              <span>{sampleData.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={10} />
              <span>{sampleData.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={10} />
              <span>{sampleData.location}</span>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <h2 className="text-xs font-semibold text-resume-secondary mb-1">EXPERIENCE</h2>
          <div className="ml-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">{sampleData.position}</p>
              <p className="text-xs text-gray-600">2020 - Present</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <Briefcase size={8} />
              <span>{sampleData.company}</span>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <h2 className="text-xs font-semibold text-resume-secondary mb-1">EDUCATION</h2>
          <div className="ml-2">
            <p className="text-xs font-medium">{sampleData.course}</p>
            <p className="text-xs text-gray-700">{sampleData.school}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-resume-secondary mb-1">SKILLS</h2>
          <div className="flex flex-wrap gap-1">
            {sampleData.skills.map((skill, index) => (
              <span key={index} className="text-xs bg-gray-100 px-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template === 'modern') {
    return (
      <div className="border rounded bg-white p-4 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <div className="flex gap-3 mb-3">
          <div className="w-16 h-16 bg-resume-secondary rounded-full flex items-center justify-center text-white text-lg font-bold">
            {sampleData.name.split(' ').map(part => part[0]).join('')}
          </div>
          <div>
            <h1 className="text-lg font-bold">{sampleData.name}</h1>
            <p className="text-xs text-resume-primary font-medium">{sampleData.position}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <div className="flex items-center gap-1 text-xs">
                <Mail size={10} />
                <span>{sampleData.email}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Phone size={10} />
                <span>{sampleData.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h2 className="text-xs font-semibold text-resume-primary mb-1 border-b border-resume-primary pb-1">
              EXPERIENCE
            </h2>
            <div className="ml-1">
              <p className="text-xs font-medium">{sampleData.position}</p>
              <div className="flex items-center gap-1 text-xs text-gray-700">
                <Briefcase size={8} />
                <span>{sampleData.company}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar size={8} />
                <span>2020 - Present</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-resume-primary mb-1 border-b border-resume-primary pb-1">
              EDUCATION
            </h2>
            <div className="ml-1">
              <p className="text-xs font-medium">{sampleData.course}</p>
              <div className="flex items-center gap-1 text-xs text-gray-700">
                <GraduationCap size={8} />
                <span>{sampleData.school}</span>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <h2 className="text-xs font-semibold text-resume-primary mb-1 border-b border-resume-primary pb-1">
              SKILLS
            </h2>
            <div className="flex flex-wrap gap-1">
              {sampleData.skills.map((skill, index) => (
                <span key={index} className="text-xs bg-gray-100 px-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === 'minimal') {
    return (
      <div className="border rounded bg-white p-4 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-lg font-bold mb-1">{sampleData.name}</h1>
        <p className="text-xs text-gray-700 mb-2">{sampleData.position} | {sampleData.location}</p>
        
        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
          <span>{sampleData.email}</span>
          <span>•</span>
          <span>{sampleData.phone}</span>
        </div>
        
        <h2 className="text-xs font-semibold uppercase mb-1">Experience</h2>
        <div className="mb-2 ml-1">
          <p className="text-xs font-medium">{sampleData.company}</p>
          <p className="text-xs">{sampleData.position}</p>
          <p className="text-xs text-gray-600">2020 - Present</p>
        </div>
        
        <h2 className="text-xs font-semibold uppercase mb-1">Education</h2>
        <div className="mb-2 ml-1">
          <p className="text-xs font-medium">{sampleData.school}</p>
          <p className="text-xs">{sampleData.course}</p>
        </div>
        
        <h2 className="text-xs font-semibold uppercase mb-1">Skills</h2>
        <p className="text-xs ml-1">{sampleData.skills.join(', ')}</p>
      </div>
    );
  }

  return null;
};

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
      <CardContent className="h-80 overflow-hidden">
        <TemplatePreview template={template} />
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
