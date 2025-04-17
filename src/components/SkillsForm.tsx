import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GripVertical, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { FormWrapper } from './FormWrapper';
import { toast } from 'sonner';

interface Skill {
  id: string;
  name: string;
  level: number;
}

export const SkillsForm = () => {
  const { resumeData, updateResumeData } = useResumeContext();
  const [draggingId, setDraggingId] = useState<string | null>(null);
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

  return (
    <FormWrapper
      title="Skills"
      description="Add your technical and professional skills"
      onNext={validateForm}
      nextDisabled={!resumeData.skills?.length}
    >
      <div className="space-y-6">
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
    </FormWrapper>
  );
};
