
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useResumeContext } from '@/context/ResumeContext';
import { ArrowRight, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateProfessionalSummary } from '@/services/resumeAI';
import { toast } from 'sonner';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export const PersonalInfoForm = () => {
  const { personalInfo, updatePersonalInfo, nextStep, resumeData } = useResumeContext();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!personalInfo.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!personalInfo.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!personalInfo.email?.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email))
      newErrors.email = 'Enter a valid email address';
    if (!personalInfo.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!personalInfo.location?.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) nextStep();
  };

  const clearError = (field: keyof FieldErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const canGenerate =
    !!(personalInfo.firstName?.trim() || personalInfo.lastName?.trim() || personalInfo.email?.trim());

  const handleGenerateSummary = async () => {
    if (isGeneratingSummary) return;
    setIsGeneratingSummary(true);

    const workExperience = resumeData.workExperience || [];
    const skills = (resumeData.skills || []).map((s) => s.name);
    const role = workExperience[0]?.position ?? '';
    const experienceText = workExperience
      .map((w) => `${w.position} at ${w.company}: ${w.description || ''}`.trim())
      .join('\n');

    try {
      const summary = await generateProfessionalSummary(role, '', experienceText, skills);
      if (summary) {
        updatePersonalInfo({ summary });
        toast.success('Summary generated — feel free to edit it.');
      } else {
        toast.error('AI returned an empty summary. Please try again.');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not generate summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <motion.form
      initial="hidden"
      animate="visible"
      variants={formVariants}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 px-4 sm:px-6 md:px-0 max-w-3xl mx-auto"
    >
      <div className="space-y-5">
        <motion.div variants={itemVariants} className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              data-testid="input-firstName"
              placeholder="Enter your first name"
              value={personalInfo.firstName}
              onChange={(e) => { updatePersonalInfo({ firstName: e.target.value }); clearError('firstName'); }}
              className="mt-1.5 w-full"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />{errors.firstName}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              data-testid="input-lastName"
              placeholder="Enter your last name"
              value={personalInfo.lastName}
              onChange={(e) => { updatePersonalInfo({ lastName: e.target.value }); clearError('lastName'); }}
              className="mt-1.5 w-full"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />{errors.lastName}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            data-testid="input-email"
            type="email"
            placeholder="your.email@example.com"
            value={personalInfo.email}
            onChange={(e) => { updatePersonalInfo({ email: e.target.value }); clearError('email'); }}
            className="mt-1.5 w-full"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />{errors.email}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            data-testid="input-phone"
            type="tel"
            placeholder="Your phone number"
            value={personalInfo.phone}
            onChange={(e) => { updatePersonalInfo({ phone: e.target.value }); clearError('phone'); }}
            className="mt-1.5 w-full"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />{errors.phone}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            data-testid="input-location"
            placeholder="City, Country"
            value={personalInfo.location || ''}
            onChange={(e) => { updatePersonalInfo({ location: e.target.value }); clearError('location'); }}
            className="mt-1.5 w-full"
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />{errors.location}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Label htmlFor="portfolio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Portfolio URL <span className="text-stone-400 font-normal text-xs">(optional)</span>
          </Label>
          <Input
            id="portfolio"
            data-testid="input-portfolio"
            type="url"
            placeholder="https://your-portfolio.com"
            value={personalInfo.portfolio || ''}
            onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
            className="mt-1.5 w-full"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="summary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Professional Summary <span className="text-stone-400 font-normal text-xs">(optional)</span>
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="button-generate-summary"
              disabled={!canGenerate || isGeneratingSummary}
              onClick={handleGenerateSummary}
              className="h-7 gap-1.5 text-xs border-[#c3ddd2] text-[#2d6a4f] hover:bg-[#f0f7f4] dark:border-[#2d5040] dark:text-[#5aad8a] dark:hover:bg-[#1e3528] disabled:opacity-50"
            >
              {isGeneratingSummary ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              {isGeneratingSummary ? 'Generating…' : 'Generate with AI'}
            </Button>
          </div>
          <Textarea
            id="summary"
            data-testid="textarea-summary"
            placeholder="A brief professional summary that highlights your experience, skills, and goals. Click 'Generate with AI' to create one automatically."
            value={personalInfo.summary || ''}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            rows={4}
            className="w-full resize-none"
          />
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="flex justify-end pt-4 sticky bottom-0 pb-4 bg-white/90 dark:bg-[#1a1510]/90 backdrop-blur-sm sm:static sm:bg-transparent sm:backdrop-blur-none sm:pb-0"
      >
        <Button
          type="submit"
          data-testid="button-personal-info-next"
          className="w-full sm:w-auto bg-gradient-to-r from-resume-primary to-resume-secondary hover:opacity-90 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md"
        >
          Next Step
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </motion.form>
  );
};
