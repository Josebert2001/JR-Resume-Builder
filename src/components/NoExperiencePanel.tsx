import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { getNoExperienceAdvice, type NoExperienceResult } from '@/services/resumeAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const YESNO = ['Yes', 'No', 'A little'];

const typeColors: Record<string, string> = {
  'Volunteer': 'bg-green-50 text-green-700 border-green-200',
  'Club Role': 'bg-blue-50 text-blue-700 border-blue-200',
  'Academic Project': 'bg-purple-50 text-purple-700 border-purple-200',
  'Freelance': 'bg-orange-50 text-orange-700 border-orange-200',
  'Internship': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'NYSC': 'bg-[#e8f5ee] text-[#2d6a4f] border-[#b6d9c4]',
  'Part-Time': 'bg-gray-50 text-gray-700 border-gray-200',
};

export const NoExperiencePanel = () => {
  const { resumeData } = useResumeContext();
  const [careerGoal, setCareerGoal] = useState('');
  const [hasProjects, setHasProjects] = useState('');
  const [hasCertifications, setHasCertifications] = useState('');
  const [hasVolunteer, setHasVolunteer] = useState('');
  const [hasFreelance, setHasFreelance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NoExperienceResult | null>(null);

  const pi = resumeData.personalInfo;
  const fullName = [pi?.firstName, pi?.lastName].filter(Boolean).join(' ') || 'Student';
  const fieldOfStudy = resumeData.education?.[0]?.fieldOfStudy || '';
  const academicLevel = resumeData.education?.[0]?.degree || 'Undergraduate';

  const handleGetAdvice = async () => {
    if (!careerGoal.trim()) {
      toast.error('Please enter your career goal first');
      return;
    }
    setIsLoading(true);
    try {
      const res = await getNoExperienceAdvice({
        fullName,
        fieldOfStudy: fieldOfStudy || careerGoal,
        academicLevel,
        careerGoal: careerGoal.trim(),
        hasProjects: hasProjects || 'no',
        hasCertifications: hasCertifications || 'no',
        hasVolunteer: hasVolunteer || 'no',
        hasFreelance: hasFreelance || 'no',
      });
      if (!res.headline) {
        toast.error('Could not generate advice. Please try again.');
      } else {
        setResult(res);
        toast.success('Your action plan is ready!');
      }
    } catch {
      toast.error('Failed to generate advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {!result ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-5 w-5 text-[#c05621]" />
              No Experience? No Problem.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Most Nigerian students applying for their first job have no formal work experience. 
              Tell us what you DO have and we'll show you how to build a competitive resume.
            </p>

            <div>
              <Label htmlFor="career-goal" className="text-sm font-medium">
                What role or career are you targeting? <span className="text-red-500">*</span>
              </Label>
              <Input
                id="career-goal"
                value={careerGoal}
                onChange={e => setCareerGoal(e.target.value)}
                placeholder="e.g. Software Developer, Data Analyst, Accountant, Marketing Officer…"
                className="mt-1.5"
                data-testid="input-no-exp-career-goal"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Do you have any projects?', state: hasProjects, setter: setHasProjects, id: 'has-projects' },
                { label: 'Do you have any certifications?', state: hasCertifications, setter: setHasCertifications, id: 'has-certs' },
                { label: 'Volunteer or club roles?', state: hasVolunteer, setter: setHasVolunteer, id: 'has-volunteer' },
                { label: 'Any freelance or side gigs?', state: hasFreelance, setter: setHasFreelance, id: 'has-freelance' },
              ].map(({ label, state: val, setter, id }) => (
                <div key={id}>
                  <Label className="text-sm font-medium">{label}</Label>
                  <div className="flex gap-2 mt-1.5">
                    {YESNO.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setter(opt.toLowerCase())}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs border transition-colors",
                          val === opt.toLowerCase()
                            ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                            : "bg-white text-muted-foreground border-border hover:border-[#2d6a4f]"
                        )}
                        data-testid={`button-${id}-${opt.toLowerCase().replace(' ', '-')}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleGetAdvice}
              disabled={isLoading || !careerGoal.trim()}
              className="bg-[#2d6a4f] hover:bg-[#255c43] text-white w-full"
              data-testid="button-get-no-exp-advice"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Building your action plan…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Show Me What To Do</>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Headline + Strategy */}
          <Card className="border-[#2d6a4f]/20 bg-[#f7f3ed]">
            <CardContent className="pt-5 pb-5">
              <h3 className="text-lg font-semibold text-[#2d6a4f] mb-2">{result.headline}</h3>
              <p className="text-sm text-[#3d5544] leading-relaxed">{result.strategy}</p>
            </CardContent>
          </Card>

          {/* Experience Alternatives */}
          {result.experience_alternatives.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-foreground">What to put instead of work experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.experience_alternatives.map((alt, i) => (
                  <div key={i} className="p-3 rounded-xl border bg-white space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs border", typeColors[alt.type] || 'bg-gray-50 text-gray-700 border-gray-200')}>
                        {alt.type}
                      </Badge>
                      <span className="text-sm font-medium">{alt.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground italic">"{alt.example}"</p>
                    <p className="text-xs text-[#3d5544]">{alt.why_it_works}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          {result.quick_actions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#c05621] flex items-center gap-1.5">
                  <ArrowRight className="h-4 w-4" />Actions You Can Take This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.quick_actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#2d6a4f] mt-0.5 shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Encouraged Sections */}
          {result.encouraged_sections.length > 0 && (
            <div className="flex items-start gap-2 bg-[#e8f5ee] border border-[#b6d9c4] rounded-xl p-3">
              <Sparkles className="text-[#2d6a4f] shrink-0 mt-0.5" size={14} />
              <div>
                <p className="text-xs font-medium text-[#2d6a4f] mb-1">Focus on these sections</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.encouraged_sections.map((s, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-[#e8f5ee] text-[#2d6a4f] border-[#b6d9c4]">{s}</Badge>
                  ))}
                </div>
                {result.tip && <p className="text-xs text-[#3d5544] mt-2 leading-relaxed">{result.tip}</p>}
              </div>
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setResult(null)}>
              Try different answers
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
