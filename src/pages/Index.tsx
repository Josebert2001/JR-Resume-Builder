import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, Wand2, FileText, Book, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* More subtle animated background particles */}
      <div className="absolute inset-0 particle-bg opacity-10" />
      
      {/* Reduced floating orbs opacity */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="glass-panel py-6 border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl" role="banner">
          <div className="container mx-auto px-4 flex items-center justify-between">
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
            <nav className="hidden md:flex items-center space-x-4" role="navigation">
              <a href="#features" className="text-cyan-100/70 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded px-3 py-2">
                Features
              </a>
              <a href="#templates" className="text-cyan-100/70 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded px-3 py-2">
                Templates
              </a>
              <a href="#ai-features" className="text-cyan-100/70 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded px-3 py-2">
                AI Features
              </a>
              <Link 
                to="/job-search" 
                className="flex items-center gap-2 text-cyan-100/70 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded px-3 py-2"
              >
                Job Search
                <Search className="h-4 w-4" />
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
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20" role="main">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-6">
                Craft Your <span className="neon-text">Perfect Resume</span> with AI
              </h1>
              <p className="text-lg md:text-xl text-cyan-100/70 mb-8">
                Unlock your career potential with our AI-powered resume builder. Create professional, ATS-friendly resumes in minutes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/builder">
                  <Button size="lg" className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    Start Building Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button variant="outline" size="lg" className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400">
                    <Sparkles className="h-5 w-5" />
                    Explore Templates
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 relative">
              <img 
                src="/hero-resume-preview.webp" 
                alt="Resume Builder Preview" 
                className="max-w-full rounded-3xl shadow-2xl neo-card mx-auto" 
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-3xl bg-black/10 backdrop-blur-md z-0 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 relative" id="features">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Key Features
              </h2>
              <p className="text-lg text-cyan-100/70">
                Empowering your job search with cutting-edge tools and technology.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI-Powered Assistance */}
              <div className="neo-card p-6 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Wand2 className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-xl font-medium gradient-text">AI Assistance</h3>
                </div>
                <p className="text-cyan-100/80">
                  Get AI-driven suggestions to optimize your resume content and highlight your strengths.
                </p>
              </div>

              {/* ATS Optimization */}
              <div className="neo-card p-6 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-medium gradient-text">ATS Optimization</h3>
                </div>
                <p className="text-cyan-100/80">
                  Ensure your resume passes through Applicant Tracking Systems with our optimization tools.
                </p>
              </div>

              {/* Professional Templates */}
              <div className="neo-card p-6 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-xl font-medium gradient-text">Professional Templates</h3>
                </div>
                <p className="text-cyan-100/80">
                  Choose from a variety of professionally designed templates to create a standout resume.
                </p>
              </div>

              {/* Skills Matching */}
              <div className="neo-card p-6 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-medium gradient-text">Skills Matching</h3>
                </div>
                <p className="text-cyan-100/80">
                  Identify and incorporate the most relevant skills for your desired job roles.
                </p>
              </div>

              {/* Real-time Preview */}
              <div className="neo-card p-6 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-xl font-medium gradient-text">Real-time Preview</h3>
                </div>
                <p className="text-cyan-100/80">
                  See your resume come to life with our real-time preview feature, ensuring every detail is perfect.
                </p>
              </div>

              {/* Expert Tips & Guides */}
              <div className="neo-card p-6 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Book className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-medium gradient-text">Expert Tips & Guides</h3>
                </div>
                <p className="text-cyan-100/80">
                  Access expert tips and guides to help you craft a compelling and effective resume.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Showcase */}
        <section className="py-20 px-4 relative" id="templates">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Resume Templates
              </h2>
              <p className="text-lg text-cyan-100/70">
                Choose from our professionally designed resume templates to get started.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Template Cards - Replace with actual template components */}
              <div className="neo-card p-4 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
                <div>
                  <h3 className="text-xl font-medium gradient-text mb-2">Modern Template</h3>
                  <p className="text-cyan-100/80 text-sm">Clean and modern design for a professional look.</p>
                </div>
                <Button variant="secondary" size="sm">Select Template</Button>
              </div>
              <div className="neo-card p-4 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
                <div>
                  <h3 className="text-xl font-medium gradient-text mb-2">Classic Template</h3>
                  <p className="text-cyan-100/80 text-sm">Traditional and elegant, perfect for any industry.</p>
                </div>
                <Button variant="secondary" size="sm">Select Template</Button>
              </div>
              <div className="neo-card p-4 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
                <div>
                  <h3 className="text-xl font-medium gradient-text mb-2">Creative Template</h3>
                  <p className="text-cyan-100/80 text-sm">Showcase your creativity with a unique and stylish design.</p>
                </div>
                <Button variant="secondary" size="sm">Select Template</Button>
              </div>
              <div className="neo-card p-4 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
                <div>
                  <h3 className="text-xl font-medium gradient-text mb-2">Minimalist Template</h3>
                  <p className="text-cyan-100/80 text-sm">Simple and clean, focusing on readability and clarity.</p>
                </div>
                <Button variant="secondary" size="sm">Select Template</Button>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link to="/templates">
                <Button variant="outline" size="lg" className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400">
                  View All Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-20 px-4 relative bg-gradient-to-br from-slate-800/50 to-purple-800/30" id="ai-features">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                AI-Powered Features
              </h2>
              <p className="text-lg text-cyan-100/70">
                Leverage the power of AI to enhance your resume and job search.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AI Resume Checker */}
              <div className="neo-card p-6 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Wand2 className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-xl font-medium gradient-text">AI Resume Checker</h3>
                </div>
                <p className="text-cyan-100/80">
                  Get instant feedback on your resume with our AI-powered checker. Identify areas for improvement and ensure your resume is top-notch.
                </p>
                <Link to="/builder">
                  <Button variant="secondary" size="sm" className="mt-4">Check Your Resume</Button>
                </Link>
              </div>

              {/* AI Skills Matcher */}
              <div className="neo-card p-6 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-medium gradient-text">AI Skills Matcher</h3>
                </div>
                <p className="text-cyan-100/80">
                  Find the perfect job by matching your skills with job requirements. Our AI analyzes job descriptions and highlights relevant skills.
                </p>
                <Link to="/job-search">
                  <Button variant="secondary" size="sm" className="mt-4">Match Your Skills</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-cyan-100/70 mb-8">
              Start building your professional resume today and take the next step towards your dream job.
            </p>
            <Link to="/builder">
              <Button size="xl" className="flex items-center gap-3">
                <FileText className="h-6 w-6" />
                Build Your Resume Now
                <ArrowRight className="h-6 w-6" />
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
