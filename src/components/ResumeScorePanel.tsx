import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, Zap, TrendingUp, FileText, Target } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { scoreResume, type ResumeScoreResult, type ScoreCategory } from '@/services/resumeAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CATEGORY_META = [
  { key: 'content_quality', label: 'Content Quality', icon: FileText, max: 25 },
  { key: 'ats_compatibility', label: 'ATS Compatibility', icon: Target, max: 25 },
  { key: 'impact_metrics', label: 'Impact & Metrics', icon: TrendingUp, max: 25 },
  { key: 'completeness', label: 'Completeness', icon: CheckCircle2, max: 25 },
] as const;

function labelColor(label: string) {
  if (label === 'Excellent') return 'bg-green-100 text-green-800 border-green-200';
  if (label === 'Good') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (label === 'Fair') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-red-100 text-red-800 border-red-200';
}

function scoreColor(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 80) return 'text-green-700';
  if (pct >= 56) return 'text-blue-700';
  if (pct >= 32) return 'text-yellow-700';
  return 'text-red-600';
}

function progressColor(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 80) return '[&>div]:bg-green-500';
  if (pct >= 56) return '[&>div]:bg-blue-500';
  if (pct >= 32) return '[&>div]:bg-yellow-500';
  return '[&>div]:bg-red-500';
}

function totalColor(score: number) {
  if (score >= 80) return 'text-green-700';
  if (score >= 60) return 'text-blue-700';
  if (score >= 40) return 'text-yellow-700';
  return 'text-red-600';
}

export const ResumeScorePanel = () => {
  const { resumeData } = useResumeContext();
  const [isScoring, setIsScoring] = useState(false);
  const [result, setResult] = useState<ResumeScoreResult | null>(null);

  const buildPayload = () => {
    const pi = resumeData.personalInfo;
    const fullName = [pi?.firstName, pi?.lastName].filter(Boolean).join(' ');

    const education = (resumeData.education || [])
      .map(e => `${e.degree} in ${e.fieldOfStudy} — ${e.school} (${e.graduationDate || ''})${e.gpa ? `, GPA ${e.gpa}` : ''}`)
      .join('\n');

    const workExperience = (resumeData.workExperience || [])
      .map(w => `${w.position} at ${w.company} (${w.startDate}–${w.endDate || 'Present'}): ${w.description}`)
      .join('\n');

    const skills = (resumeData.skills || []).map(s => s.name).join(', ');

    const projects = (resumeData.projects || [])
      .map(p => `${p.name}: ${p.description}`)
      .join('\n');

    const certifications = (resumeData.certifications || [])
      .map(c => `${c.name} — ${c.issuer} (${c.date})`)
      .join('\n');

    return {
      fullName: fullName || 'Student',
      summary: pi?.summary || '',
      education,
      workExperience,
      skills,
      projects,
      certifications,
    };
  };

  const handleScore = async () => {
    setIsScoring(true);
    try {
      const payload = buildPayload();
      const res = await scoreResume(payload);
      if (res.total_score === 0 && !res.overall_verdict) {
        toast.error('Could not score resume. Please try again.');
      } else {
        setResult(res);
        toast.success('Resume scored!');
      }
    } catch {
      toast.error('Failed to score resume. Please try again.');
    } finally {
      setIsScoring(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {!result ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-[#2d6a4f]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Your Resume Score</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
              AI will evaluate your resume across 4 categories — Content, ATS compatibility, Impact, and Completeness — and give you specific feedback on each.
            </p>
            <Button
              onClick={handleScore}
              disabled={isScoring}
              className="bg-[#2d6a4f] hover:bg-[#255c43] text-white px-8"
              data-testid="button-score-resume"
            >
              {isScoring ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Scoring your resume…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Score My Resume</>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Total Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center shrink-0">
                  <div className={cn("text-6xl font-bold", totalColor(result.total_score))}>
                    {result.total_score}
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">out of 100</div>
                </div>
                <div className="flex-1 w-full">
                  <Progress value={result.total_score} className={cn("h-3 mb-3", progressColor(result.total_score, 100))} />
                  <p className="text-sm font-medium text-foreground">{result.overall_verdict}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <div className="grid sm:grid-cols-2 gap-4">
            {CATEGORY_META.map(({ key, label, icon: Icon }) => {
              const cat = result.categories[key] as ScoreCategory;
              return (
                <Card key={key} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f7f3ed] flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-[#2d6a4f]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{label}</span>
                        <Badge variant="outline" className={cn("text-xs border", labelColor(cat.label))}>
                          {cat.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-lg font-bold", scoreColor(cat.score, 25))}>
                          {cat.score}
                        </span>
                        <span className="text-muted-foreground text-xs">/25</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={(cat.score / 25) * 100} className={cn("h-1.5 mb-2", progressColor(cat.score, 25))} />
                  <p className="text-xs text-muted-foreground leading-relaxed">{cat.feedback}</p>
                </Card>
              );
            })}
          </div>

          {/* Strengths + Fixes */}
          <div className="grid sm:grid-cols-2 gap-4">
            {result.top_strengths.length > 0 && (
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm text-green-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />Top Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <ul className="space-y-2">
                    {result.top_strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {result.top_fixes.length > 0 && (
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm text-[#c05621] flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />Quick Fixes
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <ul className="space-y-2">
                    {result.top_fixes.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-[#c05621] mt-0.5">→</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResult(null)}
              className="text-xs"
            >
              Score again
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
