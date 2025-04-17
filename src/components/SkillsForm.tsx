import React, { useState, useEffect } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lightbulb, X, Plus, Wand2 } from 'lucide-react';
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
import { Groq } from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  console.error("GROQ_API_KEY is missing. Please set it in the .env file.");
}
const groq = new Groq({ 
  apiKey, 
  dangerouslyAllowBrowser: true 
});

const SkillsForm = () => {
  const { resumeData, updateResumeData, setCurrentStep } = useResumeContext();
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(resumeData.skills || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const generateSkillSuggestions = async () => {
    // Gather all available context from resume data
    const context = {
      education: resumeData.fieldOfStudy ? `Field of Study: ${resumeData.fieldOfStudy}` : '',
      degree: resumeData.degree ? `Degree: ${resumeData.degree}` : '',
      interests: resumeData.interests ? `Interests: ${resumeData.interests}` : '',
      workExperience: resumeData.workExperience?.map(exp => 
        `${exp.position} at ${exp.company}: ${exp.description}`
      ).join('\n') || ''
    };

    // Check if we have enough context
    if (!context.education && !context.degree && !context.workExperience) {
      toast.error("Please fill in either education details or work experience first");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Based on the following background:
${context.education}
${context.degree}
${context.interests}
Work Experience:
${context.workExperience}

Generate exactly 10 relevant professional skills that would be valuable for their career. Include both technical and soft skills based on their background.
Return ONLY a JSON array of strings, nothing else. Example format: ["Skill 1", "Skill 2", "Skill 3"]`;

      const completion = await groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "You are a professional skills advisor. Always respond with properly formatted JSON arrays of strings only."
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1024,
      });

      const response = completion.choices[0]?.message?.content || '[]';
      // Clean the response to ensure it only contains the JSON array
      const cleanedResponse = response.trim().replace(/^```json\n|\n```$/g, '');
      
      try {
        const suggestions = JSON.parse(cleanedResponse);
        if (Array.isArray(suggestions)) {
          setSuggestedSkills(suggestions);
          toast.success("Generated skill suggestions!");
        } else {
          throw new Error('Response is not an array');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', cleanedResponse);
        toast.error("Failed to process suggestions");
      }
    } catch (error) {
      console.error('Error generating skill suggestions:', error);
      toast.error("Failed to generate suggestions");
    } finally {
      setIsGenerating(false);
    }
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

  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleBack = () => {
    setCurrentStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateResumeData({ skills });
    toast.success("Skills updated!");
    setCurrentStep(6);  // Changed from 5 to 6 to advance to Preview & Download
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
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="skill">Add Skills</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs border-resume-primary text-resume-primary"
                onClick={generateSkillSuggestions}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Wand2 size={14} className="mr-1" />
                    Suggest Skills
                  </>
                )}
              </Button>
            </div>
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
          
          {suggestedSkills.length > 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">AI-Suggested Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill, index) => (
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
          )}
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
