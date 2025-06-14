
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, Wand2, FileText, Book, Search, ArrowRight, Shield, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-x-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 subtle-grid opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-950/20 to-transparent"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 border-b border-slate-800/50 sticky top-0 z-50 glass-panel" role="banner">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 group"
              aria-label="Home"
            >
              <div className="logo-glow">
                <img 
                  src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" 
                  alt="JR Resume Builder Logo" 
                  className="h-10 w-auto transition-transform group-hover:scale-105" 
                />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-50 group-hover:text-blue-300 transition-colors">
                JR Resume Builder
              </h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-1" role="navigation">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors duration-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800/50">
                Features
              </a>
              <a href="#templates" className="text-slate-300 hover:text-white transition-colors duration-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800/50">
                Templates
              </a>
              <a href="#ai-features" className="text-slate-300 hover:text-white transition-colors duration-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800/50">
                AI Features
              </a>
              <Link to="/job-search" className="text-slate-300 hover:text-white transition-colors duration-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800/50">
                Job Search
              </Link>
              <Link to="/templates">
                <Button variant="secondary" size="sm" className="ml-2">
                  View Templates
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative text-center py-24 md:py-32 px-4 hero-gradient" role="main">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto animate-slide-up">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  AI-Powered Resume Builder
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6 leading-tight">
                  Craft Your Perfect Resume with AI
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                  Transform your career with our intelligent resume builder. Create professional, ATS-optimized resumes that get you noticed.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <Link to="/builder">
                  <Button size="xl" className="w-full sm:w-auto group">
                    <FileText className="h-5 w-5 mr-2" />
                    Start Building Now
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Explore Templates
                  </Button>
                </Link>
              </div>
              
              <div className="relative max-w-5xl mx-auto animate-fade-in">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-60 blur-2xl"></div>
                <div className="relative glass-card rounded-2xl p-2">
                  <img 
                    src="/hero-resume-preview.webp" 
                    alt="Resume Builder Preview" 
                    className="w-full rounded-xl" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 section-gradient" id="features">
          <div className="container mx-auto">
            <div className="text-center mb-20 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
                <Star className="h-4 w-4" />
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Everything You Need for Success
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Empowering your job search with cutting-edge tools and technology, designed for modern professionals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                { icon: Wand2, title: 'AI-Powered Writing', text: 'Get intelligent suggestions to optimize your resume content and highlight your unique strengths effectively.', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { icon: Shield, title: 'ATS Optimization', text: 'Ensure your resume passes through Applicant Tracking Systems with our advanced optimization algorithms.', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                { icon: FileText, title: 'Professional Templates', text: 'Choose from expertly designed templates that adapt to your industry and career level.', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                { icon: Target, title: 'Smart Skills Matching', text: 'Identify and incorporate the most relevant skills for your target job roles and industry.', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                { icon: Zap, title: 'Real-time Preview', text: 'See your resume transform instantly with our live preview, ensuring every detail is perfect.', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
                { icon: Book, title: 'Career Guidance', text: 'Access expert tips, industry insights, and personalized advice to advance your career.', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
              ].map((feature, index) => (
                <Card key={feature.title} className="text-center hover-lift animate-scale-in group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className={`mx-auto rounded-2xl p-4 w-fit mb-4 ${feature.bg} border ${feature.border} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 leading-relaxed">{feature.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Showcase */}
        <section className="py-24 px-4" id="templates">
          <div className="container mx-auto">
            <div className="text-center mb-20 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium mb-6">
                <FileText className="h-4 w-4" />
                Professional Templates
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Designed for Success
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Choose from our expertly crafted resume templates, each optimized for different industries and career levels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
              {[
                { title: 'Professional', description: 'Clean, traditional design perfect for corporate environments and established industries.' },
                { title: 'Modern', description: 'Contemporary layout with creative touches, ideal for tech and innovative companies.' },
                { title: 'Creative', description: 'Bold, distinctive design that showcases personality for creative industries.' },
                { title: 'Minimalist', description: 'Simple and elegant design that focuses on content clarity and readability.' },
              ].map((template, index) => (
                <Card key={template.title} className="hover-lift animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 flex items-center justify-center border border-slate-700">
                      <FileText className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{template.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Preview Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/templates">
                <Button size="lg" variant="outline">
                  <Sparkles className="h-5 w-5 mr-2" />
                  View All Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-24 px-4 section-gradient" id="ai-features">
          <div className="container mx-auto">
            <div className="text-center mb-20 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
                <Wand2 className="h-4 w-4" />
                AI-Powered Tools
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Supercharge Your Job Hunt
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Leverage the power of artificial intelligence to enhance your resume and get ahead of the competition.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="hover-lift animate-scale-in">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                      <Wand2 className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl">AI Resume Analyzer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    Get instant, intelligent feedback on your resume. Our AI identifies areas for improvement and provides actionable suggestions to make your resume stand out.
                  </p>
                  <Link to="/builder">
                    <Button variant="default" className="w-full">
                      Analyze Your Resume
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover-lift animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                      <Target className="h-6 w-6 text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl">Smart Job Matching</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    Find the perfect opportunities by matching your skills and experience with real job listings. Our AI helps you discover roles you're qualified for.
                  </p>
                  <Link to="/job-search">
                    <Button variant="secondary" className="w-full">
                      Find Matching Jobs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto glass-card rounded-3xl p-12 md:p-16 animate-scale-in">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  Start Your Success Story
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 gradient-text">
                  Ready to Transform Your Career?
                </h2>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Join thousands of professionals who have advanced their careers with our AI-powered resume builder. Get started for free today.
                </p>
              </div>
              
              <Link to="/builder">
                <Button size="xl" className="group">
                  <FileText className="h-6 w-6 mr-3" />
                  Build Your Resume Now
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
