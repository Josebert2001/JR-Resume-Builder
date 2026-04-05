import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sparkles, Loader2, CheckCircle2, Circle, ChevronDown, Zap, Trophy, ShieldCheck, AlertCircle } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { buildFullResume, type OrchestratorProgress, type OrchestratorResult } from '@/services/resumeOrchestrator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PROGRESS_STEPS = [
  'Reading your profile...',
  'Enhancing each section with AI...',
  'Writing your summary & scoring resume...',
  'Assembling your final resume...',
  'Running quality checks...',
  'Your resume is ready!',
];

function gradeColor(grade: string) {
  if (grade === 'A') return 'bg-green-100 text-green-800 border-green-300';
  if (grade === 'B') return 'bg-blue-100 text-blue-800 border-blue-300';
  if (grade === 'C') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  if (grade === 'D') return 'bg-orange-100 text-orange-800 border-orange-300';
  return 'bg-red-100 text-red-800 border-red-300';
}

function atsColor(rating: string) {
  if (rating === 'Excellent') return 'text-green-700 bg-green-50 border-green-200';
  if (rating === 'Good') return 'text-blue-700 bg-blue-50 border-blue-200';
  if (rating === 'Fair') return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

export const GenerateResumePanel = ({ onViewResume }: { onViewResume?: () => void }) => {
  const { resumeData, updateResumeData } = useResumeContext();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<OrchestratorProgress | null>(null);
  const [result, setResult] = useState<OrchestratorResult | null>(null);
  const [includeNysc, setIncludeNysc] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [optionsOpen, setOptionsOpen] = useState(false);

  const hasEducation = (resumeData.education || []).length > 0;
  const hasAnyData = hasEducation || !!(resumeData.personalInfo?.firstName);

  const handleGenerate = async () => {
    if (!hasAnyData) {
      toast.error('Please fill in at least your personal info and education before generating.');
      return;
    }
    setIsRunning(true);
    setResult(null);
    setProgress({ step: 1, message: PROGRESS_STEPS[0], percent: 5 });

    try {
      const res = await buildFullResume(
        resumeData,
        (p: OrchestratorProgress) => setProgress(p),
        { includeNysc, jobDescription: jobDescription.trim() || undefined }
      );

      setResult(res);

      if (res.success && Object.keys(res.updates).length > 0) {
        updateResumeData(res.updates);
        toast.success(`Resume enhanced! ${res.appliedSections.length} sections updated.`);
      } else if (!res.success) {
        toast.error(res.error || 'Generation failed. Please try again.');
      }
    } catch (err) {
      console.error('[GenerateResumePanel] error:', err);
      toast.error('Something went wrong. Please try again.');
      setResult({ success: false, updates: {}, appliedSections: [], error: 'Unexpected error' });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5" data-testid="generate-resume-panel">
      {/* Hero card */}
      <Card className="border-2 border-[#2d6a4f]/20 bg-white overflow-hidden">
        <CardContent className="pt-6 pb-6 px-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#2d6a4f] flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Generate Complete Resume with AI</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enhances every section at once — summary, experience bullets, project descriptions, skills — in about 15 seconds.
              </p>
            </div>
          </div>

          {/* Options collapsible */}
          {!isRunning && !result && (
            <Collapsible open={optionsOpen} onOpenChange={setOptionsOpen} className="mb-5">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-muted-foreground h-8 border border-dashed border-muted-foreground/30 rounded-lg px-3">
                  <span>Options (optional)</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", optionsOpen && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-4 px-1">
                {hasEducation && (
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Include NYSC formatting</Label>
                      <p className="text-xs text-muted-foreground">Formats education for Nigerian employers</p>
                    </div>
                    <Switch
                      checked={includeNysc}
                      onCheckedChange={setIncludeNysc}
                      data-testid="switch-include-nysc"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Job description (optional)</Label>
                  <p className="text-xs text-muted-foreground">Paste a JD to tailor your resume for a specific role</p>
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    className="min-h-[80px] text-sm"
                    data-testid="textarea-job-description-auto"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Generate button */}
          {!result && (
            <Button
              onClick={handleGenerate}
              disabled={isRunning || !hasAnyData}
              className="w-full bg-[#2d6a4f] hover:bg-[#255c43] text-white h-11 text-sm font-semibold"
              data-testid="button-generate-full-resume"
            >
              {isRunning ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Generate Now</>
              )}
            </Button>
          )}

          {!hasAnyData && !isRunning && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Fill in your personal info and education first to unlock this feature.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Progress tracker */}
      {(isRunning || (result && !result.success)) && (
        <Card className="border border-[#e8ddd0]">
          <CardContent className="pt-5 pb-5 px-5 space-y-4">
            <div className="space-y-2">
              {PROGRESS_STEPS.map((msg, i) => {
                const stepNum = i + 1;
                const currentStep = progress?.step ?? 0;
                const isDone = stepNum < currentStep || (!isRunning && stepNum <= currentStep);
                const isActive = stepNum === currentStep && isRunning;
                const isPending = stepNum > currentStep;
                return (
                  <div key={i} className={cn("flex items-center gap-3 transition-opacity", isPending && "opacity-40")}>
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-[#2d6a4f] shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 text-[#c05621] animate-spin shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={cn(
                      "text-sm",
                      isDone && "text-[#2d6a4f] font-medium",
                      isActive && "text-[#c05621] font-semibold",
                      isPending && "text-muted-foreground"
                    )}>
                      {msg}
                    </span>
                  </div>
                );
              })}
            </div>
            <Progress
              value={progress?.percent ?? 0}
              className="h-2 [&>div]:bg-[#2d6a4f] [&>div]:transition-all [&>div]:duration-700"
            />
          </CardContent>
        </Card>
      )}

      {/* Success result */}
      {result?.success && (
        <Card className="border-2 border-[#2d6a4f]/30 bg-[#f7f3ed]">
          <CardContent className="pt-5 pb-5 px-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-5 w-5 text-[#2d6a4f]" />
              <h3 className="font-semibold text-[#2d6a4f]">Resume generation complete!</h3>
            </div>

            {/* Score + ATS row */}
            <div className="flex flex-wrap gap-2">
              {result.grade && (
                <Badge variant="outline" className={cn("text-sm px-3 py-1 font-bold", gradeColor(result.grade))}>
                  <Trophy className="h-3.5 w-3.5 mr-1" />
                  Grade {result.grade} {result.score ? `(${result.score}/100)` : ''}
                </Badge>
              )}
              {result.atsRating && (
                <Badge variant="outline" className={cn("text-sm px-3 py-1", atsColor(result.atsRating))}>
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                  ATS: {result.atsRating}
                </Badge>
              )}
            </div>

            {/* Applied sections */}
            {result.appliedSections.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Applied to</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.appliedSections.map(sec => (
                    <span key={sec} className="inline-flex items-center gap-1 text-xs bg-[#e8f5ee] text-[#2d6a4f] border border-[#b6d9c4] rounded-full px-2.5 py-0.5 font-medium">
                      <CheckCircle2 className="h-3 w-3" />{sec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Consistency tip */}
            {result.consistencyTip && (
              <div className="flex items-start gap-2 bg-[#fff9f0] border border-[#f5d9b3] rounded-xl p-3">
                <AlertCircle className="h-4 w-4 text-[#c05621] shrink-0 mt-0.5" />
                <p className="text-xs text-[#7c4209] leading-relaxed">{result.consistencyTip}</p>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              {onViewResume && (
                <Button
                  onClick={onViewResume}
                  className="flex-1 bg-[#2d6a4f] hover:bg-[#255c43] text-white h-9 text-sm"
                  data-testid="button-view-resume-after-generate"
                >
                  View Resume
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => { setResult(null); setProgress(null); }}
                className="h-9 text-sm px-4"
                data-testid="button-regenerate"
              >
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {result && !result.success && (
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-4 px-4 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Generation failed</p>
              <p className="text-xs text-red-600 mt-0.5">{result.error || 'Please try again.'}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setResult(null); setProgress(null); }}
                className="mt-2 h-7 text-xs border-red-300 text-red-700"
              >
                Try again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
