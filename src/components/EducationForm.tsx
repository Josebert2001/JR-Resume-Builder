
import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateResumeContent } from '@/services/aiService';
import { toast } from 'sonner';

const EducationForm = () => {
  const { 
    resumeData, 
    updateResumeData, 
    setCurrentStep, 
    setAiGenerated,
    isGenerating,
    setIsGenerating
  } = useResumeContext();

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsGenerating(true);
      toast.info("Generating your resume content with AI...");
      
      const generatedContent = await generateResumeContent({
        name: resumeData.name,
        email: resumeData.email,
        phone: resumeData.phone,
        course: resumeData.course,
        school: resumeData.school,
        interests: resumeData.interests
      });
      
      setAiGenerated(generatedContent);
      updateResumeData({
        summary: generatedContent.summary,
        skills: generatedContent.skills
      });
      
      toast.success("AI content generated successfully!");
      setCurrentStep(3);
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
      console.error("AI generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="resume-form animate-fade-in">
      <h2 className="text-2xl font-bold text-resume-primary mb-6">Education & Interests</h2>

      <div className="input-group">
        <Label htmlFor="course" className="block mb-2">Course/Degree</Label>
        <Input
          id="course"
          type="text"
          value={resumeData.course}
          onChange={(e) => updateResumeData({ course: e.target.value })}
          placeholder="e.g. Computer Science, Engineering, Business Administration"
          required
          className="w-full"
        />
      </div>

      <div className="input-group">
        <Label htmlFor="school" className="block mb-2">School/University</Label>
        <Input
          id="school"
          type="text"
          value={resumeData.school}
          onChange={(e) => updateResumeData({ school: e.target.value })}
          placeholder="e.g. University of Lagos"
          required
          className="w-full"
        />
      </div>

      <div className="input-group">
        <Label htmlFor="interests" className="block mb-2">Professional Interests</Label>
        <Textarea
          id="interests"
          value={resumeData.interests}
          onChange={(e) => updateResumeData({ interests: e.target.value })}
          placeholder="e.g. software development, artificial intelligence, data analysis"
          required
          className="w-full"
          rows={3}
        />
      </div>

      <div className="flex justify-between mt-8">
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
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate with AI"}
        </Button>
      </div>
    </form>
  );
};

export default EducationForm;
