
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ResumeProvider, useResumeContext } from '@/context/ResumeContext';
import type { TemplateType } from '@/context/ResumeContext';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import { TemplatePreview } from '@/components/TemplatePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Book, Info } from 'lucide-react';

// Template categories and descriptions
const templateCategories = {
  standard: {
    title: "Standard Resume Formats",
    description: "Widely accepted templates suitable for most industries and positions",
    templates: [
      { 
        id: "chronological" as TemplateType, 
        title: "Chronological", 
        description: "Industry standard format that emphasizes your career path and work history in reverse order",
        bestFor: "Professionals with steady career progression"
      },
      { 
        id: "functional" as TemplateType, 
        title: "Functional", 
        description: "Highlights your skills and abilities rather than your work timeline",
        bestFor: "Career changers or those with employment gaps"
      },
      { 
        id: "combination" as TemplateType, 
        title: "Combination", 
        description: "Blends chronological and functional approaches for a comprehensive view",
        bestFor: "Experienced professionals with diverse skillsets"
      }
    ]
  },
  design: {
    title: "Design-Oriented Templates",
    description: "Visually distinctive templates that make your resume stand out",
    templates: [
      { 
        id: "modern" as TemplateType, 
        title: "Modern", 
        description: "Contemporary layout with creative touches and clean design",
        bestFor: "Tech, design, and forward-thinking industries"
      },
      { 
        id: "professional" as TemplateType, 
        title: "Professional", 
        description: "Clean, traditional design perfect for corporate environments",
        bestFor: "Business, finance, and traditional industries"
      },
      { 
        id: "minimal" as TemplateType, 
        title: "Minimal", 
        description: "Simple and elegant design that focuses on content clarity",
        bestFor: "Any industry where simplicity is valued"
      },
      { 
        id: "creative" as TemplateType, 
        title: "Creative", 
        description: "Bold, distinctive design that showcases personality",
        bestFor: "Creative fields like design, marketing, or media"
      }
    ]
  },
  specialized: {
    title: "Specialized Resume Formats",
    description: "Templates designed for specific purposes or job search strategies",
    templates: [
      { 
        id: "targeted" as TemplateType, 
        title: "Targeted", 
        description: "Customized format designed for specific jobs or companies",
        bestFor: "Tailoring your resume to a particular role"
      },
      { 
        id: "infographic" as TemplateType, 
        title: "Infographic", 
        description: "Visual representation of your qualifications and experience",
        bestFor: "Creative positions where visualization skills matter"
      },
      { 
        id: "profile" as TemplateType, 
        title: "Profile", 
        description: "Highlights your professional persona and personal brand",
        bestFor: "Consultants, entrepreneurs, and thought leaders"
      },
      { 
        id: "blind" as TemplateType, 
        title: "Blind", 
        description: "Format that minimizes personal identifiers to reduce bias",
        bestFor: "Promoting equitable hiring practices"
      },
      { 
        id: "mini" as TemplateType, 
        title: "Mini Resume", 
        description: "Compact format that fits essential information on a single page",
        bestFor: "Networking events or brief introductions"
      }
    ]
  }
};

const TemplateCard = ({ 
  title, 
  description, 
  bestFor,
  template 
}: { 
  title: string; 
  description: string;
  bestFor: string;
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
      <CardFooter className="flex flex-col gap-2 pt-2">
        <div className="bg-gray-50 w-full p-2 rounded text-xs text-gray-600 flex items-start gap-2">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span><strong>Best for:</strong> {bestFor}</span>
        </div>
        <div className="flex flex-col sm:flex-row w-full gap-2">
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
        </div>
      </CardFooter>
    </Card>
  );
};

const ResumeFormats = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm border mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Book className="h-5 w-5 text-resume-primary" />
        <h3 className="text-xl font-semibold text-resume-primary">Understanding Resume Formats</h3>
      </div>
      <p className="mb-4 text-sm text-resume-muted">
        Choosing the right resume format can significantly impact your job application success. Here's a quick guide to the most common formats:
      </p>
      
      <div className="space-y-4 mb-4">
        <div>
          <h4 className="font-medium mb-1">Chronological Resume</h4>
          <p className="text-sm">
            Lists work experience in reverse chronological order (most recent first). This is the current preferred standard 
            and works best if you're showing career progression in the same field.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-1">Functional Resume</h4>
          <p className="text-sm">
            Emphasizes skills and abilities rather than employment timeline. Good for career changers or addressing employment gaps.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-1">Combination Resume</h4>
          <p className="text-sm">
            Blends chronological and functional approaches, opening with relevant skills followed by work history.
            Ideal for highlighting specialized expertise while maintaining a clear career path.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-1">ATS Considerations</h4>
          <p className="text-sm">
            With 85% of employers using Applicant Tracking Systems (ATS), ensure your resume is machine-readable
            by using standard fonts, avoiding graphics in key areas, and including relevant keywords for your industry.
          </p>
        </div>
      </div>
    </div>
  );
};

const TemplatesContent = () => {
  const [activeTab, setActiveTab] = React.useState("standard");
  
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
          
          {/* Educational section about resume formats */}
          <ResumeFormats />
          
          {/* Template navigation tabs */}
          <div className="mb-8">
            <Tabs 
              defaultValue="standard" 
              className="w-full"
              onValueChange={value => setActiveTab(value)}
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="standard">Standard Formats</TabsTrigger>
                <TabsTrigger value="design">Design Templates</TabsTrigger>
                <TabsTrigger value="specialized">Specialized</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-resume-secondary">{templateCategories.standard.title}</h3>
                <p className="text-resume-muted mb-6">{templateCategories.standard.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {templateCategories.standard.templates.map(template => (
                    <TemplateCard 
                      key={template.id}
                      title={template.title} 
                      description={template.description} 
                      bestFor={template.bestFor}
                      template={template.id} 
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="design">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-resume-secondary">{templateCategories.design.title}</h3>
                <p className="text-resume-muted mb-6">{templateCategories.design.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {templateCategories.design.templates.map(template => (
                    <TemplateCard 
                      key={template.id}
                      title={template.title} 
                      description={template.description}
                      bestFor={template.bestFor}
                      template={template.id} 
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="specialized">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-resume-secondary">{templateCategories.specialized.title}</h3>
                <p className="text-resume-muted mb-6">{templateCategories.specialized.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {templateCategories.specialized.templates.map(template => (
                    <TemplateCard 
                      key={template.id}
                      title={template.title} 
                      description={template.description}
                      bestFor={template.bestFor}
                      template={template.id} 
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <Separator className="my-8" />
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-resume-primary">Need Help Choosing?</h3>
            <p className="mb-4 text-sm">
              Not sure which template is right for your career goals? Our resume experts can help you select the best format based on your experience and target industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/">
                <Button className="bg-resume-primary hover:bg-resume-secondary">Start Building Your Resume</Button>
              </Link>
              <Link to="/job-search-tips">
                <Button variant="outline">View Resume Tips</Button>
              </Link>
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
