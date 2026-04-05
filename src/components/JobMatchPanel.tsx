import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { matchJobDescription, type JobMatchResult } from '@/services/resumeAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function scoreLabel(score: number) {
  if (score >= 80) return { color: 'text-green-700', bg: 'bg-green-50 border-green-200', bar: '[&>div]:bg-green-500' };
  if (score >= 60) return { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', bar: '[&>div]:bg-blue-500' };
  if (score >= 40) return { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', bar: '[&>div]:bg-yellow-500' };
  return { color: 'text-red-600', bg: 'bg-red-50 border-red-200', bar: '[&>div]:bg-red-500' };
}

function importanceBadge(importance: string) {
  if (importance === 'critical') return 'bg-red-100 text-red-700 border-red-200';
  if (importance === 'important') return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

export const JobMatchPanel = () => {
  const { resumeData } = useResumeContext();
  const [jd, setJd] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [showGaps, setShowGaps] = useState(false);

  const buildResumeText = () => {
    const pi = resumeData.personalInfo;
    const name = [pi?.firstName, pi?.lastName].filter(Boolean).join(' ');

    const eduSection = (resumeData.education || [])
      .map(e => `${e.degree} in ${e.fieldOfStudy} — ${e.school}`)
      .join('\n');

    const workSection = (resumeData.workExperience || [])
      .map(w => `${w.position} at ${w.company}\n${w.description}`)
      .join('\n\n');

    const skillSection = (resumeData.skills || []).map(s => s.name).join(', ');

    const projSection = (resumeData.projects || [])
      .map(p => `${p.name}: ${p.description}`)
      .join('\n');

    const certSection = (resumeData.certifications || [])
      .map(c => `${c.name} — ${c.issuer}`)
      .join('\n');

    return [
      name,
      pi?.summary ? `SUMMARY\n${pi.summary}` : '',
      eduSection ? `EDUCATION\n${eduSection}` : '',
      workSection ? `WORK EXPERIENCE\n${workSection}` : '',
      skillSection ? `SKILLS\n${skillSection}` : '',
      projSection ? `PROJECTS\n${projSection}` : '',
      certSection ? `CERTIFICATIONS\n${certSection}` : '',
    ].filter(Boolean).join('\n\n');
  };

  const handleMatch = async () => {
    if (!jd.trim()) {
      toast.error('Please paste a job description first');
      return;
    }
    setIsMatching(true);
    setResult(null);
    try {
      const resumeText = buildResumeText();
      const res = await matchJobDescription(resumeText, jd);
      setResult(res);
      toast.success('Job match complete!');
    } catch {
      toast.error('Failed to match. Please try again.');
    } finally {
      setIsMatching(false);
    }
  };

  const colors = result ? scoreLabel(result.match_score) : scoreLabel(0);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* JD Input */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-[#2d6a4f]" />
            Paste a Job Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Paste any job post and AI will tell you exactly how well your resume matches — and what to fix.
          </p>
          <div>
            <Label htmlFor="jd-input" className="text-xs text-muted-foreground mb-1.5 block">Job Description</Label>
            <Textarea
              id="jd-input"
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description here…"
              className="min-h-[140px] text-sm"
              data-testid="textarea-job-description"
            />
          </div>
          <Button
            onClick={handleMatch}
            disabled={isMatching || !jd.trim()}
            className="bg-[#2d6a4f] hover:bg-[#255c43] text-white w-full sm:w-auto"
            data-testid="button-match-job"
          >
            {isMatching ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analysing match…</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" />Check My Match</>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Match Score */}
          <Card className={cn("border", colors.bg)}>
            <CardContent className="pt-5 pb-5">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="text-center shrink-0">
                  <div className={cn("text-5xl font-bold", colors.color)}>{result.match_score}%</div>
                  <Badge variant="outline" className={cn("mt-1 border text-xs", colors.bg, colors.color)}>
                    {result.match_label}
                  </Badge>
                </div>
                <div className="flex-1 w-full">
                  <Progress value={result.match_score} className={cn("h-2.5 mb-3", colors.bar)} />
                  <p className="text-sm text-foreground leading-relaxed">{result.verdict}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <div className="grid sm:grid-cols-2 gap-4">
            {result.matched_keywords.length > 0 && (
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm text-green-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />Matched Keywords ({result.matched_keywords.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched_keywords.map((kw, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {result.missing_keywords.length > 0 && (
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm text-[#c05621] flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />Missing Keywords ({result.missing_keywords.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_keywords.map((kw, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Wins */}
          {result.quick_wins.length > 0 && (
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm text-[#2d6a4f] flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />Quick Wins
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ul className="space-y-2">
                  {result.quick_wins.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[#2d6a4f] mt-0.5 shrink-0">→</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Skill Gaps — collapsible */}
          {result.skill_gaps.length > 0 && (
            <Card>
              <button
                className="w-full flex items-center justify-between px-4 pt-4 pb-3 text-left"
                onClick={() => setShowGaps(g => !g)}
                data-testid="button-toggle-skill-gaps"
              >
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Skill Gaps ({result.skill_gaps.length})
                </CardTitle>
                {showGaps ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {showGaps && (
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="space-y-3">
                    {result.skill_gaps.map((gap, i) => (
                      <div key={i} className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{gap.skill}</span>
                          <Badge variant="outline" className={cn("text-xs border", importanceBadge(gap.importance))}>
                            {gap.importance}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{gap.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          <div className="text-center">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => { setResult(null); setJd(''); }}>
              Try another job
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
