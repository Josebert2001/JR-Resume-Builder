
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { enhanceEducationEntry } from '@/services/resumeAI';
import { toast } from 'sonner';
import { analytics } from '@/services/analytics';
import { FormWrapper } from './FormWrapper';
import { Card } from "@/components/ui/card";
import { NigerianNyscPanel } from './NyscHelper';

interface EntryErrors {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
}

export const EducationForm = () => {
  const { education, updateEducation, resumeData } = useResumeContext();
  const isMobile = useIsMobile();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [entryErrors, setEntryErrors] = useState<Record<string, EntryErrors>>({});
  const [tips, setTips] = useState<Record<string, string>>({});

  const handleAddEducation = () => {
    updateEducation([
      ...education,
      {
        id: Date.now().toString(),
        school: '',
        degree: '',
        fieldOfStudy: '',
        graduationDate: '',
        description: '',
        gpa: ''
      }
    ]);
  };

  const handleRemoveEducation = (id: string) => {
    updateEducation(education.filter(edu => edu.id !== id));
    setEntryErrors(prev => { const next = { ...prev }; delete next[id]; return next; });
    setTips(prev => { const next = { ...prev }; delete next[id]; return next; });
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    updateEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    if (entryErrors[id]?.[field as keyof EntryErrors]) {
      setEntryErrors(prev => ({ ...prev, [id]: { ...prev[id], [field]: undefined } }));
    }
  };

  const handleEnhanceWithAI = async (id: string) => {
    const edu = education.find(e => e.id === id);
    if (!edu?.school || !edu?.degree || !edu?.fieldOfStudy) {
      toast.error('Please fill in school, degree, and field of study first');
      return;
    }
    setGeneratingId(id);
    analytics.aiFeatureUsed('education_generation', false);
    try {
      const careerGoal =
        resumeData.workExperience?.[0]?.position ||
        resumeData.personalInfo?.summary?.slice(0, 60) ||
        '';

      const { entry, tip } = await enhanceEducationEntry(
        edu.school,
        edu.degree,
        edu.fieldOfStudy,
        edu.fieldOfStudy,
        edu.graduationDate || '',
        edu.gpa || '',
        '5.0',
        edu.description || '',
        edu.description || '',
        careerGoal
      );

      // Build a clean readable description from the AI output
      const lines: string[] = [];

      if (entry.relevant_courses.length > 0) {
        lines.push(`Relevant Coursework: ${entry.relevant_courses.join(' · ')}`);
      }
      if (entry.honors.length > 0) {
        lines.push(`Honors: ${entry.honors.join(' · ')}`);
      }
      if (entry.achievements.length > 0) {
        lines.push('');
        lines.push('Achievements:');
        entry.achievements.forEach(a => lines.push(`• ${a}`));
      }
      if (entry.extracurriculars.length > 0) {
        lines.push('');
        lines.push('Activities:');
        entry.extracurriculars.forEach(a => lines.push(`• ${a}`));
      }

      const formatted = lines.join('\n').trim();

      if (formatted) {
        handleEducationChange(id, 'description', formatted);
        // Apply GPA if AI confirmed it's strong
        if (entry.gpa && entry.gpa !== 'null') {
          handleEducationChange(id, 'gpa', entry.gpa.split('/')[0] || edu.gpa);
        }
        if (tip) setTips(prev => ({ ...prev, [id]: tip }));
        analytics.aiFeatureUsed('education_generation', true);
        toast.success('Education entry enhanced with AI!');
      } else {
        toast.error('AI could not enhance this entry. Please add more details and try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error enhancing education entry:', message);
      analytics.errorOccurred('education_generation_failed', message);
      toast.error('Failed to enhance entry. Please try again.');
    } finally {
      setGeneratingId(null);
    }
  };

  const validateForm = (): boolean => {
    const entries = education || [];
    if (entries.length === 0) return true;

    const newErrors: Record<string, EntryErrors> = {};
    let hasError = false;

    entries.forEach(edu => {
      const errors: EntryErrors = {};
      if (!edu.school.trim()) { errors.school = 'School name is required'; hasError = true; }
      if (!edu.degree.trim()) { errors.degree = 'Degree is required'; hasError = true; }
      if (!edu.fieldOfStudy.trim()) { errors.fieldOfStudy = 'Field of study is required'; hasError = true; }
      if (Object.keys(errors).length) newErrors[edu.id] = errors;
    });

    if (hasError) {
      setEntryErrors(newErrors);
      toast.error('Please fill in the required fields highlighted below');
      return false;
    }

    return true;
  };

  return (
    <FormWrapper
      title="Education"
      description="Add your educational background, or skip if not applicable"
      onNext={validateForm}
      showSkip={true}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {(education || []).map((edu, index) => {
            const errors = entryErrors[edu.id] || {};
            const tip = tips[edu.id];
            return (
              <Card key={edu.id} className="p-4 relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm text-muted-foreground">Education {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                    data-testid={`button-remove-education-${edu.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={`school-${edu.id}`}>
                        School <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`school-${edu.id}`}
                        value={edu.school}
                        onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)}
                        placeholder="University or institution name"
                        className={cn("mt-1.5", errors.school && "border-red-400 focus-visible:ring-red-400")}
                        data-testid={`input-school-${edu.id}`}
                      />
                      {errors.school && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{errors.school}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`degree-${edu.id}`}>
                        Degree <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`degree-${edu.id}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                        placeholder="e.g. Bachelor of Science"
                        className={cn("mt-1.5", errors.degree && "border-red-400 focus-visible:ring-red-400")}
                        data-testid={`input-degree-${edu.id}`}
                      />
                      {errors.degree && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{errors.degree}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={`fieldOfStudy-${edu.id}`}>
                        Field of Study <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`fieldOfStudy-${edu.id}`}
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleEducationChange(edu.id, 'fieldOfStudy', e.target.value)}
                        placeholder="e.g. Computer Science"
                        className={cn("mt-1.5", errors.fieldOfStudy && "border-red-400 focus-visible:ring-red-400")}
                        data-testid={`input-field-${edu.id}`}
                      />
                      {errors.fieldOfStudy && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{errors.fieldOfStudy}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`graduationDate-${edu.id}`}>
                        Graduation Date
                        <span className="text-stone-400 font-normal text-xs ml-1">(optional)</span>
                      </Label>
                      <Input
                        id={`graduationDate-${edu.id}`}
                        value={edu.graduationDate}
                        onChange={(e) => handleEducationChange(edu.id, 'graduationDate', e.target.value)}
                        placeholder="e.g. May 2026 or 2026"
                        className="mt-1.5"
                        data-testid={`input-graddate-${edu.id}`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`gpa-${edu.id}`}>
                      GPA
                      <span className="text-stone-400 font-normal text-xs ml-1">(optional)</span>
                    </Label>
                    <Input
                      id={`gpa-${edu.id}`}
                      value={edu.gpa}
                      onChange={(e) => handleEducationChange(edu.id, 'gpa', e.target.value)}
                      placeholder="e.g. 4.2"
                      className={cn("mt-1.5", isMobile && "h-11")}
                    />
                  </div>

                  <div>
                    <div className="flex items-start justify-between mb-1.5 gap-2">
                      <div>
                        <Label htmlFor={`description-${edu.id}`}>
                          Courses, Honours & Activities
                          <span className="text-stone-400 font-normal text-xs ml-1">(optional)</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Mention any courses, awards, or roles — AI will restructure them professionally.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleEnhanceWithAI(edu.id)}
                        disabled={generatingId === edu.id || !edu.school || !edu.degree || !edu.fieldOfStudy}
                        className="text-xs h-7 px-2 shrink-0"
                        data-testid={`button-enhance-education-${edu.id}`}
                      >
                        {generatingId === edu.id ? (
                          <><Loader2 className="mr-1 h-3 w-3 animate-spin" />Enhancing…</>
                        ) : (
                          <><Sparkles className="mr-1 h-3 w-3" />Enhance with AI</>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id={`description-${edu.id}`}
                      value={edu.description}
                      onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                      className="min-h-[90px]"
                      placeholder="e.g. Network Security, Database Systems, Operating Systems · Dean's List 2023 · VP of Computer Science Students' Association…"
                    />
                    {tip && (
                      <div className="mt-2 flex items-start gap-2 bg-[#e8f5ee] border border-[#b6d9c4] rounded-xl p-3">
                        <Sparkles className="text-[#2d6a4f] shrink-0 mt-0.5" size={13} />
                        <p className="text-xs text-[#3d5544] leading-relaxed">{tip}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nigerian Student NYSC section */}
                <div className="mt-3">
                  <NigerianNyscPanel
                    institution={edu.school}
                    degree={edu.degree}
                    fieldOfStudy={edu.fieldOfStudy}
                    graduationYear={edu.graduationDate || ''}
                    cgpa={edu.gpa || ''}
                    careerGoal={resumeData.personalInfo?.summary?.slice(0, 80) || ''}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddEducation}
          className={cn(
            "w-full border-dashed hover:border-resume-primary/50 transition-colors duration-200",
            isMobile ? "h-12 text-base" : "h-10"
          )}
          data-testid="button-add-education"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>
    </FormWrapper>
  );
};
