
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
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Most Popular Resume Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chronological Template */}
          <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'chronological' ? 'ring-2 ring-resume-primary' : ''}`}>
            <div className="aspect-w-3 aspect-h-4 bg-white relative">
              <div className="absolute inset-0">
                <TemplatePreview template="chronological" />
              </div>
              
              {selectedTemplate === 'chronological' && (
                <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Chronological</h3>
              <p className="text-sm text-gray-500">Emphasizes your career path and work history</p>
              <Button 
                onClick={() => handleSelectTemplate('chronological')}
                variant={selectedTemplate === 'chronological' ? 'default' : 'outline'}
                className={`w-full mt-3 ${selectedTemplate === 'chronological' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
              >
                {selectedTemplate === 'chronological' ? 'Selected' : 'Select'}
              </Button>
            </div>
          </div>
          
          {/* Functional Template */}
          <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'functional' ? 'ring-2 ring-resume-primary' : ''}`}>
            <div className="aspect-w-3 aspect-h-4 bg-white relative">
              <div className="absolute inset-0">
                <TemplatePreview template="functional" />
              </div>
              
              {selectedTemplate === 'functional' && (
                <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Functional</h3>
              <p className="text-sm text-gray-500">Highlights your skills and abilities</p>
              <Button 
                onClick={() => handleSelectTemplate('functional')}
                variant={selectedTemplate === 'functional' ? 'default' : 'outline'}
                className={`w-full mt-3 ${selectedTemplate === 'functional' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
              >
                {selectedTemplate === 'functional' ? 'Selected' : 'Select'}
              </Button>
            </div>
          </div>
          
          {/* Combination Template */}
          <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'combination' ? 'ring-2 ring-resume-primary' : ''}`}>
            <div className="aspect-w-3 aspect-h-4 bg-white relative">
              <div className="absolute inset-0">
                <TemplatePreview template="combination" />
              </div>
              
              {selectedTemplate === 'combination' && (
                <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Combination</h3>
              <p className="text-sm text-gray-500">Blends chronological and functional approaches</p>
              <Button 
                onClick={() => handleSelectTemplate('combination')}
                variant={selectedTemplate === 'combination' ? 'default' : 'outline'}
                className={`w-full mt-3 ${selectedTemplate === 'combination' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
              >
                {selectedTemplate === 'combination' ? 'Selected' : 'Select'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Specialized Resume Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Targeted Template */}
          <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'targeted' ? 'ring-2 ring-resume-primary' : ''}`}>
            <div className="aspect-w-3 aspect-h-4 bg-white relative">
              <div className="absolute inset-0">
                <TemplatePreview template="targeted" />
              </div>
              
              {selectedTemplate === 'targeted' && (
                <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Targeted</h3>
              <p className="text-sm text-gray-500">Customized for a specific job or company</p>
              <Button 
                onClick={() => handleSelectTemplate('targeted')}
                variant={selectedTemplate === 'targeted' ? 'default' : 'outline'}
                className={`w-full mt-3 ${selectedTemplate === 'targeted' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
              >
                {selectedTemplate === 'targeted' ? 'Selected' : 'Select'}
              </Button>
            </div>
          </div>
          
          {/* Infographic Template */}
          <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'infographic' ? 'ring-2 ring-resume-primary' : ''}`}>
            <div className="aspect-w-3 aspect-h-4 bg-white relative">
              <div className="absolute inset-0">
                <TemplatePreview template="infographic" />
              </div>
              
              {selectedTemplate === 'infographic' && (
                <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Infographic</h3>
              <p className="text-sm text-gray-500">Visual representation of your qualifications</p>
              <Button 
                onClick={() => handleSelectTemplate('infographic')}
                variant={selectedTemplate === 'infographic' ? 'default' : 'outline'}
                className={`w-full mt-3 ${selectedTemplate === 'infographic' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
              >
                {selectedTemplate === 'infographic' ? 'Selected' : 'Select'}
              </Button>
            </div>
          </div>
          
          {/* Profile Template */}
          <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'profile' ? 'ring-2 ring-resume-primary' : ''}`}>
            <div className="aspect-w-3 aspect-h-4 bg-white relative">
              <div className="absolute inset-0">
                <TemplatePreview template="profile" />
              </div>
              
              {selectedTemplate === 'profile' && (
                <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Profile</h3>
              <p className="text-sm text-gray-500">Highlights your professional persona</p>
              <Button 
                onClick={() => handleSelectTemplate('profile')}
                variant={selectedTemplate === 'profile' ? 'default' : 'outline'}
                className={`w-full mt-3 ${selectedTemplate === 'profile' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
              >
                {selectedTemplate === 'profile' ? 'Selected' : 'Select'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Traditional Templates</h3>
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
              <p className="text-sm text-gray-500">Clean and traditional design</p>
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
              <p className="text-sm text-gray-500">Simple and elegant design</p>
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
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Special Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Mini Resume */}
          <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'mini' ? 'ring-2 ring-resume-primary' : ''}`}>
            <div className="aspect-w-3 aspect-h-2 bg-white relative">
              <div className="absolute inset-0">
                <TemplatePreview template="mini" />
              </div>
              
              {selectedTemplate === 'mini' && (
                <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Mini Resume</h3>
              <p className="text-sm text-gray-500">Compact format for networking events or business cards</p>
              <Button 
                onClick={() => handleSelectTemplate('mini')}
                variant={selectedTemplate === 'mini' ? 'default' : 'outline'}
                className={`w-full mt-3 ${selectedTemplate === 'mini' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
              >
                {selectedTemplate === 'mini' ? 'Selected' : 'Select'}
              </Button>
            </div>
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
