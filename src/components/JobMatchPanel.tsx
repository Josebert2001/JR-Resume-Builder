import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, CheckCircle2, XCircle, Target, AlertTriangle } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { matchJobDescription, type JobMatchResult, type MissingKeyword, type SectionFix } from '@/services/resumeAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function labelColor(label: string) {
  if (label === 'Strong Match') return 'bg-green-50 text-green-800 border-green-300';
  if (label === 'Good Match') return 'bg-blue-50 text-blue-800 border-blue-300';
  if (label === 'Partial Match') return 'bg-yellow-50 text-yellow-800 border-yellow-300';
  return 'bg-red-50 text-red-800 border-red-300';
}

function scoreProgress(score: number) {
  if (score >= 80) return '[&>div]:bg-green-500';
  if (score >= 60) return '[&>div]:bg-blue-500';
  if (score >= 40) return '[&>div]:bg-yellow-500';
  return '[&>div]:bg-red-400';
}

function importanceColor(importance: string) {
  if (importance === 'critical') return 'bg-red-50 text-red-700 border-red-200';
  if (importance === 'important') return 'bg-orange-50 text-orange-700 border-orange-200';
  return 'bg-gray-50 text-gray-600 border-gray-200';
}

function buildResumeText(resumeData: any): string {
  const pi = resumeData.personalInfo;
  const parts: string[] = [];
  if (pi?.summary) parts.push(`Summary: ${pi.summary}`);
  const exp = (resumeData.workExperience || [])
    .map((w: any) => `${w.position} at ${w.company} (${w.startDate}–${w.endDate || 'Present'}): ${w.description}`)
    .join('\n');
  if (exp) parts.push(`Experience:\n${exp}`);
  const proj = (resumeData.projects || [])
    .map((p: any) => `${p.name}: ${p.description}${p.technologies ? ` [${p.technologies}]` : ''}`)
    .join('\n');
  if (proj) parts.push(`Projects:\n${proj}`);
  const skills = (resumeData.skills || []).map((s: any) => s.name).join(', ');
  if (skills) parts.push(`Skills: ${skills}`);
  const edu = (resumeData.education || [])
    .map((e: any) => `${e.degree} in ${e.fieldOfStudy} — ${e.school}`)
    .join('\n');
  if (edu) parts.push(`Education:\n${edu}`);
  const certs = (resumeData.certifications || []).map((c: any) => `${c.name} — ${c.issuer}`).join(', ');
  if (certs) parts.push(`Certifications: ${certs}`);
  return parts.join('\n\n');
}

export const JobMatchPanel = () => {
  const { resumeData } = useResumeContext();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste the job description first.');
      return;
    }
    setIsMatching(true);
    try {
      const resumeText = buildResumeText(resumeData);
      const res = await matchJobDescription(resumeText, jobTitle, company, jobDescription);
      if (res.match_score === 0 && !res.verdict) {
        toast.error('Could not analyse job match. Please try again.');
      } else {
        setResult(res);
        toast.success('Job match analysed!');
      }
    } catch {
      toast.error('Failed to analyse job match. Please try again.');
    } finally {
      setIsMatching(false);
    }
  };

  if (!result) {
    return (
      <div className="space-y-5 animate-in fade-in-50">
        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-[#2d6a4f]" />Job Description Match
            </CardTitle>
            <p className="text-sm text-muted-foreground">Paste a job description and see how well your resume matches it.</p>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="jm-title" className="text-xs font-medium">Job Title</Label>
                <Input
                  id="jm-title"
                  placeholder="e.g. Software Engineer"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  data-testid="input-job-title"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jm-company" className="text-xs font-medium">Company</Label>
                <Input
                  id="jm-company"
                  placeholder="e.g. Flutterwave"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  data-testid="input-company"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jm-jd" className="text-xs font-medium">Job Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="jm-jd"
                placeholder="Paste the full job description here…"
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={8}
                className="resize-none text-sm"
                data-testid="textarea-job-description"
              />
            </div>
            <Button
              onClick={handleMatch}
              disabled={isMatching || !jobDescription.trim()}
              className="w-full bg-[#2d6a4f] hover:bg-[#255c43] text-white"
              data-testid="button-analyse-match"
            >
              {isMatching ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analysing match…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Analyse Job Match</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in-50">
      {/* Score + Verdict */}
      <Card>
        <CardContent className="pt-5 pb-5 px-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#2d6a4f]">{result.match_score}%</span>
              <Badge variant="outline" className={cn("border text-sm", labelColor(result.match_label))}>
                {result.match_label}
              </Badge>
              {!result.realistic_match && (
                <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50 text-xs">
                  Stretch role
                </Badge>
              )}
            </div>
            <Progress value={result.match_score} className={cn("h-2.5", scoreProgress(result.match_score))} />
            {(jobTitle || company) && (
              <p className="text-xs text-muted-foreground">
                {[jobTitle, company].filter(Boolean).join(' at ')}
              </p>
            )}
            <p className="text-sm text-foreground leading-relaxed">{result.verdict}</p>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Fixes — highlighted */}
      {result.top_3_fixes.length > 0 && (
        <Card className="border-[#2d6a4f]/30">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm text-[#2d6a4f] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />Top 3 Most Impactful Fixes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {result.top_3_fixes.map(f => (
              <div key={f.rank} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f7f3ed]">
                <span className="w-5 h-5 rounded-full bg-[#2d6a4f] text-white text-xs flex items-center justify-center shrink-0 font-bold">{f.rank}</span>
                <div className="flex-1 text-sm">{f.fix}</div>
                {f.score_gain && <span className="text-xs font-mono text-green-700 shrink-0">{f.score_gain}</span>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Keywords */}
      <div className="grid sm:grid-cols-2 gap-4">
        {result.matched_keywords.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm text-green-700 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />Matched ({result.matched_keywords.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-1.5">
                {result.matched_keywords.map((kw, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">{kw}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {result.missing_keywords.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm text-red-600 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" />Missing ({result.missing_keywords.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-1.5">
              {(result.missing_keywords as MissingKeyword[]).map((m, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Badge variant="outline" className={cn("text-xs border capitalize shrink-0", importanceColor(m.importance))}>
                    {m.importance}
                  </Badge>
                  <div>
                    <span className="text-xs font-medium">{m.keyword}</span>
                    {m.where_to_add && <p className="text-xs text-muted-foreground">Add to: {m.where_to_add}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Section Fixes accordion */}
      {result.section_fixes.length > 0 && (
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-orange-500" />Section-by-Section Fixes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-2">
            <Accordion type="multiple">
              {(result.section_fixes as SectionFix[]).map((f, i) => (
                <AccordionItem key={i} value={`sf-${i}`} className="border-b last:border-b-0">
                  <AccordionTrigger className="text-sm py-2.5 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">{f.section}</Badge>
                      <span className="text-muted-foreground text-xs truncate max-w-[200px]">{f.issue}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm pb-3">{f.fix}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Button variant="outline" size="sm" className="text-xs" onClick={() => setResult(null)}>
          Try another job
        </Button>
      </div>
    </div>
  );
};
