import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, Zap, FileText, Target, TrendingUp, GraduationCap, Award, Shield } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { scoreResume, type ResumeScoreResult, type SectionScore } from '@/services/resumeAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { key: 'summary', label: 'Summary', icon: FileText, max: 20 },
  { key: 'experience', label: 'Experience', icon: TrendingUp, max: 25 },
  { key: 'projects', label: 'Projects', icon: Zap, max: 20 },
  { key: 'skills', label: 'Skills', icon: Target, max: 15 },
  { key: 'education', label: 'Education', icon: GraduationCap, max: 10 },
  { key: 'certifications', label: 'Certifications', icon: Award, max: 5 },
  { key: 'ats', label: 'ATS', icon: Shield, max: 5 },
] as const;

function gradeColor(grade: string) {
  if (grade === 'A') return 'text-green-700';
  if (grade === 'B') return 'text-blue-700';
  if (grade === 'C') return 'text-yellow-700';
  if (grade === 'D') return 'text-orange-600';
  return 'text-red-600';
}

function gradeRing(grade: string) {
  if (grade === 'A') return 'ring-green-400 bg-green-50';
  if (grade === 'B') return 'ring-blue-400 bg-blue-50';
  if (grade === 'C') return 'ring-yellow-400 bg-yellow-50';
  if (grade === 'D') return 'ring-orange-400 bg-orange-50';
  return 'ring-red-400 bg-red-50';
}

function statusBadge(status: string) {
  if (status === 'strong') return 'bg-green-50 text-green-700 border-green-200';
  if (status === 'good') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'fair') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  return 'bg-red-50 text-red-600 border-red-200';
}

function progressBar(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 80) return '[&>div]:bg-green-500';
  if (pct >= 56) return '[&>div]:bg-blue-500';
  if (pct >= 32) return '[&>div]:bg-yellow-500';
  return '[&>div]:bg-red-400';
}

function priorityColor(priority: string) {
  if (priority === 'high') return 'text-red-600 bg-red-50 border-red-200';
  if (priority === 'medium') return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-blue-600 bg-blue-50 border-blue-200';
}

export const ResumeScorePanel = () => {
  const { resumeData } = useResumeContext();
  const [isScoring, setIsScoring] = useState(false);
  const [result, setResult] = useState<ResumeScoreResult | null>(null);

  const buildPayload = () => {
    const pi = resumeData.personalInfo;
    const fullName = [pi?.firstName, pi?.lastName].filter(Boolean).join(' ');

    const education = (resumeData.education || [])
      .map(e => `${e.degree} in ${e.fieldOfStudy} — ${e.school}${e.graduationDate ? ` (${e.graduationDate})` : ''}${e.gpa ? `, GPA ${e.gpa}` : ''}\n${e.description || ''}`)
      .join('\n');

    const workExperience = (resumeData.workExperience || [])
      .map(w => `${w.position} at ${w.company} (${w.startDate}–${w.endDate || 'Present'}):\n${w.description}`)
      .join('\n\n');

    const skills = (resumeData.skills || []).map(s => s.name).join(', ');

    const projects = (resumeData.projects || [])
      .map(p => `${p.name}: ${p.description}${p.technologies ? ` [${p.technologies}]` : ''}`)
      .join('\n');

    const certifications = (resumeData.certifications || [])
      .map(c => `${c.name} — ${c.issuer} (${c.date})`)
      .join('\n');

    return { fullName: fullName || 'Student', summary: pi?.summary || '', education, workExperience, skills, projects, certifications };
  };

  const handleScore = async () => {
    setIsScoring(true);
    try {
      const res = await scoreResume(buildPayload());
      if (res.total_score === 0 && !res.grade_message) {
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
            <h3 className="text-xl font-semibold mb-2">Score My Resume</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
              AI evaluates your resume across 7 sections — Summary, Experience, Projects, Skills, Education, Certifications, and ATS. Get a grade (A–F) with specific fixes for each section.
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
          {/* Grade + Total Score */}
          <Card>
            <CardContent className="pt-6 pb-5">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className={cn("w-20 h-20 rounded-full ring-4 flex items-center justify-center shrink-0", gradeRing(result.grade))}>
                  <span className={cn("text-4xl font-bold", gradeColor(result.grade))}>{result.grade}</span>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start mb-1">
                    <span className={cn("text-3xl font-bold", gradeColor(result.grade))}>{result.total_score}</span>
                    <span className="text-muted-foreground text-sm">/ 100</span>
                  </div>
                  <Progress value={result.total_score} className={cn("h-2.5 mb-3", progressBar(result.total_score, 100))} />
                  <p className="text-sm text-foreground leading-relaxed">{result.grade_message}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Scores */}
          <div className="grid sm:grid-cols-2 gap-3">
            {SECTIONS.map(({ key, label, icon: Icon }) => {
              const sect = result.sections[key] as SectionScore;
              return (
                <Card key={key} className="p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-7 h-7 rounded-md bg-[#f7f3ed] flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-[#2d6a4f]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{label}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs font-bold">{sect.score}<span className="text-muted-foreground font-normal">/{sect.max}</span></span>
                          <Badge variant="outline" className={cn("text-xs border capitalize", statusBadge(sect.status))}>
                            {sect.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Progress value={(sect.score / sect.max) * 100} className={cn("h-1.5 mb-2", progressBar(sect.score, sect.max))} />
                  {sect.fix && <p className="text-xs text-muted-foreground leading-relaxed">{sect.fix}</p>}
                </Card>
              );
            })}
          </div>

          {/* Top Wins */}
          {result.top_wins.length > 0 && (
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm text-green-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />What's Already Strong
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ul className="space-y-1.5">
                  {result.top_wins.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Top Fixes table */}
          {result.top_fixes.length > 0 && (
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm text-[#c05621] flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />Priority Fixes
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2">
                  {result.top_fixes.map((f, i) => (
                    <div key={i} className={cn("flex items-start gap-3 p-2.5 rounded-lg border", priorityColor(f.priority))}>
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <Badge variant="outline" className={cn("text-xs border capitalize self-start", priorityColor(f.priority))}>
                          {f.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{f.section}</span>
                      </div>
                      <div className="flex-1 text-sm">{f.fix}</div>
                      {f.score_impact && (
                        <span className="text-xs font-mono text-green-700 shrink-0">{f.score_impact}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ATS Risks */}
          {result.ats_risks.length > 0 && (
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-red-500" />ATS Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ul className="space-y-1.5">
                  {result.ats_risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <span className="mt-0.5 shrink-0">⚠</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setResult(null)}>
              Score again
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
