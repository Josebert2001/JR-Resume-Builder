
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
import { HelpCircle, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

export const PersonalInfoForm = () => {
  const { personalInfo, updatePersonalInfo, nextStep } = useResumeContext();
  const { toast } = useToast();
  const isMobile = useIsMobile();
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

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.form 
      initial="hidden"
      animate="visible"
      variants={formVariants}
      onSubmit={handleSubmit} 
      className="space-y-6 animate-in fade-in-50 px-4 sm:px-6 md:px-0 max-w-3xl mx-auto"
    >
      <div className="space-y-6">
        <motion.div variants={itemVariants} className="grid gap-5 sm:grid-cols-2">
          <div className="form-field">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={personalInfo.firstName}
              onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
              className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
              required
            />
          </div>
          <div className="form-field">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              value={personalInfo.lastName}
              onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
              className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="form-field">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="form-field">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="form-field">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </Label>
          <Input
            id="location"
            placeholder="City, Country"
            value={personalInfo.location || ''}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="form-field">
          <Label htmlFor="portfolio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Portfolio URL
          </Label>
          <Input
            id="portfolio"
            type="url"
            placeholder="https://your-portfolio.com"
            value={personalInfo.portfolio || ''}
            onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
            className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="form-field">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Professional Summary
            </Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAIDialogOpen(true)}
              className="text-xs flex items-center gap-1.5 text-resume-primary hover:text-white hover:bg-resume-primary transition-colors duration-300"
            >
              <Sparkles size={14} className="animate-pulse" />
              AI Help
            </Button>
          </div>
          <Textarea
            id="summary"
            placeholder="Write a brief summary of your professional background and goals..."
            value={personalInfo.summary || ''}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            className="mt-1.5 w-full min-h-[120px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20 resize-none"
            required
          />
        </motion.div>
      </div>

      <motion.div 
        variants={itemVariants}
        className="flex justify-end pt-6"
      >
        <Button 
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-resume-primary to-resume-secondary hover:opacity-90 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Next Step
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>

      {/* AI Dialog for professional summary generation */}
      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-0 shadow-xl mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-resume-primary dark:text-blue-400">
              <MessageSquare size={18} className="text-resume-primary dark:text-blue-400" />
              Resume AI Assistant
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Let's create a professional summary that highlights your strengths.
            </DialogDescription>
          </DialogHeader>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-4"
          >
            <div className="mb-4">
              <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                {questions[currentQuestion]}
              </p>
              <Textarea 
                value={currentAnswer} 
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="min-h-[100px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-resume-primary focus:ring-resume-primary/20"
                placeholder="Type your answer here..."
              />
            </div>

            <div className="text-xs text-muted-foreground flex items-center">
              <span className="inline-block w-6 h-1.5 bg-resume-primary rounded-full mr-2"></span>
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </motion.div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 mt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsAIDialogOpen(false)}
              className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleNextQuestion}
              disabled={isGenerating}
              className="bg-gradient-to-r from-resume-primary to-resume-secondary hover:opacity-90 text-white transition-all duration-300 w-full sm:w-auto"
            >
              {currentQuestion < questions.length - 1 ? (
                <>Next Question <ArrowRight size={16} className="ml-2" /></>
              ) : (
                <>Generate Summary {isGenerating && <span className="ml-2 animate-spin">↻</span>}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.form>
  );
};
