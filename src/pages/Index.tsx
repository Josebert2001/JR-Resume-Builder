
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, 
  Search, 
  Bot,
  MessageSquare,
  TrendingUp,
  Palette,
  Sparkles,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative particle-bg">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 gradient-animation opacity-20 pointer-events-none" />
      
      <header className="relative z-10 glass-panel py-6 border-b border-white/10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative animate-pulse-glow rounded-full p-2">
              <img src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" alt="JR Resume Builder Logo" className="h-12 w-auto" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold gradient-text">
                JR Resume Builder
              </h1>
              <p className="text-xs text-cyan-300/80 font-mono">v2.0 • AI-Powered</p>
            </div>
          </div>
          <div className="md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="glass-card text-white hover:bg-white/10">
                  Resources <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel border-white/20">
                <DropdownMenuItem asChild>
                  <Link to="/cover-letter" className="cursor-pointer text-white hover:bg-white/10">Cover Letter Guide</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/job-search" className="cursor-pointer text-white hover:bg-white/10">Job Search Tips</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/interview-prep" className="cursor-pointer text-white hover:bg-white/10">Interview Preparation</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main hero section */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-cyan-400 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold gradient-text typewriter">
              Build Your Perfect Resume
            </h1>
            <Zap className="h-8 w-8 text-purple-400 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-cyan-100/80 mb-8 max-w-3xl mx-auto font-light">
            Create a professional resume in minutes with our AI-powered builder
          </p>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card 
              className="neo-card cursor-pointer magnetic-hover group"
              onClick={() => navigate('/resume-builder')}
            >
              <CardHeader className="text-center p-8">
                <div className="mx-auto mb-4 relative">
                  <FileText className="h-16 w-16 mx-auto text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl group-hover:bg-cyan-300/30 transition-all duration-300" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Resume Builder</CardTitle>
                <CardDescription className="text-cyan-100/70">Create and customize your resume</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="neo-card cursor-pointer magnetic-hover group"
              onClick={() => navigate('/ai-assistance')}
            >
              <CardHeader className="text-center p-8">
                <div className="mx-auto mb-4 relative">
                  <Bot className="h-16 w-16 mx-auto text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl group-hover:bg-purple-300/30 transition-all duration-300" />
                </div>
                <CardTitle className="text-white text-xl mb-2">AI Assistant</CardTitle>
                <CardDescription className="text-cyan-100/70">Get personalized career guidance</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="neo-card cursor-pointer magnetic-hover group"
              onClick={() => navigate('/job-search-ai')}
            >
              <CardHeader className="text-center p-8">
                <div className="mx-auto mb-4 relative">
                  <Search className="h-16 w-16 mx-auto text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl group-hover:bg-green-300/30 transition-all duration-300" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Job Search</CardTitle>
                <CardDescription className="text-cyan-100/70">Find relevant job opportunities</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="neo-card cursor-pointer magnetic-hover group"
              onClick={() => navigate('/templates')}
            >
              <CardHeader className="text-center p-8">
                <div className="mx-auto mb-4 relative">
                  <Palette className="h-16 w-16 mx-auto text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-xl group-hover:bg-orange-300/30 transition-all duration-300" />
                </div>
                <CardTitle className="text-white text-xl mb-2">Templates</CardTitle>
                <CardDescription className="text-cyan-100/70">Choose from professional designs</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-6">
            <Button 
              onClick={() => navigate('/ai-assistance')}
              className="cyber-button flex items-center gap-3 px-8 py-4 text-lg"
              variant="outline"
            >
              <MessageSquare className="h-5 w-5" />
              Chat with AI Assistant
            </Button>
            <Button 
              onClick={() => navigate('/templates')}
              className="cyber-button flex items-center gap-3 px-8 py-4 text-lg"
              variant="outline"
            >
              <Palette className="h-5 w-5" />
              Browse Templates
            </Button>
            <Button 
              onClick={() => navigate('/interview-prep')}
              className="cyber-button flex items-center gap-3 px-8 py-4 text-lg"
              variant="outline"
            >
              <TrendingUp className="h-5 w-5" />
              Interview Prep
            </Button>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 glass-panel px-8 py-4 rounded-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-mono">AI Powered</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-300 text-sm font-mono">Real-time Job Search</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-300 text-sm font-mono">Professional Templates</span>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
