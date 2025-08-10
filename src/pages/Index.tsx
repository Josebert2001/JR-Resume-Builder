
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { NavHeader } from '@/components/NavHeader';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, 
  Search, 
  Bot,
  MessageSquare,
  TrendingUp,
  Palette
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-resume-light dark:bg-gray-900">
      <NavHeader />
      
      {/* Main hero section */}
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-resume-primary to-resume-accent bg-clip-text text-transparent mb-4 animate-fade-in">
            Build Your Perfect Resume
          </h1>
          <p className="text-lg md:text-xl text-resume-muted mb-8 max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
            Create a professional resume in minutes with our AI-powered builder
          </p>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => user ? navigate('/resume-builder') : navigate('/auth')}
            >
              <CardHeader className="text-center p-8">
                <FileText className="h-12 w-12 mx-auto text-resume-primary mb-4" />
                <CardTitle>Resume Builder</CardTitle>
                <CardDescription>Create and customize your resume</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => user ? navigate('/ai-assistance') : navigate('/auth')}
            >
              <CardHeader className="text-center p-8">
                <Bot className="h-12 w-12 mx-auto text-resume-primary mb-4" />
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Get personalized career guidance</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => user ? navigate('/job-search-ai') : navigate('/auth')}
            >
              <CardHeader className="text-center p-8">
                <Search className="h-12 w-12 mx-auto text-resume-primary mb-4" />
                <CardTitle>Job Search</CardTitle>
                <CardDescription>Find relevant job opportunities</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="cursor-pointer"
              onClick={() => navigate('/templates')}
            >
              <CardHeader className="text-center p-8">
                <Palette className="h-12 w-12 mx-auto text-resume-primary mb-4" />
                <CardTitle>Templates</CardTitle>
                <CardDescription>Choose from professional designs</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/ai-assistance')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <MessageSquare className="h-4 w-4" />
              Chat with AI Assistant
            </Button>
            <Button 
              onClick={() => navigate('/templates')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Palette className="h-4 w-4" />
              Browse Templates
            </Button>
            <Button 
              onClick={() => navigate('/interview-prep')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <TrendingUp className="h-4 w-4" />
              Interview Prep
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
