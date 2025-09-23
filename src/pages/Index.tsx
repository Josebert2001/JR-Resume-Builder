import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { NavHeader } from '@/components/NavHeader';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Zap, 
  Download,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
  Upload,
  Sparkles,
  Layout
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-resume-secondary/5">
        <div className="container mx-auto px-4 py-20 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-resume-primary/10 text-resume-primary hover:bg-resume-primary/20 border-resume-primary/20">
              🚀 AI-Powered Resume Builder
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-resume-primary to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              Get Your Resume Job-Ready in 60 Seconds
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Create professional, ATS-friendly resumes with AI assistance. Land more interviews with resumes that actually get noticed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg"
                className="bg-resume-primary hover:bg-resume-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => user ? navigate('/resume-builder') : navigate('/auth')}
              >
                Build New Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/upload-resume')}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload & Improve
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-resume-primary/30 text-resume-primary hover:bg-resume-primary/5 hover:border-resume-primary/50 px-8 py-4 text-lg font-semibold"
                onClick={() => navigate('/templates')}
              >
                View Templates
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-resume-success" />
                <span>ATS-Friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-resume-success" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-resume-success" />
                <span>Professional Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-resume-success" />
                <span>Instant PDF Export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">3 Ways to Create Your Perfect Resume</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the method that works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group text-center border border-border/50 hover:border-resume-primary/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-resume-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-resume-primary/20 transition-colors">
                  <FileText className="h-8 w-8 text-resume-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Build from Scratch</h3>
                <p className="text-muted-foreground mb-6">
                  Start fresh with our guided resume builder and AI assistance
                </p>
                <Button 
                  className="w-full bg-resume-primary hover:bg-resume-primary/90 text-white"
                  onClick={() => user ? navigate('/resume-builder') : navigate('/auth')}
                >
                  Start Building
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group text-center border border-border/50 hover:border-resume-primary/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-resume-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-resume-secondary/70 transition-colors">
                  <Upload className="h-8 w-8 text-resume-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Upload & Improve</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your existing resume and get AI-powered improvement suggestions
                </p>
                <Button 
                  variant="outline"
                  className="w-full border-resume-primary text-resume-primary hover:bg-resume-primary hover:text-white"
                  onClick={() => navigate('/upload-resume')}
                >
                  Upload Resume
                </Button>
              </CardContent>
            </Card>
            
            <Card className="group text-center border border-border/50 hover:border-resume-primary/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-resume-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-resume-accent/20 transition-colors">
                  <Layout className="h-8 w-8 text-resume-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Browse Templates</h3>
                <p className="text-muted-foreground mb-6">
                  Explore our professional templates and get inspired
                </p>
                <Button 
                  variant="secondary"
                  className="w-full bg-resume-secondary hover:bg-resume-secondary/80 text-foreground"
                  onClick={() => navigate('/templates')}
                >
                  View Templates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose ResumAI?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you land more interviews
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Zap className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle className="mb-2">AI-Powered</CardTitle>
              <CardDescription>
                Generate professional content in seconds with advanced AI
              </CardDescription>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Upload className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle className="mb-2">Upload & Improve</CardTitle>
              <CardDescription>
                Upload existing resumes and get instant AI improvement suggestions
              </CardDescription>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle className="mb-2">ATS-Optimized</CardTitle>
              <CardDescription>
                Pass applicant tracking systems with optimized keywords
              </CardDescription>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Download className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <CardTitle className="mb-2">Instant Export</CardTitle>
              <CardDescription>
                Download professional PDFs ready for job applications
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">
              Join thousands of job seekers who've landed interviews with ResumAI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "ResumAI helped me create a professional resume in minutes. I got 3 interview calls within a week!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  S
                </div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The AI suggestions were spot-on. My resume now passes ATS systems and looks incredibly professional."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  M
                </div>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-gray-600">Marketing Manager</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Finally, a resume builder that understands what employers want. The templates are beautiful and modern."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  A
                </div>
                <div>
                  <p className="font-semibold">Amanda Rodriguez</p>
                  <p className="text-sm text-gray-600">UX Designer</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works for your career goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <Card className="p-8 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$0</div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>1 professional template</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic AI assistance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>1 PDF export</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>ATS keyword suggestions</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                Get Started Free
              </Button>
            </Card>
            
            {/* Pro Tier */}
            <Card className="p-8 border-2 border-blue-500 relative hover:shadow-xl transition-shadow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">$7<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600">Everything you need to land interviews</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>All 4 premium templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Unlimited AI-powered content</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Unlimited PDF exports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced ATS optimization</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Resume improvement suggestions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={() => navigate('/auth')}
              >
                Start Pro Trial
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Secure & Trusted</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your privacy and data security are our top priorities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Bank-Level Security</h3>
              <p className="text-gray-600">
                Your data is encrypted and protected with enterprise-grade security
              </p>
            </div>
            
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Trusted by Thousands</h3>
              <p className="text-gray-600">
                Join over 10,000+ professionals who trust ResumAI with their careers
              </p>
            </div>
            
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Always Available</h3>
              <p className="text-gray-600">
                24/7 access to your resumes with automatic cloud backup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've accelerated their careers with AI-powered resumes
          </p>
          <Button 
            size="xl"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg"
            onClick={() => user ? navigate('/resume-builder') : navigate('/auth')}
          >
            Start Building Now - It's Free!
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-blue-100 text-sm mt-4">
            No credit card required • Get started in 60 seconds
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;