
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowLeft, ArrowRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { generateEducationDescription } from '@/services/resumeAI';
import { toast } from 'sonner';

export const EducationForm = () => {
  const { education, updateEducation, nextStep, prevStep } = useResumeContext();
  const isMobile = useIsMobile();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);

  const handleAddEducation = () => {
    updateEducation([
      ...education,
      {
        id: Date.now().toString(),
        school: '',
        degree: '',
        fieldOfStudy: '',
        graduationDate: '',
        description: '',
        gpa: ''
      }
    ]);
  };

  const handleRemoveEducation = (id: string) => {
    updateEducation(education.filter(edu => edu.id !== id));
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    updateEducation(
      education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handleGenerateDescription = async (id: string) => {
    const edu = education.find(e => e.id === id);
    if (!edu || !edu.school || !edu.degree || !edu.fieldOfStudy) {
      toast.error('Please fill in school, degree, and field of study first');
      return;
    }

    setGeneratingId(id);
    setApiKeyError(false);
    
    try {
      const description = await generateEducationDescription(
        edu.degree,
        edu.fieldOfStudy,
        edu.school
      );
      
      if (description) {
        handleEducationChange(id, 'description', description);
        toast.success('Education description generated!');
      } else {
        toast.error('Failed to generate description. Please try again.');
      }
    } catch (error) {
      console.error('Error generating education description:', error);
      
      if (error instanceof Error && error.message.includes('API key')) {
        setApiKeyError(true);
        toast.error('API key missing or invalid. Please check your configuration.', {
          duration: 5000,
        });
      } else {
        toast.error('Failed to generate description. Please try again.');
      }
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in-50">
      {apiKeyError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>API Key Required:</strong> To use AI features, please set the VITE_GROQ_API_KEY environment variable with a valid Groq API key.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div 
            key={edu.id} 
            className={cn(
              "p-4 rounded-lg border border-input",
              isMobile ? "shadow-sm" : "hover:border-resume-primary/50 transition-colors duration-200"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">
                Education {index + 1}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveEducation(edu.id)}
                className={cn(
                  "text-destructive hover:text-destructive/90",
                  isMobile ? "h-10 w-10" : "h-8 w-8"
                )}
              >
                <Trash2 className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-field">
                  <Label htmlFor={`school-${edu.id}`}>
                    School
                  </Label>
                  <Input
                    id={`school-${edu.id}`}
                    value={edu.school}
                    onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)}
                    className="mt-1.5"
                    placeholder="University name"
                    required
                  />
                </div>
                <div className="form-field">
                  <Label htmlFor={`degree-${edu.id}`}>
                    Degree
                  </Label>
                  <Input
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                    className="mt-1.5"
                    placeholder="e.g. Bachelor's"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-field">
                  <Label htmlFor={`fieldOfStudy-${edu.id}`}>
                    Field of Study
                  </Label>
                  <Input
                    id={`fieldOfStudy-${edu.id}`}
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleEducationChange(edu.id, 'fieldOfStudy', e.target.value)}
                    className="mt-1.5"
                    placeholder="e.g. Computer Science"
                    required
                  />
                </div>
                <div className="form-field">
                  <Label htmlFor={`graduationDate-${edu.id}`}>
                    Graduation Date
                  </Label>
                  <Input
                    id={`graduationDate-${edu.id}`}
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => handleEducationChange(edu.id, 'graduationDate', e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="form-field">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`description-${edu.id}`}>
                      Description
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateDescription(edu.id)}
                      disabled={generatingId === edu.id || !edu.school || !edu.degree || !edu.fieldOfStudy}
                      className="text-xs h-7 px-2"
                    >
                      {generatingId === edu.id ? (
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
                    id={`description-${edu.id}`}
                    value={edu.description}
                    onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                    className="mt-1.5 min-h-[100px]"
                    placeholder="Relevant coursework, achievements, activities..."
                  />
                </div>
              </div>

              <div className="form-field">
                <Label htmlFor={`gpa-${edu.id}`}>
                  GPA (Optional)
                </Label>
                <Input
                  id={`gpa-${edu.id}`}
                  value={edu.gpa}
                  onChange={(e) => handleEducationChange(edu.id, 'gpa', e.target.value)}
                  className="mt-1.5"
                  placeholder="e.g. 3.8"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddEducation}
        className={cn(
          "w-full border-dashed",
          isMobile ? "h-14" : "h-10",
          "hover:border-resume-primary/50 transition-colors duration-200"
        )}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>

      <div className={cn(
        "flex gap-2",
        isMobile ? "flex-col" : "justify-between"
      )}>
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className={cn(
            "flex items-center gap-2",
            isMobile && "order-2"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous Step
        </Button>
        <Button
          type="submit"
          className={cn(
            "flex items-center gap-2 bg-resume-primary hover:bg-resume-secondary",
            isMobile && "order-1"
          )}
        >
          Next Step
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
