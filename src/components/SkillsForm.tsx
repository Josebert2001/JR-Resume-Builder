
import React, { useState } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lightbulb, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { toast } from 'sonner';

const SkillsForm = () => {
  const { resumeData, updateResumeData, setCurrentStep } = useResumeContext();
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(resumeData.skills || []);

  const handleBack = () => {
    setCurrentStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateResumeData({ skills });
    toast.success("Skills updated!");
    setCurrentStep(5);
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Common skills by category for suggestions
  const skillSuggestions = {
    technical: [
      "JavaScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker", "Git",
      "HTML/CSS", "TypeScript", "Java", "C#", "PHP", "MongoDB", "REST APIs"
    ],
    design: [
      "UI/UX Design", "Adobe Creative Suite", "Figma", "Sketch", "InDesign", 
      "Photoshop", "Illustrator", "Wireframing", "Prototyping"
    ],
    business: [
      "Project Management", "Business Analysis", "Agile/Scrum", "Marketing", 
      "Sales", "Customer Service", "Strategic Planning", "Financial Analysis"
    ],
    soft: [
      "Communication", "Leadership", "Problem Solving", "Teamwork", 
      "Time Management", "Critical Thinking", "Adaptability", "Creativity"
    ]
  };

  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="resume-form animate-fade-in">
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-gradient-to-r from-resume-primary to-resume-secondary text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Lightbulb size={20} />
            <CardTitle>Skills</CardTitle>
          </div>
          <CardDescription className="text-gray-100">
            Add your technical and professional skills
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-6">
            <Label htmlFor="skill" className="block mb-2">Add Skills</Label>
            <div className="flex">
              <Input
                id="skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. JavaScript, Project Management, Communication"
                className="rounded-r-none"
              />
              <Button 
                type="button"
                onClick={addSkill}
                className="bg-resume-primary hover:bg-resume-secondary rounded-l-none"
              >
                <Plus size={16} />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Press Enter to add a skill</p>
          </div>

          <div className="mb-6">
            <Label className="block mb-2">Your Skills</Label>
            {skills.length === 0 ? (
              <div className="text-center py-4 border border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500">No skills added yet</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions.technical.slice(0, 8).map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`cursor-pointer hover:bg-gray-100 ${skills.includes(skill) ? 'opacity-50' : ''}`}
                    onClick={() => addSuggestedSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions.soft.slice(0, 8).map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`cursor-pointer hover:bg-gray-100 ${skills.includes(skill) ? 'opacity-50' : ''}`}
                    onClick={() => addSuggestedSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
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

export default SkillsForm;
