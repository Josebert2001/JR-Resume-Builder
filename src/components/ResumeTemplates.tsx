import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import type { TemplateType } from '@/context/ResumeContext';
import { Mail, Phone, MapPin, Briefcase, Calendar, GraduationCap, Award, FileCode, Code, FilePieChart } from 'lucide-react';

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

  if (template === 'chronological') {
    return (
      <div className="border rounded bg-white p-3 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-base font-bold text-center mb-1">{sampleData.name}</h1>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600 mb-2 border-b pb-2">
          <span>{sampleData.email}</span>
          <span>{sampleData.phone}</span>
          <span>{sampleData.location}</span>
        </div>
        
        <h2 className="text-xs font-semibold mb-1 bg-gray-100 px-1 py-0.5">WORK EXPERIENCE</h2>
        <div className="mb-2 ml-1">
          <div className="flex justify-between">
            <p className="text-xs font-medium">{sampleData.company}</p>
            <p className="text-xs">2020-Present</p>
          </div>
          <p className="text-xs italic">{sampleData.position}</p>
          <p className="text-xs">• Led development of customer-facing applications</p>
        </div>
        
        <div className="mb-2 ml-1">
          <div className="flex justify-between">
            <p className="text-xs font-medium">Previous Company</p>
            <p className="text-xs">2018-2020</p>
          </div>
          <p className="text-xs italic">Junior Developer</p>
          <p className="text-xs">• Maintained web applications</p>
        </div>
        
        <h2 className="text-xs font-semibold mb-1 bg-gray-100 px-1 py-0.5">EDUCATION</h2>
        <div className="mb-1 ml-1">
          <div className="flex justify-between">
            <p className="text-xs font-medium">{sampleData.school}</p>
            <p className="text-xs">2014-2018</p>
          </div>
          <p className="text-xs">{sampleData.course}</p>
        </div>
      </div>
    );
  }

  if (template === 'functional') {
    return (
      <div className="border rounded bg-white p-3 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-base font-bold mb-1">{sampleData.name}</h1>
        <p className="text-xs text-gray-700 mb-1 border-b pb-1">{sampleData.position} | {sampleData.email} | {sampleData.phone}</p>
        
        <h2 className="text-xs font-semibold mb-1 uppercase">Summary</h2>
        <p className="text-xs mb-2">Skilled software engineer with expertise in building modern web applications.</p>
        
        <h2 className="text-xs font-semibold mb-1 uppercase">Core Skills</h2>
        <div className="mb-2">
          <div className="mb-1">
            <p className="text-xs font-medium">Frontend Development</p>
            <p className="text-xs">• React, JavaScript, TypeScript, HTML/CSS</p>
          </div>
          <div className="mb-1">
            <p className="text-xs font-medium">Backend Development</p>
            <p className="text-xs">• Node.js, Express, API development</p>
          </div>
        </div>
        
        <h2 className="text-xs font-semibold mb-1 uppercase">Work History</h2>
        <div className="ml-1 flex flex-col gap-1 text-xs">
          <div>{sampleData.position}, {sampleData.company}</div>
          <div>Junior Developer, Previous Company</div>
        </div>
      </div>
    );
  }

  if (template === 'combination') {
    return (
      <div className="border rounded bg-white p-3 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-base font-bold mb-1">{sampleData.name}</h1>
        <div className="flex flex-wrap gap-1 text-xs text-gray-600 mb-1">
          <span>{sampleData.email}</span>
          <span>•</span>
          <span>{sampleData.phone}</span>
          <span>•</span>
          <span>{sampleData.location}</span>
        </div>
        
        <h2 className="text-xs font-semibold uppercase mb-1 border-b border-gray-300">Professional Summary</h2>
        <p className="text-xs mb-2">Experienced software engineer specialized in modern web technologies</p>
        
        <h2 className="text-xs font-semibold uppercase mb-1 border-b border-gray-300">Key Skills</h2>
        <div className="flex flex-wrap gap-1 mb-2">
          {sampleData.skills.map((skill, index) => (
            <span key={index} className="text-xs bg-gray-100 px-1 rounded">
              {skill}
            </span>
          ))}
        </div>
        
        <h2 className="text-xs font-semibold uppercase mb-1 border-b border-gray-300">Experience</h2>
        <div className="mb-1 ml-1">
          <div className="flex justify-between">
            <p className="text-xs font-medium">{sampleData.position}</p>
            <p className="text-xs">2020-Present</p>
          </div>
          <p className="text-xs">{sampleData.company}</p>
        </div>
      </div>
    );
  }

  if (template === 'targeted') {
    return (
      <div className="border rounded bg-white p-3 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-base font-bold mb-1">{sampleData.name}</h1>
        <p className="text-xs bg-resume-primary text-white inline-block px-1 rounded mb-1">{sampleData.position}</p>
        <div className="flex flex-wrap gap-1 text-xs text-gray-600 mb-1">
          <span>{sampleData.email}</span>
          <span>•</span>
          <span>{sampleData.phone}</span>
        </div>
        
        <h2 className="text-xs font-semibold uppercase mb-1">Career Target</h2>
        <p className="text-xs mb-2">Senior Frontend Developer position at Tech Innovators Inc.</p>
        
        <h2 className="text-xs font-semibold uppercase mb-1">Relevant Experience</h2>
        <div className="mb-1 ml-1">
          <p className="text-xs font-medium">Frontend Development</p>
          <p className="text-xs">• Built React applications with TypeScript</p>
          <p className="text-xs">• Implemented responsive designs</p>
        </div>
      </div>
    );
  }

  if (template === 'infographic') {
    return (
      <div className="border rounded bg-white p-3 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-base font-bold text-resume-primary">{sampleData.name}</h1>
          <div className="w-8 h-8 bg-resume-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
            JS
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div className="col-span-1 bg-gray-100 rounded p-1">
            <p className="text-xs font-bold text-center">5+</p>
            <p className="text-xs text-center">Years Exp.</p>
          </div>
          <div className="col-span-1 bg-gray-100 rounded p-1">
            <p className="text-xs font-bold text-center">20+</p>
            <p className="text-xs text-center">Projects</p>
          </div>
          <div className="col-span-1 bg-gray-100 rounded p-1">
            <p className="text-xs font-bold text-center">10+</p>
            <p className="text-xs text-center">Clients</p>
          </div>
        </div>
        
        <div className="mb-2">
          <h2 className="text-xs font-semibold mb-1 flex items-center"><Code size={10} className="mr-1"/> SKILLS</h2>
          <div className="grid grid-cols-2 gap-1">
            {sampleData.skills.slice(0, 4).map((skill, index) => (
              <div key={index} className="flex items-center">
                <div className="w-1 h-1 bg-resume-primary rounded-full mr-1"></div>
                <span className="text-xs">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template === 'profile') {
    return (
      <div className="border rounded bg-white p-3 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-base font-bold">{sampleData.name}</h1>
            <p className="text-xs text-resume-primary">{sampleData.position}</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
        
        <div className="border-t border-b py-1 mb-2">
          <p className="text-xs">Passionate software engineer with a strong focus on frontend development and user experience.</p>
        </div>
        
        <div className="mb-2">
          <h2 className="text-xs font-semibold mb-1">Professional Profile</h2>
          <ul className="text-xs list-disc ml-4">
            <li>5+ years in web development</li>
            <li>Specializes in React ecosystem</li>
            <li>Built 20+ successful applications</li>
          </ul>
        </div>
        
        <div className="flex gap-2 text-xs">
          <div className="bg-gray-100 p-1 rounded flex-1 text-center">
            <Mail size={8} className="inline mr-1"/> {sampleData.email.split('@')[0]}
          </div>
          <div className="bg-gray-100 p-1 rounded flex-1 text-center">
            <Phone size={8} className="inline mr-1"/> {sampleData.phone}
          </div>
        </div>
      </div>
    );
  }

  if (template === 'mini') {
    return (
      <div className="border rounded bg-white p-2 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-sm font-bold text-resume-primary">{sampleData.name}</h1>
        <p className="text-xs text-gray-600">{sampleData.position}</p>
        
        <div className="border-t my-1 pt-1">
          <div className="flex items-center text-xs">
            <Mail size={8} className="mr-1"/> 
            <span>{sampleData.email}</span>
          </div>
          <div className="flex items-center text-xs">
            <Phone size={8} className="mr-1"/> 
            <span>{sampleData.phone}</span>
          </div>
        </div>
        
        <p className="text-xs mt-1 italic">JavaScript • React • Node.js</p>
      </div>
    );
  }

  return null;
};

const ResumeTemplates = () => {
  const { resumeData, setTemplate, setCurrentStep } = useResumeContext();
  const selectedTemplate = resumeData.template || 'professional';
  
  const handleSelectTemplate = (template: TemplateType) => {
    setTemplate(template);
    toast.success(`${template.charAt(0).toUpperCase() + template.slice(1)} template selected!`);
    setCurrentStep(2); // Navigate back to the personal info form
  };
  
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-sm">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-resume-primary mb-3">Choose Your Resume Template</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Select a professional template that best represents your style and experience level. All templates are ATS-friendly and optimized for success.</p>
      </div>
      
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-6 text-resume-secondary border-b pb-2">Most Popular Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Chronological Template */}
          <div className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${
            selectedTemplate === 'chronological' ? 'ring-2 ring-resume-primary' : 'hover:shadow-xl'
          }`}>
            <div className="aspect-w-3 aspect-h-4 bg-white">
              <div className="p-4 transform group-hover:scale-105 transition-transform duration-300">
                <TemplatePreview template="chronological" />
              </div>
              {selectedTemplate === 'chronological' && (
                <div className="absolute top-3 right-3 bg-resume-primary text-white rounded-full p-1.5">
                  <Check size={18} />
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t">
              <h4 className="font-medium text-gray-900 mb-1">Chronological</h4>
              <p className="text-sm text-gray-500 mb-3">Perfect for consistent career progression</p>
              <Button 
                onClick={() => handleSelectTemplate('chronological')}
                variant={selectedTemplate === 'chronological' ? 'default' : 'outline'}
                className={`w-full ${selectedTemplate === 'chronological' ? 'bg-resume-primary hover:bg-resume-secondary' : 'hover:bg-gray-50'}`}
              >
                {selectedTemplate === 'chronological' ? 'Selected' : 'Use This Template'}
              </Button>
            </div>
          </div>

          {/* Functional Template */}
          <div className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${
            selectedTemplate === 'functional' ? 'ring-2 ring-resume-primary' : 'hover:shadow-xl'
          }`}>
            <div className="aspect-w-3 aspect-h-4 bg-white">
              <div className="p-4 transform group-hover:scale-105 transition-transform duration-300">
                <TemplatePreview template="functional" />
              </div>
              {selectedTemplate === 'functional' && (
                <div className="absolute top-3 right-3 bg-resume-primary text-white rounded-full p-1.5">
                  <Check size={18} />
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t">
              <h4 className="font-medium text-gray-900 mb-1">Functional</h4>
              <p className="text-sm text-gray-500 mb-3">Emphasize your skills and achievements</p>
              <Button 
                onClick={() => handleSelectTemplate('functional')}
                variant={selectedTemplate === 'functional' ? 'default' : 'outline'}
                className={`w-full ${selectedTemplate === 'functional' ? 'bg-resume-primary hover:bg-resume-secondary' : 'hover:bg-gray-50'}`}
              >
                {selectedTemplate === 'functional' ? 'Selected' : 'Use This Template'}
              </Button>
            </div>
          </div>

          {/* Modern Template */}
          <div className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${
            selectedTemplate === 'modern' ? 'ring-2 ring-resume-primary' : 'hover:shadow-xl'
          }`}>
            <div className="aspect-w-3 aspect-h-4 bg-white">
              <div className="p-4 transform group-hover:scale-105 transition-transform duration-300">
                <TemplatePreview template="modern" />
              </div>
              {selectedTemplate === 'modern' && (
                <div className="absolute top-3 right-3 bg-resume-primary text-white rounded-full p-1.5">
                  <Check size={18} />
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t">
              <h4 className="font-medium text-gray-900 mb-1">Modern</h4>
              <p className="text-sm text-gray-500 mb-3">Contemporary and professional design</p>
              <Button 
                onClick={() => handleSelectTemplate('modern')}
                variant={selectedTemplate === 'modern' ? 'default' : 'outline'}
                className={`w-full ${selectedTemplate === 'modern' ? 'bg-resume-primary hover:bg-resume-secondary' : 'hover:bg-gray-50'}`}
              >
                {selectedTemplate === 'modern' ? 'Selected' : 'Use This Template'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-6 text-resume-secondary border-b pb-2">Specialized Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Similar template cards for other formats... */}
          {/* The structure remains the same, just add more template options */}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-resume-primary mb-2">Premium Templates</h3>
          <p className="text-gray-600 mb-4">Access our complete collection of premium templates</p>
          <Button className="bg-resume-primary hover:bg-resume-secondary">
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplates;
