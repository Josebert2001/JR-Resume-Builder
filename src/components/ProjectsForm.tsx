
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, MoveUp, MoveDown, Link2, Sparkles, Loader2 } from 'lucide-react';
import { useResumeContext, Project } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { FormWrapper } from './FormWrapper';
import { toast } from 'sonner';
import { generateProjectBullets } from '@/services/resumeAI';

export const ProjectsForm = () => {
  const { resumeData, updateResumeData, nextStep } = useResumeContext();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [projectTips, setProjectTips] = useState<Record<string, string>>({});
  const isMobile = useIsMobile();

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      url: ''
    };

    updateResumeData({
      projects: [...(resumeData.projects || []), newProject]
    });

    setTimeout(() => {
      const element = document.getElementById(`project-${newProject.id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleUpdateProject = (id: string, field: keyof Project, value: string) => {
    updateResumeData({
      projects: resumeData.projects?.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      ) || []
    });
  };

  const handleRemoveProject = (id: string) => {
    updateResumeData({
      projects: resumeData.projects?.filter(project => project.id !== id) || []
    });
    setProjectTips(prev => { const next = { ...prev }; delete next[id]; return next; });
    toast.success('Project removed');
  };

  const handleMoveProject = (id: string, direction: 'up' | 'down') => {
    const projects = [...(resumeData.projects || [])];
    const index = projects.findIndex(project => project.id === id);
    if (direction === 'up' && index > 0) {
      [projects[index], projects[index - 1]] = [projects[index - 1], projects[index]];
      updateResumeData({ projects });
    } else if (direction === 'down' && index < projects.length - 1) {
      [projects[index], projects[index + 1]] = [projects[index + 1], projects[index]];
      updateResumeData({ projects });
    }
  };

  const handleRewriteWithAI = async (id: string) => {
    const project = resumeData.projects?.find(p => p.id === id);
    if (!project?.name) {
      toast.error('Please fill in a project name first');
      return;
    }
    setGeneratingId(id);
    try {
      const fieldOfStudy = resumeData.education?.[0]?.fieldOfStudy || '';
      const careerGoal =
        resumeData.workExperience?.[0]?.position ||
        resumeData.personalInfo?.summary?.slice(0, 60) ||
        '';

      const { oneLiner, bullets, tip } = await generateProjectBullets(
        project.name,
        project.technologies || '',
        project.description || '',
        project.url || '',
        fieldOfStudy,
        careerGoal
      );

      if (oneLiner || bullets.length > 0) {
        const bulletLines = bullets.map(b => `• ${b}`).join('\n');
        const formatted = oneLiner
          ? `${oneLiner}${bulletLines ? '\n' + bulletLines : ''}`
          : bulletLines;
        handleUpdateProject(id, 'description', formatted);
        if (tip) setProjectTips(prev => ({ ...prev, [id]: tip }));
        toast.success('Project rewritten with AI!');
      } else {
        toast.error('Failed to rewrite project. Please try again.');
      }
    } catch (err) {
      console.error('Error rewriting project:', err);
      toast.error('Failed to rewrite project. Please try again.');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleSkip = () => {
    toast.info('Projects section skipped');
    nextStep();
  };

  const validateForm = () => {
    const projects = resumeData.projects || [];
    if (projects.length === 0) return true;

    const hasBlank = projects.some(p => !p.name.trim());
    if (hasBlank) {
      toast.error('Please fill in a project name for every entry, or remove the blank ones');
      return false;
    }

    return true;
  };

  return (
    <FormWrapper
      title="Projects"
      description="Add your notable projects and achievements, or skip if not applicable"
      onNext={validateForm}
      showSkip={true}
      onSkip={handleSkip}
    >
      <div className="space-y-6">
        <div className="space-y-4">
            {(resumeData.projects || []).map((project, index) => {
              const tip = projectTips[project.id];
              return (
                <Card
                  key={project.id}
                  id={`project-${project.id}`}
                  className={cn(
                    "p-4 relative transition-shadow",
                    draggingId === project.id && "shadow-lg",
                    isMobile && "active:scale-[0.99]"
                  )}
                  draggable
                  onDragStart={() => setDraggingId(project.id)}
                  onDragEnd={() => setDraggingId(null)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move hidden sm:block" />
                      <h3 className="font-medium">Project {index + 1}</h3>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {index > 0 && (
                        <TouchRipple className="rounded-full">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleMoveProject(project.id, 'up')}
                            className={cn(isMobile && "h-8 w-8")}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                        </TouchRipple>
                      )}
                      {index < (resumeData.projects?.length || 0) - 1 && (
                        <TouchRipple className="rounded-full">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleMoveProject(project.id, 'down')}
                            className={cn(isMobile && "h-8 w-8")}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </TouchRipple>
                      )}
                      <TouchRipple className="rounded-full">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveProject(project.id)}
                          className={cn(
                            "text-destructive hover:text-destructive/90",
                            isMobile && "h-8 w-8"
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TouchRipple>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${project.id}`}>Project Name *</Label>
                      <Input
                        id={`name-${project.id}`}
                        value={project.name}
                        onChange={(e) => handleUpdateProject(project.id, 'name', e.target.value)}
                        placeholder="e.g., Weather Dashboard"
                        className={cn(isMobile && "h-12")}
                        data-testid={`input-project-name-${project.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`url-${project.id}`}>Project URL</Label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`url-${project.id}`}
                          type="url"
                          value={project.url || ''}
                          onChange={(e) => handleUpdateProject(project.id, 'url', e.target.value)}
                          className={cn("pl-9", isMobile && "h-12")}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`technologies-${project.id}`}>Technologies Used</Label>
                      <Input
                        id={`technologies-${project.id}`}
                        value={project.technologies || ''}
                        onChange={(e) => handleUpdateProject(project.id, 'technologies', e.target.value)}
                        className={cn(isMobile && "h-12")}
                        placeholder="e.g., React, Node.js, TypeScript"
                        data-testid={`input-technologies-${project.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Label htmlFor={`description-${project.id}`}>Project Description</Label>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Describe it in your own words — AI will reframe it professionally.
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleRewriteWithAI(project.id)}
                          disabled={generatingId === project.id || !project.name}
                          className="text-xs h-7 px-2 shrink-0"
                          data-testid={`button-rewrite-project-${project.id}`}
                        >
                          {generatingId === project.id ? (
                            <><Loader2 className="mr-1 h-3 w-3 animate-spin" />Rewriting…</>
                          ) : (
                            <><Sparkles className="mr-1 h-3 w-3" />Rewrite with AI</>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        id={`description-${project.id}`}
                        value={project.description}
                        onChange={(e) => handleUpdateProject(project.id, 'description', e.target.value)}
                        className="min-h-[100px]"
                        placeholder="e.g., I built a website that shows weather using an API…"
                        data-testid={`textarea-project-description-${project.id}`}
                      />
                      {tip && (
                        <div className="flex items-start gap-2 bg-[#e8f5ee] border border-[#b6d9c4] rounded-xl p-3">
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

        <TouchRipple className="rounded-md">
          <Button
            onClick={handleAddProject}
            variant="outline"
            className={cn(
              "w-full border-dashed",
              isMobile && "h-12 text-base"
            )}
            data-testid="button-add-project"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </TouchRipple>
      </div>
    </FormWrapper>
  );
};
