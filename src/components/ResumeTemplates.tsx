
import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import type { TemplateType } from '@/context/ResumeContext';
import { Mail, Phone, MapPin, Briefcase, Calendar, GraduationCap } from 'lucide-react';

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
      <div className="border rounded bg-white p-3 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <div className="border-b-2 border-resume-primary pb-2 mb-2">
          <h1 className="text-base font-bold text-resume-primary">{sampleData.name}</h1>
          <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Mail size={8} />
              <span>{sampleData.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={8} />
              <span>{sampleData.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={8} />
              <span>{sampleData.location}</span>
            </div>
          </div>
        </div>

        <div className="mb-1">
          <h2 className="text-xs font-semibold text-resume-secondary mb-1">EXPERIENCE</h2>
          <div className="ml-1">
            <p className="text-xs font-medium">{sampleData.position}</p>
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <Briefcase size={8} />
              <span>{sampleData.company}</span>
            </div>
          </div>
        </div>

        <div className="mb-1">
          <h2 className="text-xs font-semibold text-resume-secondary mb-1">EDUCATION</h2>
          <div className="ml-1">
            <p className="text-xs font-medium">{sampleData.course}</p>
            <p className="text-xs text-gray-700">{sampleData.school}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-resume-secondary mb-1">SKILLS</h2>
          <div className="flex flex-wrap gap-1">
            {sampleData.skills.slice(0, 3).map((skill, index) => (
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
      <div className="border rounded bg-white p-3 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <div className="flex gap-2 mb-2">
          <div className="w-10 h-10 bg-resume-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
            {sampleData.name.split(' ').map(part => part[0]).join('')}
          </div>
          <div>
            <h1 className="text-sm font-bold">{sampleData.name}</h1>
            <p className="text-xs text-resume-primary font-medium">{sampleData.position}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
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
        </div>
      </div>
    );
  }

  if (template === 'minimal') {
    return (
      <div className="border rounded bg-white p-3 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-base font-bold mb-1">{sampleData.name}</h1>
        <p className="text-xs text-gray-700 mb-1">{sampleData.position}</p>
        
        <div className="flex flex-wrap gap-1 text-xs text-gray-600 mb-2">
          <span>{sampleData.email}</span>
          <span>•</span>
          <span>{sampleData.phone}</span>
        </div>
        
        <h2 className="text-xs font-semibold uppercase mb-1">Experience</h2>
        <div className="mb-1 ml-1">
          <p className="text-xs font-medium">{sampleData.company}</p>
          <p className="text-xs">{sampleData.position}</p>
        </div>
        
        <h2 className="text-xs font-semibold uppercase mb-1">Education</h2>
        <div className="mb-1 ml-1">
          <p className="text-xs">{sampleData.course}, {sampleData.school}</p>
        </div>
      </div>
    );
  }

  return null;
};

const ResumeTemplates = () => {
  const { resumeData, setTemplate } = useResumeContext();
  
  // Get the currently selected template from resumeData
  const selectedTemplate = resumeData.template || 'professional';
  
  const handleSelectTemplate = (template: TemplateType) => {
    setTemplate(template);
    toast.success(`${template.charAt(0).toUpperCase() + template.slice(1)} template selected!`);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-resume-primary mb-2">Resume Templates</h2>
      <p className="text-gray-600 mb-6">Choose a template that best represents your professional style</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Professional Template */}
        <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'professional' ? 'ring-2 ring-resume-primary' : ''}`}>
          <div className="aspect-w-3 aspect-h-4 bg-white relative">
            <div className="absolute inset-0">
              <TemplatePreview template="professional" />
            </div>
            
            {selectedTemplate === 'professional' && (
              <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900">Professional</h3>
            <p className="text-sm text-gray-500">Clean and traditional design, ideal for most industries</p>
            <Button 
              onClick={() => handleSelectTemplate('professional')}
              variant={selectedTemplate === 'professional' ? 'default' : 'outline'}
              className={`w-full mt-3 ${selectedTemplate === 'professional' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
            >
              {selectedTemplate === 'professional' ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
        
        {/* Modern Template */}
        <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'modern' ? 'ring-2 ring-resume-primary' : ''}`}>
          <div className="aspect-w-3 aspect-h-4 bg-white relative">
            <div className="absolute inset-0">
              <TemplatePreview template="modern" />
            </div>
            
            {selectedTemplate === 'modern' && (
              <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900">Modern</h3>
            <p className="text-sm text-gray-500">Contemporary layout with creative touches</p>
            <Button 
              onClick={() => handleSelectTemplate('modern')}
              variant={selectedTemplate === 'modern' ? 'default' : 'outline'}
              className={`w-full mt-3 ${selectedTemplate === 'modern' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
            >
              {selectedTemplate === 'modern' ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
        
        {/* Minimal Template */}
        <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'minimal' ? 'ring-2 ring-resume-primary' : ''}`}>
          <div className="aspect-w-3 aspect-h-4 bg-white relative">
            <div className="absolute inset-0">
              <TemplatePreview template="minimal" />
            </div>
            
            {selectedTemplate === 'minimal' && (
              <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900">Minimal</h3>
            <p className="text-sm text-gray-500">Simple and elegant design with plenty of white space</p>
            <Button 
              onClick={() => handleSelectTemplate('minimal')}
              variant={selectedTemplate === 'minimal' ? 'default' : 'outline'}
              className={`w-full mt-3 ${selectedTemplate === 'minimal' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
            >
              {selectedTemplate === 'minimal' ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-50 p-4 rounded border">
        <h3 className="font-medium text-gray-900 mb-2">Premium Templates</h3>
        <p className="text-gray-600 mb-4">Unlock our premium templates for more professional options</p>
        <Button className="bg-resume-primary hover:bg-resume-secondary">
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
};

export default ResumeTemplates;
