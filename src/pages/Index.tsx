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
    <div className="relative bg-white rounded-2xl shadow-xl p-5">
      <div className="flex items-start gap-3 mb-4 pb-3.5 border-b border-stone-100">
        <div className="w-10 h-10 bg-[#2d6a4f] rounded-full flex-shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-24 bg-stone-800 rounded-full" />
          <div className="h-2.5 w-16 bg-[#2d6a4f]/50 rounded-full" />
          <div className="flex gap-2">
            <div className="h-2 w-14 bg-stone-200 rounded-full" />
            <div className="h-2 w-10 bg-stone-200 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mb-3.5">
        <div className="h-2.5 w-16 bg-stone-700 rounded-full mb-2" />
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-stone-100 rounded-full" />
          <div className="h-1.5 w-11/12 bg-stone-100 rounded-full" />
        </div>
      </div>
      <div className="mb-3.5">
        <div className="h-2.5 w-20 bg-stone-700 rounded-full mb-2" />
        <div className="space-y-1">
          <div className="flex justify-between">
            <div className="h-2 w-24 bg-stone-600 rounded-full" />
            <div className="h-1.5 w-10 bg-stone-200 rounded-full" />
          </div>
          <div className="h-1.5 w-4/5 bg-stone-100 rounded-full" />
          <div className="h-1.5 w-3/4 bg-stone-100 rounded-full" />
        </div>
      </div>
      <div>
        <div className="h-2.5 w-10 bg-stone-700 rounded-full mb-2" />
        <div className="flex flex-wrap gap-1">
          {['React', 'TypeScript', 'Node.js', 'SQL'].map((s) => (
            <span key={s} className="px-2 py-0.5 bg-[#f0f7f4] text-[#2d6a4f] text-[9px] font-semibold rounded-full border border-[#b7d9c9]">
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
    <div className="min-h-screen bg-[#f7f3ed] dark:bg-[#0e0b08]">
      <NavHeader />

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-3">

        {/* ── Hero Bento ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 bg-white dark:bg-[#1a1510] rounded-3xl p-9 sm:p-11 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 bg-[#f0f7f4] dark:bg-[#1e3528] text-[#2d6a4f] dark:text-[#5aad8a] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 w-fit border border-[#c3ddd2] dark:border-[#2d5040]">
              <Sparkles className="h-3 w-3" />
              AI-Powered Resume Builder
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-4">
              Land your dream job with an{' '}
              <span className="text-[#c05621]">
                AI-crafted resume
              </span>
            </h1>
            <p className="text-base text-stone-500 dark:text-stone-400 leading-relaxed mb-7 max-w-md">
              Create ATS-optimized, interview-winning resumes in minutes. AI writes your bullet points, suggests skills, and tailors content for any role.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <Button
                size="lg"
                className="bg-[#1a1209] hover:bg-[#2a1f10] dark:bg-[#f7f3ed] dark:text-[#1a1209] dark:hover:bg-[#ede8e2] text-white rounded-xl px-7 shadow-sm"
                onClick={() => navigate('/resume-builder')}
              >
                Build My Resume
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-7 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                onClick={() => navigate('/upload-resume')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload & Improve
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-stone-500 dark:text-stone-400">
              {['ATS-Friendly', 'AI-Powered', '4 Pro Templates', 'Free PDF Export'].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[#2d6a4f]" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Mockup tile — deep forest */}
          <div className="bg-[#1c3728] rounded-3xl p-8 flex items-center justify-center min-h-[280px]">
            <div className="w-full max-w-[210px]">
              <ResumeMockup />
            </div>
          </div>
        </div>

        {/* ── Stats Bento ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#1a1209] dark:bg-[#141008] rounded-3xl p-7 text-white">
            <div className="text-5xl font-bold mb-1.5">60s</div>
            <div className="text-stone-500 text-sm">Average build time with AI assistance</div>
          </div>
          <div className="bg-[#c05621] rounded-3xl p-7 text-white">
            <div className="text-5xl font-bold mb-1.5">ATS</div>
            <div className="text-orange-200 text-sm">Optimized for all major tracking systems</div>
          </div>
          <div className="bg-[#2d6a4f] rounded-3xl p-7 text-white">
            <div className="text-5xl font-bold mb-1.5">Free</div>
            <div className="text-emerald-200 text-sm">No account or credit card required</div>
          </div>
        </div>

        {/* ── Features Bento ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* AI Writing – wide dark tile */}
          <div className="lg:col-span-2 bg-[#1a1209] dark:bg-[#141008] rounded-3xl p-8 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-400/15 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-amber-400" />
              </div>
              <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">AI Writing</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Let AI write your resume in seconds</h3>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              Powered by Llama 3.3 70B, Talory generates polished bullet points, skill suggestions, and professional summaries — tailored to your exact role.
            </p>
            <div className="bg-[#0f0b06] rounded-2xl p-4 font-mono text-sm space-y-2">
              <div className="text-[#5aad8a]">✓ "Led migration of legacy system, reducing ops cost by 35%"</div>
              <div className="text-[#5aad8a]">✓ "Architected REST API serving 2M+ daily requests"</div>
              <div className="flex items-center gap-2 text-stone-600">
                <span className="inline-block w-2 h-4 bg-stone-600 rounded-sm animate-pulse" />
                <span>Generating next bullet point...</span>
              </div>
            </div>
          </div>

          {/* ATS tile */}
          <div className="bg-[#f0f7f4] dark:bg-[#162b22] rounded-3xl p-7 flex flex-col">
            <div className="w-11 h-11 bg-[#2d6a4f] rounded-2xl flex items-center justify-center mb-5">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-stone-100">ATS Optimized</h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6 flex-1">
              Built-in keyword analysis and formatting ensures your resume passes applicant tracking systems every time.
            </p>
            <div className="space-y-3">
              {[['Keyword match', '92%', 'w-[92%]'], ['Format score', '98%', 'w-[98%]']].map(([label, val, w]) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-stone-500">{label}</span>
                    <span className="font-bold text-[#2d6a4f]">{val}</span>
                  </div>
                  <div className="h-1.5 bg-[#c3ddd2] dark:bg-[#1e3528] rounded-full">
                    <div className={`h-1.5 bg-[#2d6a4f] ${w} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Small feature tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#fdf6ee] dark:bg-[#221808] rounded-3xl p-7">
            <div className="w-11 h-11 bg-[#c05621] rounded-2xl flex items-center justify-center mb-5">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-stone-900 dark:text-stone-100">4 Pro Templates</h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Professional, Modern, Minimal, and Creative — pick the layout that fits your industry.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1a1510] rounded-3xl p-7">
            <div className="w-11 h-11 bg-[#1a1209] dark:bg-[#f7f3ed] rounded-2xl flex items-center justify-center mb-5">
              <Download className="h-5 w-5 text-white dark:text-[#1a1209]" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-stone-900 dark:text-stone-100">Free PDF Export</h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Download a clean, print-ready PDF that looks great in any job application — no watermarks.
            </p>
          </div>
          <div className="bg-[#f0f7f4] dark:bg-[#162b22] rounded-3xl p-7">
            <div className="w-11 h-11 bg-[#2d6a4f] rounded-2xl flex items-center justify-center mb-5">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-stone-900 dark:text-stone-100">Upload & Improve</h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
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
            <div key={n} className="bg-white dark:bg-[#1a1510] rounded-3xl p-7">
              <div className="text-6xl font-bold text-stone-100 dark:text-[#2a1f10] mb-4 leading-none">{n}</div>
              <div className="w-10 h-10 bg-stone-100 dark:bg-[#2a1f10] rounded-xl flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-stone-600 dark:text-stone-400" />
              </div>
              <h3 className="font-bold text-base mb-2 text-stone-900 dark:text-stone-100">{title}</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Testimonials Bento ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'Sarah J.', role: 'Software Engineer', init: 'S', bg: 'bg-[#2d6a4f]', text: '"Talory helped me create a professional resume in minutes. I got 3 interview calls within a week!"' },
            { name: 'Michael C.', role: 'Marketing Manager', init: 'M', bg: 'bg-[#c05621]', text: '"The AI suggestions were spot-on. My resume now passes ATS systems and looks incredibly professional."' },
            { name: 'Amanda R.', role: 'UX Designer', init: 'A', bg: 'bg-[#1a1209]', text: '"Finally a resume builder that understands what employers want. The templates are beautiful and modern."' },
          ].map(({ name, role, init, bg, text }) => (
            <div key={name} className="bg-white dark:bg-[#1a1510] rounded-3xl p-7 flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />)}
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed flex-1 mb-5">{text}</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${bg} rounded-full flex items-center justify-center text-white text-sm font-bold`}>{init}</div>
                <div>
                  <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">{name}</div>
                  <div className="text-xs text-stone-400">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA Bento ── */}
        <div className="bg-[#1a1209] dark:bg-[#141008] rounded-3xl p-10 sm:p-14 text-center text-white">
          <div className="inline-flex items-center gap-1.5 bg-white/8 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-white/10">
            <Sparkles className="h-3 w-3" />
            100% Free — No Account Required
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Ready to land your dream job?</h2>
          <p className="text-stone-400 text-base mb-8 max-w-md mx-auto">
            Build a stunning, ATS-optimized resume in minutes and start getting more interviews.
          </p>
          <Button
            size="lg"
            className="bg-white text-[#1a1209] hover:bg-[#f7f3ed] px-9 rounded-xl font-semibold shadow-lg"
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
