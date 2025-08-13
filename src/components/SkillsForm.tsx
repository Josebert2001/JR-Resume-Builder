import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GripVertical, Plus, Trash2, MoveUp, MoveDown, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { FormWrapper } from './FormWrapper';
import { toast } from 'sonner';
import { suggestGroupedSkills } from '@/services/resumeAI';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Skill {
  id: string;
  name: string;
  level: number;
}

export const SkillsForm = () => {
  const { resumeData, updateResumeData } = useResumeContext();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<{technical: string[], soft: string[]}>({technical: [], soft: []});
  const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>({});
  const [suggestDialogOpen, setSuggestDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 3
    };

    updateResumeData({
      skills: [...(resumeData.skills || []), newSkill]
    });

    // Scroll to the new skill after a short delay to allow for DOM update
    setTimeout(() => {
      const element = document.getElementById(`skill-${newSkill.id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleUpdateSkill = (id: string, field: keyof Skill, value: string | number) => {
    updateResumeData({
      skills: resumeData.skills?.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ) || []
    });
  };

  const handleRemoveSkill = (id: string) => {
    updateResumeData({
      skills: resumeData.skills?.filter(skill => skill.id !== id) || []
    });
    toast.success('Skill removed');
  };

  const handleMoveSkill = (id: string, direction: 'up' | 'down') => {
    const skills = [...(resumeData.skills || [])];
    const index = skills.findIndex(skill => skill.id === id);
    if (direction === 'up' && index > 0) {
      [skills[index], skills[index - 1]] = [skills[index - 1], skills[index]];
      updateResumeData({ skills });
    } else if (direction === 'down' && index < skills.length - 1) {
      [skills[index], skills[index + 1]] = [skills[index + 1], skills[index]];
      updateResumeData({ skills });
    }
  };

  const validateForm = () => {
    if (!resumeData.skills?.length) {
      return false;
    }

    const isValid = resumeData.skills.every(skill => skill.name.trim());

    if (!isValid) {
      toast.error('Please fill in all skill names');
      return false;
    }

    return true;
  };

  const handleSuggestSkills = async () => {
    // Check if we have at least one work experience
    if (!resumeData.workExperience?.length) {
      toast.error('Please add at least one work experience to get skill suggestions');
      return;
    }

    setIsSuggesting(true);
    
    try {
      // Gather comprehensive user data
      const targetRole = resumeData.workExperience[0]?.position || 
                        'Professional';
      
      // Get all experience descriptions with full context
      const experienceDescriptions = resumeData.workExperience.map(exp => 
        `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'}): ${exp.description || ''}`
      );
      
      // Include education context if available
      if (resumeData.education?.length) {
        experienceDescriptions.push(
          ...resumeData.education.map(edu => 
            `Education: ${edu.degree} in ${edu.fieldOfStudy} from ${edu.school} (${edu.graduationDate})`
          )
        );
      }
      
      // Include projects if available
      if (resumeData.projects?.length) {
        experienceDescriptions.push(
          ...resumeData.projects.map(proj => 
            `Project: ${proj.name} - ${proj.description || ''} (Technologies: ${proj.technologies || 'N/A'})`
          )
        );
      }
      
      // Current skills to avoid duplicates
      const currentSkills = resumeData.skills?.map(s => s.name) || [];
      
      // Get AI suggested grouped skills
      const suggestions = await suggestGroupedSkills(targetRole, experienceDescriptions, currentSkills);
      
      // Combine all suggested skills and filter duplicates
      const allSuggestions = [...suggestions.technical, ...suggestions.soft];
      const existingSkills = new Set(currentSkills.map(s => s.toLowerCase()));
      
      const filteredTechnical = suggestions.technical.filter(
        skill => !existingSkills.has(skill.toLowerCase())
      );
      const filteredSoft = suggestions.soft.filter(
        skill => !existingSkills.has(skill.toLowerCase())
      );
      
      if (filteredTechnical.length === 0 && filteredSoft.length === 0) {
        toast.info('No new skills to suggest. Try adding more details to your experience.');
        return;
      }
      
      // Set the grouped suggested skills
      setSuggestedSkills({
        technical: filteredTechnical,
        soft: filteredSoft
      });
      
      // Initialize selected skills object to all true
      const initialSelected: Record<string, boolean> = {};
      [...filteredTechnical, ...filteredSoft].forEach(skill => {
        initialSelected[skill] = true;
      });
      setSelectedSkills(initialSelected);
      
      // Open the dialog
      setSuggestDialogOpen(true);
      
    } catch (error) {
      console.error('Error suggesting skills:', error);
      toast.error('Failed to suggest skills. Please try again.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills({
      ...selectedSkills,
      [skill]: !selectedSkills[skill]
    });
  };

  const handleAddSelectedSkills = () => {
    // Get the selected skills from both categories
    const allSuggestedSkills = [...suggestedSkills.technical, ...suggestedSkills.soft];
    const skillsToAdd = allSuggestedSkills.filter(skill => selectedSkills[skill]);
    
    if (skillsToAdd.length === 0) {
      setSuggestDialogOpen(false);
      return;
    }
    
    // Add the selected skills to the resume
    const newSkills = skillsToAdd.map(name => ({
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      level: 3 // Default level
    }));
    
    updateResumeData({
      skills: [...(resumeData.skills || []), ...newSkills]
    });
    
    // Close the dialog and show success message
    setSuggestDialogOpen(false);
    toast.success(`Added ${skillsToAdd.length} new skills to your resume`);
  };

  return (
    <FormWrapper
      title="Skills"
      description="Add your technical and professional skills"
      onNext={validateForm}
      nextDisabled={!resumeData.skills?.length}
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSuggestSkills}
            disabled={isSuggesting || !(resumeData.workExperience?.length)}
            className="mb-4"
          >
            {isSuggesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suggesting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Suggest Skills with AI
              </>
            )}
          </Button>
        </div>

        <div className={cn(
          "space-y-4 rounded-lg border p-4",
          isMobile ? "max-h-[calc(100vh-280px)] overflow-y-auto" : "max-h-[600px] overflow-y-auto"
        )}>
          {(resumeData.skills || []).map((skill, index) => (
            <Card
              key={skill.id}
              id={`skill-${skill.id}`}
              className={cn(
                "p-4 relative transition-shadow",
                draggingId === skill.id && "shadow-lg",
                isMobile && "active:scale-[0.99]"
              )}
              draggable
              onDragStart={() => setDraggingId(skill.id)}
              onDragEnd={() => setDraggingId(null)}
            >
              <div className="flex items-center gap-4">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move shrink-0" />
                
                <div className="flex-1">
                  <Input
                    value={skill.name}
                    onChange={(e) => handleUpdateSkill(skill.id, 'name', e.target.value)}
                    placeholder="Enter a skill..."
                    className={cn(isMobile && "h-12")}
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <TouchRipple key={level} className="rounded-full">
                        <button
                          type="button"
                          onClick={() => handleUpdateSkill(skill.id, 'level', level)}
                          className={cn(
                            "w-6 h-6 rounded-full border transition-colors",
                            level <= skill.level ? "bg-resume-primary border-resume-primary" : "border-input",
                            isMobile && "w-8 h-8"
                          )}
                          aria-label={`Skill level ${level}`}
                        />
                      </TouchRipple>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <TouchRipple className="rounded-full">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMoveSkill(skill.id, 'up')}
                          className={cn(isMobile && "h-10 w-10")}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                      </TouchRipple>
                    )}
                    {index < (resumeData.skills?.length || 0) - 1 && (
                      <TouchRipple className="rounded-full">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMoveSkill(skill.id, 'down')}
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
                        onClick={() => handleRemoveSkill(skill.id)}
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
              </div>
            </Card>
          ))}
        </div>

        <TouchRipple className="rounded-md">
          <Button
            onClick={handleAddSkill}
            variant="outline"
            className={cn(
              "w-full border-dashed",
              isMobile && "h-12 text-base"
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </TouchRipple>
      </div>

      <Dialog open={suggestDialogOpen} onOpenChange={setSuggestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suggested Skills</DialogTitle>
            <DialogDescription>
              These skills are suggested based on your work experience. Select the ones you want to add to your resume.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {/* Technical Skills */}
              {suggestedSkills.technical.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">Technical Skills</h4>
                  <div className="space-y-3">
                    {suggestedSkills.technical.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`skill-${skill}`} 
                          checked={selectedSkills[skill]}
                          onCheckedChange={() => handleToggleSkill(skill)}
                        />
                        <label
                          htmlFor={`skill-${skill}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Soft Skills */}
              {suggestedSkills.soft.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">Soft Skills</h4>
                  <div className="space-y-3">
                    {suggestedSkills.soft.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`skill-${skill}`} 
                          checked={selectedSkills[skill]}
                          onCheckedChange={() => handleToggleSkill(skill)}
                        />
                        <label
                          htmlFor={`skill-${skill}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuggestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSelectedSkills}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Add Selected Skills
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormWrapper>
  );
};
