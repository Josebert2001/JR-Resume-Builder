
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useResumeContext } from '@/context/ResumeContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HelpCircle, MessageSquare } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export const PersonalInfoForm = () => {
  const { personalInfo, updatePersonalInfo, nextStep } = useResumeContext();
  const { toast } = useToast();
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    currentRole: '',
    yearsExperience: '',
    keySkills: '',
    achievements: '',
    careerGoals: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const questions = [
    "What is your current role or the role you're applying for?",
    "How many years of experience do you have in this field?",
    "What are your top 3-5 technical or professional skills?",
    "What are 1-2 significant achievements in your career?",
    "What are your short-term career goals?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handleNextQuestion = () => {
    if (currentAnswer.trim() === '') {
      toast({
        title: "Please provide an answer",
        description: "Your input helps create a better summary.",
        variant: "destructive"
      });
      return;
    }

    const questionKey = Object.keys(answers)[currentQuestion] as keyof typeof answers;
    setAnswers(prev => ({ ...prev, [questionKey]: currentAnswer }));
    setCurrentAnswer('');
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateSummary();
    }
  };

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll use a template-based approach
      setTimeout(() => {
        const summary = createSummaryFromTemplate();
        updatePersonalInfo({ summary });
        setIsAIDialogOpen(false);
        setCurrentQuestion(0);
        toast({
          title: "Summary Created!",
          description: "Your professional summary has been generated successfully.",
        });
        setIsGenerating(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const createSummaryFromTemplate = () => {
    const { currentRole, yearsExperience, keySkills, achievements, careerGoals } = answers;
    
    return `${yearsExperience ? `${yearsExperience} years of experience as a ` : ''}${currentRole} with expertise in ${keySkills}. ${achievements ? `Notable achievements include ${achievements}. ` : ''}Looking to ${careerGoals}.`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in-50">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="form-field">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={personalInfo.firstName}
              onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
              className="mt-1.5 w-full px-3 py-2 bg-background border border-input"
              required
            />
          </div>
          <div className="form-field">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              value={personalInfo.lastName}
              onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
              className="mt-1.5 w-full px-3 py-2 bg-background border border-input"
              required
            />
          </div>
        </div>

        <div className="form-field">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            className="mt-1.5 w-full px-3 py-2 bg-background border border-input"
            required
          />
        </div>

        <div className="form-field">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            className="mt-1.5 w-full px-3 py-2 bg-background border border-input"
            required
          />
        </div>

        <div className="form-field">
          <Label htmlFor="location" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="location"
            placeholder="City, Country"
            value={personalInfo.location || ''}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            className="mt-1.5 w-full px-3 py-2 bg-background border border-input"
            required
          />
        </div>

        <div className="form-field">
          <Label htmlFor="portfolio" className="text-sm font-medium">
            Portfolio URL
          </Label>
          <Input
            id="portfolio"
            type="url"
            placeholder="https://your-portfolio.com"
            value={personalInfo.portfolio || ''}
            onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
            className="mt-1.5 w-full px-3 py-2 bg-background border border-input"
          />
        </div>

        <div className="form-field">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary" className="text-sm font-medium">
              Professional Summary
            </Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAIDialogOpen(true)}
              className="text-xs flex items-center gap-1.5 text-resume-primary hover:text-resume-secondary"
            >
              <MessageSquare size={14} />
              AI Help
            </Button>
          </div>
          <Textarea
            id="summary"
            placeholder="Write a brief summary of your professional background and goals..."
            value={personalInfo.summary || ''}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            className="mt-1.5 w-full min-h-[120px] px-3 py-2 bg-background border border-input resize-none"
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-resume-primary to-resume-secondary hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
        >
          Next Step
        </Button>
      </div>

      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare size={18} className="text-resume-primary" />
              Resume AI Assistant
            </DialogTitle>
            <DialogDescription>
              Let's create a professional summary that highlights your strengths.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">
                {questions[currentQuestion]}
              </p>
              <Textarea 
                value={currentAnswer} 
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="min-h-[100px]"
                placeholder="Type your answer here..."
              />
            </div>

            <div className="text-xs text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAIDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleNextQuestion}
              disabled={isGenerating}
              className="bg-gradient-to-r from-resume-primary to-resume-secondary hover:opacity-90 text-white"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Generate Summary'}
              {isGenerating && <span className="ml-2 animate-spin">↻</span>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};
