
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, MoveUp, MoveDown, Link2 } from 'lucide-react';
import { useResumeContext, Project } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { FormWrapper } from './FormWrapper';
import { toast } from 'sonner';

export const ProjectsForm = () => {
  const { resumeData, updateResumeData } = useResumeContext();
  const [draggingId, setDraggingId] = useState<string | null>(null);
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

    // Scroll to the new project after a short delay to allow for DOM update
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

  const validateForm = () => {
    if (!resumeData.projects?.length) {
      return false;
    }

    const isValid = resumeData.projects.every(project => 
      project.name.trim() && 
      project.description.trim()
    );

    if (!isValid) {
      toast.error('Please fill in all required fields for each project');
      return false;
    }

    return true;
  };

  return (
    <FormWrapper
      title="Projects"
      description="Add your notable projects and achievements"
      onNext={validateForm}
      nextDisabled={!resumeData.projects?.length}
    >
      <div className="space-y-6">
        <ScrollArea className={cn(
          "rounded-lg border",
          isMobile ? "h-[calc(100vh-280px)]" : "h-[600px]"
        )}>
          <div className="p-4 space-y-6">
            {(resumeData.projects || []).map((project, index) => (
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
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <h3 className="font-medium">Project {index + 1}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <TouchRipple className="rounded-full">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMoveProject(project.id, 'up')}
                          className={cn(isMobile && "h-10 w-10")}
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
                        onClick={() => handleRemoveProject(project.id)}
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
                  <div className="space-y-2">
                    <Label htmlFor={`name-${project.id}`}>Project Name *</Label>
                    <Input
                      id={`name-${project.id}`}
                      value={project.name}
                      onChange={(e) => handleUpdateProject(project.id, 'name', e.target.value)}
                      className={cn(isMobile && "h-12")}
                      required
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
                    <Label htmlFor={`technologies-${project.id}`}>Technologies Used *</Label>
                    <Input
                      id={`technologies-${project.id}`}
                      value={project.technologies || ''}
                      onChange={(e) => handleUpdateProject(project.id, 'technologies', e.target.value)}
                      className={cn(isMobile && "h-12")}
                      placeholder="e.g., React, Node.js, TypeScript"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${project.id}`}>Project Description *</Label>
                    <Textarea
                      id={`description-${project.id}`}
                      value={project.description}
                      onChange={(e) => handleUpdateProject(project.id, 'description', e.target.value)}
                      className="min-h-[120px]"
                      placeholder="Describe the project, your role, and key achievements..."
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
            onClick={handleAddProject}
            variant="outline"
            className={cn(
              "w-full border-dashed",
              isMobile && "h-12 text-base"
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </TouchRipple>
      </div>
    </FormWrapper>
  );
};
