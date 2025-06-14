
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useResumeContext } from '@/context/ResumeContext';
import type { TemplateType } from '@/context/ResumeContext';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import { TemplatePreview } from '@/components/TemplatePreview';
import { Info, Book, FileText, Layers, Sparkles, Palette, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simplified templates
const templates = [
  { 
    id: "professional" as TemplateType, 
    title: "Professional", 
    description: "Clean, traditional design perfect for corporate environments",
    bestFor: "Business, finance, and traditional industries"
  },
  { 
    id: "modern" as TemplateType, 
    title: "Modern", 
    description: "Contemporary layout with creative touches and clean design",
    bestFor: "Tech, design, and forward-thinking industries"
  },
  { 
    id: "creative" as TemplateType, 
    title: "Creative", 
    description: "Bold, distinctive design that showcases personality",
    bestFor: "Creative fields like design, marketing, or media"
  },
  { 
    id: "minimal" as TemplateType, 
    title: "Minimal", 
    description: "Simple and elegant design that focuses on content clarity",
    bestFor: "Any industry where simplicity is valued"
  }
];

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
    <Card className="h-full flex flex-col group relative overflow-hidden animate-slide-up hover:scale-[1.02] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="scan-line opacity-0 group-hover:opacity-100" />
      
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-lg md:text-xl text-white flex items-center gap-2">
          <Palette className="h-5 w-5 text-cyan-400" />
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-cyan-100/70">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow h-64 sm:h-72 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 relative">
        <TemplatePreview template={template} />
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2 pt-2 relative">
        <div className="glass-panel w-full p-3 rounded-xl text-xs text-cyan-100/80 flex items-start gap-2 border-white/10">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-cyan-400" />
          <span><strong className="text-cyan-300">Best for:</strong> {bestFor}</span>
        </div>
        <div className="flex flex-col sm:flex-row w-full gap-2">
          <Button 
            className="w-full"
            variant="cyber"
            onClick={handleSelect}
            aria-label={`Select ${title} template`}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Select Template
          </Button>
          <Link 
            to="/" 
            className="w-full"
            aria-label={`Use ${title} template to create resume`}
          >
            <Button 
              variant="outline" 
              className="w-full border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400"
            >
              <FileText className="h-4 w-4 mr-2" />
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
    <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-6 border-white/20 mb-10 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="scan-line" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Book className="h-6 w-6 text-cyan-400" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold gradient-text">Understanding Resume Formats</h3>
          <Layers className="h-5 w-5 text-purple-400" />
        </div>
        <p className="mb-4 text-sm text-cyan-100/70">
          Choosing the right resume format can significantly impact your job application success. Here's a quick guide to our available formats:
        </p>
        
        <div className="space-y-4 mb-4">
          {templates.map((template, index) => (
            <div key={template.id} className="glass-panel rounded-xl p-4 border-white/10 hover:border-white/20 transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
              <h4 className="font-medium mb-1 text-cyan-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                {template.title}
              </h4>
              <p className="text-sm text-cyan-100/80">
                {template.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResumeTemplatesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 particle-bg opacity-20" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        <header className="glass-panel py-6 border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl" role="banner">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:bg-white/10 text-white border border-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Link 
                to="/" 
                className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg"
                aria-label="Home"
              >
                <div className="relative animate-pulse-glow rounded-full p-1">
                  <img 
                    src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" 
                    alt="JR Resume Builder Logo" 
                    className="h-10 w-auto" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold gradient-text">
                    JR Resume Builder
                  </h1>
                  <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-4" role="navigation">
              <Link 
                to="/" 
                className="text-cyan-100/70 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded px-3 py-2"
              >
                Home
              </Link>
              <span className="text-cyan-400 font-medium px-3 py-2" aria-current="page">
                Templates
              </span>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 md:py-12" role="main">
          <div className="max-w-5xl mx-auto animate-slide-up">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative">
                  <Layers className="h-10 w-10 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
                </div>
                <Palette className="h-8 w-8 text-purple-400 animate-pulse" />
                <FileText className="h-9 w-9 text-cyan-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Resume Templates</h2>
              <p className="text-cyan-100/70 mb-6 text-lg">Choose from our professionally designed resume templates to get started with your job application.</p>
            </div>
            
            {/* Educational section about resume formats */}
            <ResumeFormats />
            
            {/* Templates grid */}
            <div className="mb-8">
              <div className="glass-panel rounded-2xl p-6 border-white/20 mb-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="scan-line" />
                <div className="relative">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 gradient-text flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
                    Our Premium Templates
                  </h3>
                  <p className="text-cyan-100/70 mb-6">Choose from our curated selection of professional templates designed to help you stand out.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {templates.map((template, index) => (
                  <div key={template.id} style={{ animationDelay: `${index * 0.2}s` }}>
                    <TemplateCard 
                      title={template.title} 
                      description={template.description} 
                      bestFor={template.bestFor}
                      template={template.id} 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 border-white/20 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="scan-line" />
              <div className="relative">
                <h3 className="text-lg md:text-xl font-semibold mb-4 gradient-text flex items-center gap-2">
                  <Info className="h-6 w-6 text-cyan-400" />
                  Need Help Choosing?
                </h3>
                <p className="mb-4 text-sm text-cyan-100/80">
                  Not sure which template is right for your career goals? Our resume experts can help you select the best format based on your experience and target industry.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/">
                    <Button variant="cyber" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Start Building Your Resume
                    </Button>
                  </Link>
                  <Link to="/job-search-tips">
                    <Button variant="outline" className="border-purple-400/50 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400 flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      View Resume Tips
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ResumeTemplatesPage;
