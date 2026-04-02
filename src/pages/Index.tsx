import React from 'react';
import Footer from '@/components/Footer';
import { NavHeader } from '@/components/NavHeader';
import { Button } from "@/components/ui/button";
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

const ResumeMockup = () => (
  <div className="relative select-none">
    <div className="absolute inset-0 translate-x-3 translate-y-3 bg-white/10 rounded-2xl rotate-2" />
    <div className="relative bg-white rounded-2xl shadow-2xl p-5">
      <div className="flex items-start gap-3 mb-4 pb-3.5 border-b border-gray-100">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex-shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-24 bg-gray-800 rounded-full" />
          <div className="h-2.5 w-16 bg-blue-400/60 rounded-full" />
          <div className="flex gap-2">
            <div className="h-2 w-14 bg-gray-200 rounded-full" />
            <div className="h-2 w-10 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mb-3.5">
        <div className="h-2.5 w-16 bg-gray-700 rounded-full mb-2" />
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-gray-100 rounded-full" />
          <div className="h-1.5 w-11/12 bg-gray-100 rounded-full" />
        </div>
      </div>
      <div className="mb-3.5">
        <div className="h-2.5 w-20 bg-gray-700 rounded-full mb-2" />
        <div className="space-y-1">
          <div className="flex justify-between">
            <div className="h-2 w-24 bg-gray-600 rounded-full" />
            <div className="h-1.5 w-10 bg-gray-200 rounded-full" />
          </div>
          <div className="h-1.5 w-4/5 bg-gray-100 rounded-full" />
          <div className="h-1.5 w-3/4 bg-gray-100 rounded-full" />
        </div>
      </div>
      <div>
        <div className="h-2.5 w-10 bg-gray-700 rounded-full mb-2" />
        <div className="flex flex-wrap gap-1">
          {['React', 'TypeScript', 'Node.js', 'SQL'].map((s) => (
            <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-semibold rounded-full border border-blue-200">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-zinc-950">
      <NavHeader />

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-3">

        {/* ── Hero Bento ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Hero text tile */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-9 sm:p-11 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 w-fit border border-blue-100 dark:border-blue-900">
              <Sparkles className="h-3 w-3" />
              AI-Powered Resume Builder
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-4">
              Land your dream job with an{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-crafted resume
              </span>
            </h1>
            <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed mb-7 max-w-md">
              Create ATS-optimized, interview-winning resumes in minutes. AI writes your bullet points, suggests skills, and tailors content for any role.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <Button
                size="lg"
                className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white rounded-xl px-7 shadow-sm"
                onClick={() => navigate('/resume-builder')}
              >
                Build My Resume
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-7 border-zinc-200 dark:border-zinc-700"
                onClick={() => navigate('/upload-resume')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload & Improve
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
              {['ATS-Friendly', 'AI-Powered', '4 Pro Templates', 'Free PDF Export'].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Mockup tile */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 flex items-center justify-center min-h-[280px]">
            <div className="w-full max-w-[210px]">
              <ResumeMockup />
            </div>
          </div>
        </div>

        {/* ── Stats Bento ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-zinc-900 dark:bg-zinc-800 rounded-3xl p-7 text-white">
            <div className="text-5xl font-bold mb-1.5">60s</div>
            <div className="text-zinc-400 text-sm">Average build time with AI assistance</div>
          </div>
          <div className="bg-blue-600 rounded-3xl p-7 text-white">
            <div className="text-5xl font-bold mb-1.5">ATS</div>
            <div className="text-blue-200 text-sm">Optimized for all major tracking systems</div>
          </div>
          <div className="bg-emerald-500 rounded-3xl p-7 text-white">
            <div className="text-5xl font-bold mb-1.5">Free</div>
            <div className="text-emerald-100 text-sm">No account or credit card required</div>
          </div>
        </div>

        {/* ── Features Bento ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* AI Writing – wide dark tile */}
          <div className="lg:col-span-2 bg-zinc-900 dark:bg-zinc-800 rounded-3xl p-8 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-yellow-400" />
              </div>
              <span className="text-yellow-400 text-sm font-semibold tracking-wide uppercase text-xs">AI Writing</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Let AI write your resume in seconds</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Powered by Llama 3.3 70B, ResumAI generates polished bullet points, skill suggestions, and professional summaries — tailored to your exact role.
            </p>
            <div className="bg-zinc-800 dark:bg-zinc-700/60 rounded-2xl p-4 font-mono text-sm space-y-2">
              <div className="text-emerald-400">✓ "Led migration of legacy system, reducing ops cost by 35%"</div>
              <div className="text-emerald-400">✓ "Architected REST API serving 2M+ daily requests"</div>
              <div className="flex items-center gap-2 text-zinc-500">
                <span className="inline-block w-2 h-4 bg-zinc-500 rounded-sm animate-pulse" />
                <span>Generating next bullet point...</span>
              </div>
            </div>
          </div>

          {/* ATS tile */}
          <div className="bg-blue-50 dark:bg-blue-950/60 rounded-3xl p-7 flex flex-col">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center mb-5">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">ATS Optimized</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
              Built-in keyword analysis and formatting ensures your resume passes applicant tracking systems every time.
            </p>
            <div className="space-y-3">
              {[['Keyword match', '92%', 'bg-blue-600', 'w-[92%]'], ['Format score', '98%', 'bg-blue-500', 'w-[98%]']].map(([label, val, bar, w]) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
                    <span className="font-bold text-blue-600">{val}</span>
                  </div>
                  <div className="h-1.5 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <div className={`h-1.5 ${bar} ${w} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Small feature tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-purple-50 dark:bg-purple-950/60 rounded-3xl p-7">
            <div className="w-11 h-11 bg-purple-600 rounded-2xl flex items-center justify-center mb-5">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1.5">4 Pro Templates</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Professional, Modern, Minimal, and Creative — pick the layout that fits your industry.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-7">
            <div className="w-11 h-11 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center mb-5">
              <Download className="h-5 w-5 text-white dark:text-zinc-900" />
            </div>
            <h3 className="font-bold text-lg mb-1.5">Free PDF Export</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Download a clean, print-ready PDF that looks great in any job application — no watermarks.
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/60 rounded-3xl p-7">
            <div className="w-11 h-11 bg-orange-500 rounded-2xl flex items-center justify-center mb-5">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1.5">Upload & Improve</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Paste your existing resume and get instant AI suggestions to sharpen and optimize it.
            </p>
          </div>
        </div>

        {/* ── How It Works ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { n: '01', icon: FileText, title: 'Choose a Template', desc: 'Pick from four professionally designed resume layouts. Each is ATS-friendly and fully customizable.' },
            { n: '02', icon: Sparkles, title: 'Fill & Let AI Write', desc: 'Enter your experience — AI generates compelling bullet points, skills, and a professional summary.' },
            { n: '03', icon: Download, title: 'Export & Apply', desc: 'Preview your polished resume, then download a print-ready PDF and start applying.' },
          ].map(({ n, icon: Icon, title, desc }) => (
            <div key={n} className="bg-white dark:bg-zinc-900 rounded-3xl p-7">
              <div className="text-6xl font-bold text-zinc-100 dark:text-zinc-800 mb-4 leading-none">{n}</div>
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h3 className="font-bold text-base mb-2">{title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Testimonials Bento ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'Sarah J.', role: 'Software Engineer', init: 'S', color: 'bg-blue-500', text: '"ResumAI helped me create a professional resume in minutes. I got 3 interview calls within a week!"' },
            { name: 'Michael C.', role: 'Marketing Manager', init: 'M', color: 'bg-emerald-500', text: '"The AI suggestions were spot-on. My resume now passes ATS systems and looks incredibly professional."' },
            { name: 'Amanda R.', role: 'UX Designer', init: 'A', color: 'bg-purple-500', text: '"Finally a resume builder that understands what employers want. The templates are beautiful and modern."' },
          ].map(({ name, role, init, color, text }) => (
            <div key={name} className="bg-white dark:bg-zinc-900 rounded-3xl p-7 flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1 mb-5">{text}</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>{init}</div>
                <div>
                  <div className="text-sm font-semibold">{name}</div>
                  <div className="text-xs text-zinc-400">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA Bento ── */}
        <div className="bg-zinc-900 dark:bg-zinc-800 rounded-3xl p-10 sm:p-14 text-center text-white">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-white/10">
            <Sparkles className="h-3 w-3" />
            100% Free — No Account Required
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Ready to land your dream job?</h2>
          <p className="text-zinc-400 text-base mb-8 max-w-md mx-auto">
            Build a stunning, ATS-optimized resume in minutes and start getting more interviews.
          </p>
          <Button
            size="lg"
            className="bg-white text-zinc-900 hover:bg-zinc-100 px-9 rounded-xl font-semibold shadow-lg"
            onClick={() => navigate('/resume-builder')}
          >
            Build My Resume — It's Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

      </main>

      <div className="pb-4" />
      <Footer />
    </div>
  );
};

export default Index;
