
import React, { useState } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Project } from '@/context/ResumeContext';
import { FileCode, Plus, Trash2, Link } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const ProjectsForm = () => {
  const { resumeData, updateResumeData, setCurrentStep } = useResumeContext();
  const [projects, setProjects] = useState<Project[]>(
    resumeData.projects || []
  );

  const addProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: '',
      description: '',
      technologies: '',
      url: '',
    };
    setProjects([...projects, newProject]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setProjects(
      projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const handleBack = () => {
    setCurrentStep(4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateResumeData({ projects });
    toast.success("Projects updated!");
    setCurrentStep(6);
  };

  return (
    <form onSubmit={handleSubmit} className="resume-form animate-fade-in">
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-gradient-to-r from-resume-primary to-resume-secondary text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <FileCode size={20} />
            <CardTitle>Projects</CardTitle>
          </div>
          <CardDescription className="text-gray-100">
            Add relevant projects to showcase your skills and accomplishments
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileCode className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p>No projects added yet</p>
              <p className="text-sm text-gray-400 mt-1">Projects are especially valuable for students and career changers</p>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map((project, index) => (
                <Card key={project.id} className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium">Project {index + 1}</CardTitle>
                      <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`name-${project.id}`} className="block mb-2">Project Name</Label>
                      <Input
                        id={`name-${project.id}`}
                        value={project.name}
                        onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                        placeholder="e.g. E-commerce Website"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`description-${project.id}`} className="block mb-2">
                        Description
                      </Label>
                      <Textarea
                        id={`description-${project.id}`}
                        value={project.description}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                        placeholder="Describe the project, your role, and significant achievements"
                        className="w-full min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`technologies-${project.id}`} className="block mb-2">Technologies Used</Label>
                      <Input
                        id={`technologies-${project.id}`}
                        value={project.technologies || ''}
                        onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                        placeholder="e.g. React, Node.js, MongoDB"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`url-${project.id}`} className="block mb-2">
                        <div className="flex items-center gap-1">
                          <Link size={14} />
                          <span>Project URL</span>
                          <span className="text-gray-500 text-xs ml-1">(optional)</span>
                        </div>
                      </Label>
                      <Input
                        id={`url-${project.id}`}
                        value={project.url || ''}
                        onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                        placeholder="e.g. https://github.com/yourusername/project"
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <Button 
            type="button" 
            onClick={addProject}
            variant="outline"
            className="mt-4 border-dashed border-gray-300 text-gray-600 w-full py-6"
          >
            <Plus size={18} className="mr-2" /> Add Project
          </Button>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-4 border-t">
          <Button 
            type="button" 
            onClick={handleBack}
            variant="outline"
            className="border-resume-primary text-resume-primary"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="bg-resume-primary hover:bg-resume-secondary text-white"
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProjectsForm;
