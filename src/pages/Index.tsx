import React from 'react';
import Footer from '@/components/Footer';
import { NavHeader } from '@/components/NavHeader';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Zap,
  Download,
  Star,
  CheckCircle,
  ArrowRight,
  Upload,
  Sparkles,
  Layout,
  Target,
  Palette,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const ResumeMockup = () => (
  <div className="relative select-none">
    <div className="absolute inset-0 translate-x-5 translate-y-5 bg-blue-200/50 dark:bg-blue-900/30 rounded-2xl rotate-3" />
    <div className="absolute inset-0 translate-x-2 translate-y-2 bg-purple-100/60 dark:bg-purple-900/20 rounded-2xl rotate-1" />
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-start gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex-shrink-0" />
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="h-3.5 w-28 bg-gray-800 dark:bg-gray-200 rounded-full" />
          <div className="h-2.5 w-20 bg-blue-400/60 rounded-full" />
          <div className="flex gap-2 pt-0.5">
            <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="h-2.5 w-20 bg-gray-700 dark:bg-gray-300 rounded-full mb-2.5" />
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full" />
          <div className="h-2 w-11/12 bg-gray-100 dark:bg-gray-800 rounded-full" />
          <div className="h-2 w-4/5 bg-gray-100 dark:bg-gray-800 rounded-full" />
        </div>
      </div>
      <div className="mb-4">
        <div className="h-2.5 w-24 bg-gray-700 dark:bg-gray-300 rounded-full mb-2.5" />
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <div className="h-2.5 w-32 bg-gray-600 dark:bg-gray-400 rounded-full" />
            <div className="h-2 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full" />
          <div className="h-2 w-4/5 bg-gray-100 dark:bg-gray-800 rounded-full" />
          <div className="h-2 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-full" />
        </div>
      </div>
      <div>
        <div className="h-2.5 w-12 bg-gray-700 dark:bg-gray-300 rounded-full mb-2.5" />
        <div className="flex flex-wrap gap-1.5">
          {['React', 'TypeScript', 'Node.js', 'SQL', 'Python'].map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-medium rounded-full border border-blue-200 dark:border-blue-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute -top-3.5 -right-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[11px] px-3 py-1.5 rounded-full shadow-lg font-semibold flex items-center gap-1.5">
        <Sparkles className="h-3 w-3" />
        AI Enhanced
      </div>
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-background to-purple-50/40 dark:from-blue-950/20 dark:via-background dark:to-purple-950/10" />
        <div className="absolute -top-40 right-0 w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <Badge className="mb-5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 font-medium">
                <Sparkles className="h-3 w-3 mr-1.5" />
                AI-Powered Resume Builder
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-5">
                Land your dream job with an{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-crafted resume
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Create ATS-optimized resumes in minutes. AI writes your bullet points, suggests the right skills, and tailors your content for any role.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                  onClick={() => navigate('/resume-builder')}
                >
                  Build My Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6"
                  onClick={() => navigate('/upload-resume')}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Improve
                </Button>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                {['ATS-Friendly', 'AI-Powered', '4 Pro Templates', 'Free PDF Export'].map((feat) => (
                  <div key={feat} className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center">
              <div className="w-72 xl:w-80">
                <ResumeMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three ways */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Three ways to get started</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Pick the approach that works best for you — all powered by AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: FileText,
                color: 'text-blue-600',
                bg: 'bg-blue-50 dark:bg-blue-950/50',
                hoverBg: 'group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50',
                hoverBorder: 'hover:border-blue-200 dark:hover:border-blue-800',
                btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
                title: 'Build from Scratch',
                desc: 'Follow a guided flow with AI writing your bullet points, skills, and summary as you go.',
                btnLabel: 'Start Building',
                href: '/resume-builder',
              },
              {
                icon: Upload,
                color: 'text-purple-600',
                bg: 'bg-purple-50 dark:bg-purple-950/50',
                hoverBg: 'group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50',
                hoverBorder: 'hover:border-purple-200 dark:hover:border-purple-800',
                btnClass: 'border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300',
                title: 'Upload & Improve',
                desc: 'Paste your existing resume and get instant AI suggestions to optimize it for any job.',
                btnLabel: 'Upload Resume',
                href: '/upload-resume',
                outline: true,
              },
              {
                icon: Layout,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 dark:bg-emerald-950/50',
                hoverBg: 'group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50',
                hoverBorder: 'hover:border-emerald-200 dark:hover:border-emerald-800',
                btnClass: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300',
                title: 'Browse Templates',
                desc: 'Explore professionally designed layouts — Professional, Modern, Minimal, and Creative.',
                btnLabel: 'View Templates',
                href: '/templates',
                outline: true,
              },
            ].map(({ icon: Icon, color, bg, hoverBg, hoverBorder, btnClass, title, desc, btnLabel, href, outline }) => (
              <Card
                key={title}
                className={`group border border-border/50 ${hoverBorder} hover:shadow-md transition-all duration-200`}
              >
                <CardContent className="p-7">
                  <div className={`w-12 h-12 ${bg} ${hoverBg} rounded-xl flex items-center justify-center mb-5 transition-colors`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{desc}</p>
                  <Button
                    className={`w-full ${btnClass}`}
                    variant={outline ? 'outline' : 'default'}
                    onClick={() => navigate(href)}
                  >
                    {btnLabel}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why ResumAI?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need to create a resume that gets noticed
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/50', title: 'Instant AI Writing', desc: 'Generate professional bullet points and summaries powered by Llama 3.3 70B.' },
              { icon: Target, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/50', title: 'ATS Optimized', desc: 'Built-in keyword analysis so your resume passes applicant tracking systems.' },
              { icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/50', title: '4 Pro Templates', desc: 'Professional, Modern, Minimal, and Creative — pick what fits your style.' },
              { icon: Download, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/50', title: 'Free PDF Export', desc: 'Download a clean, print-ready PDF ready for any job application.' },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <Card key={title} className="p-6 border border-border/50 hover:shadow-md transition-shadow text-center">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Loved by job seekers</h2>
            <p className="text-muted-foreground">Join thousands who've landed interviews with ResumAI</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Sarah J.', role: 'Software Engineer', initial: 'S', color: 'bg-blue-500', text: '"ResumAI helped me create a professional resume in minutes. I got 3 interview calls within a week!"' },
              { name: 'Michael C.', role: 'Marketing Manager', initial: 'M', color: 'bg-emerald-500', text: '"The AI suggestions were spot-on. My resume now passes ATS systems and looks incredibly professional."' },
              { name: 'Amanda R.', role: 'UX Designer', initial: 'A', color: 'bg-purple-500', text: '"Finally a resume builder that understands what employers want. The templates are beautiful and modern."' },
            ].map(({ name, role, initial, color, text }) => (
              <Card key={name} className="p-6 border border-border/50">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{text}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${color} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to land your dream job?</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Build a stunning, ATS-optimized resume in minutes — completely free.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 font-semibold shadow-lg"
            onClick={() => navigate('/resume-builder')}
          >
            Build My Resume — It's Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
