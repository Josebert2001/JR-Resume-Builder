import React, { useState } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WorkExperience } from '@/context/ResumeContext';
import { Briefcase, Plus, Trash2, Wand2 } from 'lucide-react';
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
import { Groq } from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  console.error("GROQ_API_KEY is missing. Please set it in the .env file.");
}
const groq = new Groq({ 
  apiKey,
  dangerouslyAllowBrowser: true 
});

const WorkExperienceForm = () => {
  const { resumeData, updateResumeData, setCurrentStep } = useResumeContext();
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    resumeData.workExperience || []
  );
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: uuidv4(),
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setExperiences([...experiences, newExperience]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setExperiences(
      experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const generateResponsibilities = async (id: string) => {
    const experience = experiences.find(exp => exp.id === id);
    
    if (!experience || !experience.position || !experience.company) {
      toast.error("Please fill in the job title and company first");
      return;
    }

    setIsGenerating(prev => ({ ...prev, [id]: true }));
    
    try {
      const prompt = `Generate 4-5 detailed and specific bullet points for a ${experience.position} role at ${experience.company}. 
Focus on quantifiable achievements and key responsibilities that demonstrate impact.
Include relevant technical skills and soft skills.
Format each bullet point to start with "• " and separate with newlines.
Make them specific to the role and industry, avoiding generic statements.
Example format:
• Increased team productivity by 40% through implementation of agile methodologies
• Led development of customer-facing application serving 100,000+ users`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 1024,
      });

      const responsibilities = completion.choices[0]?.message?.content || "Failed to generate responsibilities";
      updateExperience(id, 'description', responsibilities);
      toast.success("Responsibilities generated!");
    } catch (error) {
      console.error('Error generating responsibilities:', error);
      toast.error("Failed to generate responsibilities. Please try again.");
    } finally {
      setIsGenerating(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleBack = () => {
    setCurrentStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateResumeData({ workExperience: experiences });
    toast.success("Work experience updated!");
    setCurrentStep(5);
  };

  return (
    <form onSubmit={handleSubmit} className="resume-form animate-fade-in">
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-gradient-to-r from-resume-primary to-resume-secondary text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Briefcase size={20} />
            <CardTitle>Work Experience</CardTitle>
          </div>
          <CardDescription className="text-gray-100">
            Add your relevant work experience
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {experiences.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p>No work experience added yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <Card key={exp.id} className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium">Position {index + 1}</CardTitle>
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`position-${exp.id}`} className="block mb-2">Job Title</Label>
                        <Input
                          id={`position-${exp.id}`}
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="e.g. Software Engineer"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`company-${exp.id}`} className="block mb-2">Company</Label>
                        <Input
                          id={`company-${exp.id}`}
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="e.g. Google"
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`location-${exp.id}`} className="block mb-2">Location</Label>
                        <Input
                          id={`location-${exp.id}`}
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="e.g. New York, NY"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`startDate-${exp.id}`} className="block mb-2">Start Date</Label>
                        <Input
                          id={`startDate-${exp.id}`}
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="e.g. 01/2020"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`endDate-${exp.id}`} className="block mb-2">End Date</Label>
                        <Input
                          id={`endDate-${exp.id}`}
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="e.g. Present or 01/2023"
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor={`description-${exp.id}`} className="block">
                          Responsibilities
                        </Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs border-resume-primary text-resume-primary"
                          onClick={() => generateResponsibilities(exp.id)}
                          disabled={isGenerating[exp.id] || !exp.position || !exp.company}
                        >
                          {isGenerating[exp.id] ? (
                            <>Generating...</>
                          ) : (
                            <>
                              <Wand2 size={14} className="mr-1" />
                              Generate
                            </>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        id={`description-${exp.id}`}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="List your key responsibilities and achievements..."
                        className="min-h-[150px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <Button 
            type="button" 
            onClick={addExperience}
            variant="outline"
            className="mt-4 border-dashed border-gray-300 text-gray-600 w-full py-6"
          >
            <Plus size={18} className="mr-2" /> Add Work Experience
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

export default WorkExperienceForm;
