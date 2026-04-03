
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { generateEducationDescription } from '@/services/resumeAI';
import { toast } from 'sonner';
import { analytics } from '@/services/analytics';
import { FormWrapper } from './FormWrapper';
import { Card } from "@/components/ui/card";

interface EntryErrors {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
}

export const EducationForm = () => {
  const { education, updateEducation } = useResumeContext();
  const isMobile = useIsMobile();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [entryErrors, setEntryErrors] = useState<Record<string, EntryErrors>>({});

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
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    updateEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    if (entryErrors[id]?.[field as keyof EntryErrors]) {
      setEntryErrors(prev => ({ ...prev, [id]: { ...prev[id], [field]: undefined } }));
    }
  };

  const handleGenerateDescription = async (id: string) => {
    const edu = education.find(e => e.id === id);
    if (!edu?.school || !edu?.degree || !edu?.fieldOfStudy) {
      toast.error('Please fill in school, degree, and field of study first');
      return;
    }
    setGeneratingId(id);
    analytics.aiFeatureUsed('education_generation', false);
    try {
      const description = await generateEducationDescription(edu.degree, edu.fieldOfStudy, edu.school);
      if (description) {
        handleEducationChange(id, 'description', description);
        analytics.aiFeatureUsed('education_generation', true);
        toast.success('Education description generated!');
      } else {
        toast.error('Failed to generate description. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error generating education description:', message);
      analytics.errorOccurred('education_generation_failed', message);
      toast.error('Failed to generate description. Please try again.');
    } finally {
      setGeneratingId(null);
    }
  };

  const validateForm = (): boolean => {
    if (education.length === 0) return true;

    const newErrors: Record<string, EntryErrors> = {};
    let hasError = false;

    education.forEach(edu => {
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
          {education.map((edu, index) => {
            const errors = entryErrors[edu.id] || {};
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
                        placeholder="e.g. May 2023 or 2023"
                        className="mt-1.5"
                        data-testid={`input-graddate-${edu.id}`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label htmlFor={`description-${edu.id}`}>
                        Description
                        <span className="text-stone-400 font-normal text-xs ml-1">(optional)</span>
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateDescription(edu.id)}
                        disabled={generatingId === edu.id || !edu.school || !edu.degree || !edu.fieldOfStudy}
                        className="text-xs h-7 px-2"
                        data-testid={`button-generate-education-${edu.id}`}
                      >
                        {generatingId === edu.id ? (
                          <><Loader2 className="mr-1 h-3 w-3 animate-spin" />Generating...</>
                        ) : (
                          <><Sparkles className="mr-1 h-3 w-3" />Generate with AI</>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id={`description-${edu.id}`}
                      value={edu.description}
                      onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                      className="min-h-[80px]"
                      placeholder="Relevant coursework, achievements, activities…"
                    />
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
                      placeholder="e.g. 3.8"
                      className={cn("mt-1.5", isMobile && "h-11")}
                    />
                  </div>
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
