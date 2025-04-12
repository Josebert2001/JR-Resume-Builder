
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ResumeProvider, useResumeContext } from '@/context/ResumeContext';
import type { TemplateType } from '@/context/ResumeContext';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import { Download, Mail, Phone, MapPin, Briefcase, Calendar, Code, GraduationCap, Award, FilePieChart } from 'lucide-react';

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

  if (template === 'chronological') {
    return (
      <div className="border rounded bg-white p-4 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-lg font-bold text-center mb-1">{sampleData.name}</h1>
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
      <div className="border rounded bg-white p-4 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-lg font-bold mb-1">{sampleData.name}</h1>
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
      <div className="border rounded bg-white p-4 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-lg font-bold mb-1">{sampleData.name}</h1>
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
      <div className="border rounded bg-white p-4 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <h1 className="text-lg font-bold mb-1">{sampleData.name}</h1>
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
      <div className="border rounded bg-white p-4 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-bold text-resume-primary">{sampleData.name}</h1>
          <div className="w-10 h-10 bg-resume-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
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
      <div className="border rounded bg-white p-4 h-full text-left scale-90 shadow-sm transform origin-top-left">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-lg font-bold">{sampleData.name}</h1>
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow h-64 sm:h-72 overflow-hidden">
        <TemplatePreview template={template} />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
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
          <Link to="/" className="flex items-center space-x-2 sm:space-x-4">
            <img 
              src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" 
              alt="JR Resume Builder Logo" 
              className="h-8 md:h-12 w-auto"
            />
            <div>
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-resume-primary to-coral-red text-transparent bg-clip-text">JR Resume Builder</h1>
              <p className="text-gray-600 text-xs md:text-sm">Create professional resumes with ease</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-resume-primary transition-colors">Home</Link>
            <Link to="/templates" className="text-resume-primary font-medium">Templates</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-resume-primary mb-4 md:mb-6">Resume Templates</h2>
          <p className="text-gray-600 mb-6 md:mb-10 text-sm md:text-base">Choose from our professionally designed resume templates to get started with your job application.</p>
          
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
