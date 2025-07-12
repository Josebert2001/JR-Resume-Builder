
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, MoveUp, MoveDown, Sparkles, Loader2 } from 'lucide-react';
import { useResumeContext, WorkExperience } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { FormWrapper } from './FormWrapper';
import { toast } from 'sonner';
import { generateWorkDescription } from '@/services/resumeAI';

export const WorkExperienceForm = () => {
  const { resumeData, updateResumeData } = useResumeContext();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
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

    // Scroll to the new experience after a short delay to allow for DOM update
    setTimeout(() => {
      const element = document.getElementById(`experience-${newExperience.id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleUpdateExperience = (id: string, field: keyof WorkExperience, value: string) => {
    updateResumeData({
      workExperience: resumeData.workExperience?.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ) || []
    });
  };

  const handleRemoveExperience = (id: string) => {
    updateResumeData({
      workExperience: resumeData.workExperience?.filter(exp => exp.id !== id) || []
    });
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
    if (!exp || !exp.position || !exp.company) {
      toast.error('Please fill in position and company first');
      return;
    }

    setGeneratingId(id);
    try {
      const description = await generateWorkDescription(
        exp.position,
        exp.company,
        undefined,
        resumeData.targetJobDescription
      );
      
      if (description) {
        handleUpdateExperience(id, 'description', description);
        toast.success('Job description generated!');
        analytics.trackAIFeatureUsed('work_description_generation', resumeData.targetJobDescription ? 'with_job_description' : 'without_job_description');
      } else {
        toast.error('Failed to generate description. Please try again.');
      }
    } catch (error) {
      console.error('Error generating work description:', error);
      toast.error('Failed to generate description. Please try again.');
    } finally {
      setGeneratingId(null);
    }
  };

  const validateForm = () => {
    if (!resumeData.workExperience?.length) {
      return false;
    }

    const isValid = resumeData.workExperience.every(exp => 
      exp.position.trim() && 
      exp.company.trim() && 
      exp.startDate.trim() &&
      exp.description.trim()
    );

    if (!isValid) {
      toast.error('Please fill in all required fields for each work experience');
      return false;
    }

    return true;
  };

  return (
    <FormWrapper
      title="Work Experience"
      description="Add your relevant work history"
      onNext={validateForm}
      nextDisabled={!resumeData.workExperience?.length}
    >
      <div className="space-y-6">
        <ScrollArea className={cn(
          "rounded-lg border",
          isMobile ? "h-[calc(100vh-280px)]" : "h-[600px]"
        )}>
          <div className="p-4 space-y-6">
            {(resumeData.workExperience || []).map((experience, index) => (
              <Card
                key={experience.id}
                id={`experience-${experience.id}`}
                className={cn(
                  "p-4 relative transition-shadow",
                  draggingId === experience.id && "shadow-lg",
                  isMobile && "active:scale-[0.99]"
                )}
                draggable
                onDragStart={() => setDraggingId(experience.id)}
                onDragEnd={() => setDraggingId(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <h3 className="font-medium">Experience {index + 1}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <TouchRipple className="rounded-full">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMoveExperience(experience.id, 'up')}
                          className={cn(isMobile && "h-10 w-10")}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                      </TouchRipple>
                    )}
                    {index < (resumeData.workExperience?.length || 0) - 1 && (
                      <TouchRipple className="rounded-full">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMoveExperience(experience.id, 'down')}
                          className={cn(isMobile && "h-10 w-10")}
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
                        className={cn(
                          "text-destructive hover:text-destructive/90",
                          isMobile && "h-10 w-10"
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TouchRipple>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`position-${experience.id}`}>Job Title *</Label>
                      <Input
                        id={`position-${experience.id}`}
                        value={experience.position}
                        onChange={(e) => handleUpdateExperience(experience.id, 'position', e.target.value)}
                        className={cn(isMobile && "h-12")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`company-${experience.id}`}>Company *</Label>
                      <Input
                        id={`company-${experience.id}`}
                        value={experience.company}
                        onChange={(e) => handleUpdateExperience(experience.id, 'company', e.target.value)}
                        className={cn(isMobile && "h-12")}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`location-${experience.id}`}>Location</Label>
                    <Input
                      id={`location-${experience.id}`}
                      value={experience.location}
                      onChange={(e) => handleUpdateExperience(experience.id, 'location', e.target.value)}
                      className={cn(isMobile && "h-12")}
                      placeholder="e.g., San Francisco, CA or Remote"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${experience.id}`}>Start Date *</Label>
                      <Input
                        id={`startDate-${experience.id}`}
                        type="month"
                        value={experience.startDate}
                        onChange={(e) => handleUpdateExperience(experience.id, 'startDate', e.target.value)}
                        className={cn(isMobile && "h-12")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
                      <Input
                        id={`endDate-${experience.id}`}
                        type="month"
                        value={experience.endDate}
                        onChange={(e) => handleUpdateExperience(experience.id, 'endDate', e.target.value)}
                        className={cn(isMobile && "h-12")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`description-${experience.id}`}>Description *</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateDescription(experience.id)}
                        disabled={generatingId === experience.id || !experience.position || !experience.company}
                        className="text-xs h-7 px-2"
                      >
                        {generatingId === experience.id ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-1 h-3 w-3" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id={`description-${experience.id}`}
                      value={experience.description}
                      onChange={(e) => handleUpdateExperience(experience.id, 'description', e.target.value)}
                      className="min-h-[120px]"
                      placeholder="Describe your role, responsibilities, and key achievements..."
                      required
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <TouchRipple className="rounded-md">
          <Button
            onClick={handleAddExperience}
            variant="outline"
            className={cn(
              "w-full border-dashed",
              isMobile && "h-12 text-base"
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Work Experience
          </Button>
        </TouchRipple>
      </div>
    </FormWrapper>
  );
};
