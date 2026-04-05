import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, LayoutList, Calendar } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { buildNoExperienceResume, type NoExperienceResult } from '@/services/resumeAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const NoExperienceBanner = () => {
  const { resumeData, updateResumeData } = useResumeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NoExperienceResult | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleBuild = async () => {
    setIsLoading(true);
    setExpanded(true);
    try {
      const pi = resumeData.personalInfo;
      const education = (resumeData.education || [])
        .map((e: any) => `${e.degree} in ${e.fieldOfStudy} — ${e.school}`)
        .join(', ');
      const projects = (resumeData.projects || [])
        .map((p: any) => `${p.name}: ${p.description}${p.technologies ? ` [${p.technologies}]` : ''}`)
        .join('\n');
      const skills = (resumeData.skills || []).map((s: any) => s.name).join(', ');
      const certs = (resumeData.certifications || []).map((c: any) => c.name).join(', ');

      const res = await buildNoExperienceResume({
        fullName: [pi?.firstName, pi?.lastName].filter(Boolean).join(' ') || 'Student',
        fieldOfStudy: resumeData.education?.[0]?.fieldOfStudy || '',
        careerGoal: pi?.summary || '',
        education,
        projects,
        skills,
        certifications: certs,
        hasVolunteer: 'no',
      });

      if (!res.rewritten_summary && res.projects_as_experience.length === 0) {
        toast.error('Could not build profile. Please add some projects or skills first.');
      } else {
        setResult(res);
        toast.success('No Experience Mode ready!');
      }
    } catch {
      toast.error('Failed to build profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSummary = () => {
    if (!result?.rewritten_summary) return;
    updateResumeData({ personalInfo: { ...resumeData.personalInfo, summary: result.rewritten_summary } });
    toast.success('Summary updated!');
  };

  const handleApplySkills = () => {
    if (!result?.tiered_skills) return;
    const allSkills = [
      ...result.tiered_skills.primary,
      ...result.tiered_skills.supporting,
    ].map((name, i) => ({ id: `noskill-${i}`, name, level: i < result.tiered_skills.primary.length ? 'Advanced' : 'Intermediate' }));
    updateResumeData({ skills: allSkills });
    toast.success('Skills updated!');
  };

  const handleApplyProject = (p: { project_name: string; role_title: string; bullets: string[] }) => {
    const existing = resumeData.projects || [];
    const match = existing.find((pr: any) => pr.name?.toLowerCase() === p.project_name?.toLowerCase());
    if (match) {
      const updated = existing.map((pr: any) =>
        pr.name?.toLowerCase() === p.project_name?.toLowerCase()
          ? { ...pr, description: p.bullets.map((b: string) => `• ${b}`).join('\n') }
          : pr
      );
      updateResumeData({ projects: updated });
      toast.success(`"${p.project_name}" updated!`);
    } else {
      toast.info(`Project "${p.project_name}" not found — add it manually in the Projects step.`);
    }
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-[#2d6a4f]/40 bg-[#f7f3ed] p-4 space-y-3" data-testid="no-experience-banner">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#2d6a4f] flex items-center justify-center shrink-0">
          <Lightbulb className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">No work experience? Try No Experience Mode.</h3>
          <p className="text-xs text-muted-foreground">AI reframes your projects, skills, and education into a competitive resume — even without a single job.</p>
        </div>
        <Button
          onClick={handleBuild}
          disabled={isLoading}
          size="sm"
          className="bg-[#2d6a4f] hover:bg-[#255c43] text-white text-xs shrink-0"
          data-testid="button-no-experience-mode"
        >
          {isLoading ? (
            <><Loader2 className="mr-1.5 h-3 w-3 animate-spin" />Analysing…</>
          ) : (
            <><Sparkles className="mr-1.5 h-3 w-3" />Try No Experience Mode</>
          )}
        </Button>
      </div>

      {result && expanded && (
        <div className="space-y-4 pt-1 border-t border-[#e8ddd0] mt-3">
          {/* Recommended Section Order */}
          {result.recommended_section_order.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1.5">
                <LayoutList className="h-3 w-3" />Recommended resume order for you
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.recommended_section_order.map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-xs text-[#2d6a4f] font-medium">{i + 1}. {s}</span>
                    {i < result.recommended_section_order.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rewritten Summary */}
          {result.rewritten_summary && (
            <div className="rounded-lg bg-white border p-3 space-y-2">
              <p className="text-xs font-medium text-[#2d6a4f]">Rewritten Professional Summary</p>
              <p className="text-sm leading-relaxed">{result.rewritten_summary}</p>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 border-[#2d6a4f]/40 text-[#2d6a4f]"
                onClick={handleUseSummary}
                data-testid="button-use-summary"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />Use This Summary
              </Button>
            </div>
          )}

          {/* Projects as Experience */}
          {result.projects_as_experience.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Your projects as professional experience:</p>
              {result.projects_as_experience.map((p, i) => (
                <div key={i} className="rounded-lg bg-white border p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold">{p.role_title}</p>
                      <p className="text-xs text-muted-foreground">{p.project_name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-6 px-2 shrink-0 border-[#2d6a4f]/40 text-[#2d6a4f]"
                      onClick={() => handleApplyProject(p)}
                      data-testid={`button-apply-project-${i}`}
                    >
                      Apply to Projects
                    </Button>
                  </div>
                  <ul className="space-y-0.5">
                    {p.bullets.map((b, bi) => (
                      <li key={bi} className="text-xs text-muted-foreground flex gap-1.5">
                        <span className="text-[#2d6a4f] shrink-0">•</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Tiered Skills */}
          {(result.tiered_skills.primary.length > 0 || result.tiered_skills.supporting.length > 0) && (
            <div className="rounded-lg bg-white border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#2d6a4f]">Tiered Skills Structure</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-6 px-2 border-[#2d6a4f]/40 text-[#2d6a4f]"
                  onClick={handleApplySkills}
                  data-testid="button-apply-skills"
                >
                  Apply
                </Button>
              </div>
              <div className="space-y-1.5">
                {result.tiered_skills.primary.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Primary</p>
                    <div className="flex flex-wrap gap-1">
                      {result.tiered_skills.primary.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.tiered_skills.supporting.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Supporting</p>
                    <div className="flex flex-wrap gap-1">
                      {result.tiered_skills.supporting.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.tiered_skills.learning.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Learning (add in 30 days)</p>
                    <div className="flex flex-wrap gap-1">
                      {result.tiered_skills.learning.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 30-day plan (if has_nothing_flag) */}
          {result.has_nothing_flag && result.thirty_day_plan.length > 0 && (
            <div className="rounded-lg bg-white border border-orange-200 p-3 space-y-2">
              <p className="text-xs font-medium text-orange-700 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />Your 30-Day Action Plan
              </p>
              <ol className="space-y-1">
                {result.thirty_day_plan.map((a, i) => (
                  <li key={i} className="text-xs flex gap-2">
                    <span className="text-orange-600 font-bold shrink-0">{i + 1}.</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {result.tip && (
            <p className="text-xs text-muted-foreground italic border-t pt-2">{result.tip}</p>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-xs w-full text-muted-foreground"
            onClick={() => setExpanded(false)}
          >
            <ChevronUp className="h-3 w-3 mr-1" />Collapse
          </Button>
        </div>
      )}
    </div>
  );
};
