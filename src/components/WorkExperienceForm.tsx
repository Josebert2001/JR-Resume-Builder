
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, MoveUp, MoveDown, Sparkles, Loader2, AlertCircle, Flag } from 'lucide-react';
import { useResumeContext, WorkExperience } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { FormWrapper } from './FormWrapper';
import { toast } from 'sonner';
import { analytics } from '@/services/analytics';
import { generateWorkBullets } from '@/services/resumeAI';
import { NyscHelper } from './NyscHelper';

interface EntryErrors {
  position?: string;
  company?: string;
  startDate?: string;
}

export const WorkExperienceForm = () => {
  const { resumeData, updateResumeData } = useResumeContext();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [entryErrors, setEntryErrors] = useState<Record<string, EntryErrors>>({});
  const [tips, setTips] = useState<Record<string, string>>({});
  const [nyscOpen, setNyscOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleAddExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    updateResumeData({
      workExperience: [...(resumeData.workExperience || []), newExperience]
    });
    setTimeout(() => {
      document.getElementById(`position-${newExperience.id}`)?.focus();
    }, 100);
  };

  const handleUpdateExperience = (id: string, field: keyof WorkExperience, value: string) => {
    updateResumeData({
      workExperience: resumeData.workExperience?.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ) || []
    });
    if (entryErrors[id]?.[field as keyof EntryErrors]) {
      setEntryErrors(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: undefined }
      }));
    }
  };

  const handleRemoveExperience = (id: string) => {
    updateResumeData({
      workExperience: resumeData.workExperience?.filter(exp => exp.id !== id) || []
    });
    setEntryErrors(prev => { const next = { ...prev }; delete next[id]; return next; });
    setTips(prev => { const next = { ...prev }; delete next[id]; return next; });
    toast.success('Work experience removed');
  };

  const handleMoveExperience = (id: string, direction: 'up' | 'down') => {
    const experiences = [...(resumeData.workExperience || [])];
    const index = experiences.findIndex(exp => exp.id === id);
    if (direction === 'up' && index > 0) {
      [experiences[index], experiences[index - 1]] = [experiences[index - 1], experiences[index]];
      updateResumeData({ workExperience: experiences });
    } else if (direction === 'down' && index < experiences.length - 1) {
      [experiences[index], experiences[index + 1]] = [experiences[index + 1], experiences[index]];
      updateResumeData({ workExperience: experiences });
    }
  };

  const handleGenerateDescription = async (id: string) => {
    const exp = resumeData.workExperience?.find(e => e.id === id);
    if (!exp?.position || !exp?.company) {
      toast.error('Please fill in job title and company first');
      return;
    }
    setGeneratingId(id);
    analytics.aiFeatureUsed('work_generation', false);
    try {
      const fieldOfStudy = resumeData.education?.[0]?.fieldOfStudy || '';
      const careerGoal =
        exp.position ||
        resumeData.personalInfo?.summary?.slice(0, 60) ||
        'professional role';
      const duration = [exp.startDate, exp.endDate || 'Present']
        .filter(Boolean)
        .join(' – ');

      const { bullets, tip } = await generateWorkBullets(
        exp.position,
        exp.company,
        duration,
        exp.description || '',
        fieldOfStudy,
        careerGoal
      );

      if (bullets.length > 0) {
        const formatted = bullets.map(b => `• ${b}`).join('\n');
        handleUpdateExperience(id, 'description', formatted);
        if (tip) setTips(prev => ({ ...prev, [id]: tip }));
        analytics.aiFeatureUsed('work_generation', true);
        toast.success('Resume bullets generated!');
      } else {
        toast.error('Failed to generate bullets. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error generating work description:', message);
      analytics.errorOccurred('work_generation_failed', message);
      toast.error('Failed to generate bullets. Please try again.');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleNyscApply = (entry: { position: string; description: string }) => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      position: entry.position,
      company: 'National Youth Service Corps (NYSC)',
      location: '',
      startDate: 'July 2024',
      endDate: 'June 2025',
      description: entry.description,
    };
    updateResumeData({
      workExperience: [...(resumeData.workExperience || []), newExperience],
    });
  };

  const validateForm = (): boolean => {
    const experiences = resumeData.workExperience || [];
    if (experiences.length === 0) return true;

    const newErrors: Record<string, EntryErrors> = {};
    let hasError = false;

    experiences.forEach(exp => {
      const errors: EntryErrors = {};
      if (!exp.position.trim()) { errors.position = 'Job title is required'; hasError = true; }
      if (!exp.company.trim()) { errors.company = 'Company is required'; hasError = true; }
      if (!exp.startDate.trim()) { errors.startDate = 'Start date is required'; hasError = true; }
      if (Object.keys(errors).length) newErrors[exp.id] = errors;
    });

    if (hasError) {
      setEntryErrors(newErrors);
      toast.error('Please fill in the required fields highlighted below');
      return false;
    }

    return true;
  };

  const experiences = resumeData.workExperience || [];

  return (
    <FormWrapper
      title="Work Experience"
      description="Add your relevant work history, or skip if not applicable"
      onNext={validateForm}
      showSkip={true}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {experiences.map((experience, index) => {
            const errors = entryErrors[experience.id] || {};
            const tip = tips[experience.id];
            return (
              <Card
                key={experience.id}
                id={`experience-${experience.id}`}
                className="p-4 relative"
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Experience {index + 1}
                  </h3>
                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <TouchRipple className="rounded-full">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMoveExperience(experience.id, 'up')}
                          className="h-8 w-8"
                          data-testid={`button-move-up-${experience.id}`}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                      </TouchRipple>
                    )}
                    {index < experiences.length - 1 && (
                      <TouchRipple className="rounded-full">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMoveExperience(experience.id, 'down')}
                          className="h-8 w-8"
                          data-testid={`button-move-down-${experience.id}`}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </TouchRipple>
                    )}
                    <TouchRipple className="rounded-full">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveExperience(experience.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        data-testid={`button-remove-experience-${experience.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TouchRipple>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Job title + Company */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={`position-${experience.id}`}>
                        Job Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`position-${experience.id}`}
                        value={experience.position}
                        onChange={(e) => handleUpdateExperience(experience.id, 'position', e.target.value)}
                        placeholder="e.g., Software Engineer"
                        className={cn("mt-1.5", errors.position && "border-red-400 focus-visible:ring-red-400")}
                        data-testid={`input-position-${experience.id}`}
                      />
                      {errors.position && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{errors.position}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`company-${experience.id}`}>
                        Company <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`company-${experience.id}`}
                        value={experience.company}
                        onChange={(e) => handleUpdateExperience(experience.id, 'company', e.target.value)}
                        placeholder="e.g., Acme Corp"
                        className={cn("mt-1.5", errors.company && "border-red-400 focus-visible:ring-red-400")}
                        data-testid={`input-company-${experience.id}`}
                      />
                      {errors.company && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{errors.company}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor={`location-${experience.id}`}>Location</Label>
                    <Input
                      id={`location-${experience.id}`}
                      value={experience.location}
                      onChange={(e) => handleUpdateExperience(experience.id, 'location', e.target.value)}
                      placeholder="e.g., Lagos, Nigeria or Remote"
                      className="mt-1.5"
                    />
                  </div>

                  {/* Dates — use text inputs for universal mobile compat */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={`startDate-${experience.id}`}>
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`startDate-${experience.id}`}
                        value={experience.startDate}
                        onChange={(e) => handleUpdateExperience(experience.id, 'startDate', e.target.value)}
                        placeholder="e.g., Jan 2022"
                        className={cn("mt-1.5", errors.startDate && "border-red-400 focus-visible:ring-red-400")}
                        data-testid={`input-startdate-${experience.id}`}
                      />
                      {errors.startDate && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{errors.startDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
                      <Input
                        id={`endDate-${experience.id}`}
                        value={experience.endDate}
                        onChange={(e) => handleUpdateExperience(experience.id, 'endDate', e.target.value)}
                        placeholder="e.g., Dec 2024 or Present"
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <Label htmlFor={`description-${experience.id}`}>
                          What did you do?
                          <span className="text-stone-400 font-normal text-xs ml-1">(optional)</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Describe in your own words — AI will turn it into professional bullets.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateDescription(experience.id)}
                        disabled={generatingId === experience.id || !experience.position || !experience.company}
                        className="text-xs h-7 px-2 shrink-0 ml-3"
                        data-testid={`button-generate-description-${experience.id}`}
                      >
                        {generatingId === experience.id ? (
                          <><Loader2 className="mr-1 h-3 w-3 animate-spin" />Generating…</>
                        ) : (
                          <><Sparkles className="mr-1 h-3 w-3" />Generate with AI</>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id={`description-${experience.id}`}
                      value={experience.description}
                      onChange={(e) => handleUpdateExperience(experience.id, 'description', e.target.value)}
                      className="min-h-[100px]"
                      placeholder="e.g., I helped fix computers and answered customer questions at the shop…"
                    />
                    {tip && (
                      <div className="mt-2 flex items-start gap-2 bg-[#e8f5ee] border border-[#b6d9c4] rounded-xl p-3">
                        <Sparkles className="text-[#2d6a4f] shrink-0 mt-0.5" size={13} />
                        <p className="text-xs text-[#3d5544] leading-relaxed">{tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-2">
          <TouchRipple className="rounded-md flex-1">
            <Button
              onClick={handleAddExperience}
              variant="outline"
              className={cn("w-full border-dashed", isMobile && "h-12 text-base")}
              data-testid="button-add-experience"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>
          </TouchRipple>
          <TouchRipple className="rounded-md shrink-0">
            <Button
              onClick={() => setNyscOpen(true)}
              variant="outline"
              className={cn(
                "border-[#2d6a4f]/40 text-[#2d6a4f] hover:bg-[#e8f5ee] hover:border-[#2d6a4f]",
                isMobile ? "h-12 px-3" : "px-3"
              )}
              title="Add NYSC experience"
              data-testid="button-add-nysc"
            >
              <Flag className="h-4 w-4 mr-1.5" />
              <span className="text-sm">NYSC</span>
            </Button>
          </TouchRipple>
        </div>

        <NyscHelper
          open={nyscOpen}
          onClose={() => setNyscOpen(false)}
          fieldOfStudy={resumeData.education?.[0]?.fieldOfStudy || ''}
          careerGoal={resumeData.workExperience?.[0]?.position || resumeData.personalInfo?.summary?.slice(0, 60) || ''}
          onApply={handleNyscApply}
        />
      </div>
    </FormWrapper>
  );
};
