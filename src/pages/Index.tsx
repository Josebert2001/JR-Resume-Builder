
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, Wand2, FileText, Book, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-800/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_95%)]"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="py-4 border-b border-slate-800 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg" role="banner">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
              aria-label="Home"
            >
              <div className="logo-glow">
                <img 
                  src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" 
                  alt="JR Resume Builder Logo" 
                  className="h-10 w-auto" 
                />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-100">
                JR Resume Builder
              </h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-2" role="navigation">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors duration-200 rounded-md px-3 py-2 text-sm font-medium">
                Features
              </a>
              <a href="#templates" className="text-slate-300 hover:text-white transition-colors duration-200 rounded-md px-3 py-2 text-sm font-medium">
                Templates
              </a>
              <a href="#ai-features" className="text-slate-300 hover:text-white transition-colors duration-200 rounded-md px-3 py-2 text-sm font-medium">
                AI Features
              </a>
              <Link to="/job-search" className="text-slate-300 hover:text-white transition-colors duration-200 rounded-md px-3 py-2 text-sm font-medium">
                Job Search
              </Link>
              <Link to="/templates">
                <Button variant="secondary" size="sm">
                  View Templates
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative text-center py-24 md:py-32 px-4" role="main">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text mb-6">
                Craft Your Perfect Resume with AI
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-10">
                Unlock your career potential with our AI-powered resume builder. Create professional, ATS-friendly resumes in minutes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/builder">
                  <Button size="lg" className="w-full sm:w-auto">
                    <FileText className="h-5 w-5 mr-2" />
                    Start Building Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Explore Templates
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-20 relative max-w-4xl mx-auto">
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-2xl"></div>
              <img 
                src="/hero-resume-preview.webp" 
                alt="Resume Builder Preview" 
                className="relative w-full rounded-xl shadow-2xl border border-slate-800" 
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4" id="features">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need for a Winning Resume
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Empowering your job search with cutting-edge tools and technology, designed for modern professionals.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Wand2, title: 'AI Assistance', text: 'Get AI-driven suggestions to optimize your resume content and highlight your strengths.', color: 'text-blue-400' },
                { icon: Star, title: 'ATS Optimization', text: 'Ensure your resume passes through Applicant Tracking Systems with our optimization tools.', color: 'text-indigo-400' },
                { icon: FileText, title: 'Professional Templates', text: 'Choose from a variety of professionally designed templates to create a standout resume.', color: 'text-sky-400' },
                { icon: Sparkles, title: 'Skills Matching', text: 'Identify and incorporate the most relevant skills for your desired job roles.', color: 'text-indigo-400' },
                { icon: Search, title: 'Real-time Preview', text: 'See your resume come to life with our real-time preview, ensuring every detail is perfect.', color: 'text-sky-400' },
                { icon: Book, title: 'Expert Tips & Guides', text: 'Access expert tips and guides to help you craft a compelling and effective resume.', color: 'text-blue-400' },
              ].map(feature => (
                <Card key={feature.title} className="text-center">
                  <CardHeader>
                    <div className="mx-auto bg-slate-800/80 rounded-lg p-3 w-fit mb-4 border border-slate-700">
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">{feature.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Showcase */}
        <section className="py-20 px-4 bg-slate-900/40" id="templates">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Designed for Success
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Choose from our professionally designed resume templates to get started. Each one is crafted to impress.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Modern', description: 'Clean and modern design for a professional look.' },
                { title: 'Classic', description: 'Traditional and elegant, perfect for any industry.' },
                { title: 'Creative', description: 'Showcase your creativity with a unique and stylish design.' },
                { title: 'Minimalist', description: 'Simple and clean, focusing on readability and clarity.' },
              ].map(template => (
                <Card key={template.title} className="flex flex-col">
                  <CardContent className="p-6 flex-grow">
                     <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
                     <p className="text-slate-400 text-sm">{template.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button variant="secondary" size="sm" className="w-full">Select Template</Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link to="/templates">
                <Button variant="outline" size="lg">
                  View All Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-20 px-4" id="ai-features">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Supercharge Your Job Hunt with AI
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Leverage the power of AI to enhance your resume and get ahead of the competition.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Wand2 className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-xl">AI Resume Checker</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Get instant feedback on your resume. Identify areas for improvement and ensure your resume is top-notch.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/builder">
                    <Button variant="secondary" size="sm">Check Your Resume</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-6 w-6 text-indigo-400" />
                    <CardTitle className="text-xl">AI Skills Matcher</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Find the perfect job by matching your skills with job requirements from real listings.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/job-search">
                    <Button variant="secondary" size="sm">Match Your Skills</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Start building your professional resume today and take the next step towards your dream job. It's free to get started.
            </p>
            <Link to="/builder">
              <Button size="xl" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-200">
                <FileText className="h-6 w-6 mr-3" />
                Build Your Resume Now
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
