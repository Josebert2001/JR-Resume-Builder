
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useResumeContext } from '@/context/ResumeContext';
import { ArrowRight, AlertCircle, Sparkles, Loader2, X, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateSummaryV2, SummaryVariants } from '@/services/resumeAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

const VERSION_META: Record<string, { label: string; color: string }> = {
  skills_led: { label: 'Skills-Led', color: 'bg-[#eef2ff] text-[#3730a3] border-[#c7d2fe]' },
  goal_led:   { label: 'Goal-Led',   color: 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]' },
  story_led:  { label: 'Story-Led',  color: 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' },
};

export const PersonalInfoForm = () => {
  const { personalInfo, updatePersonalInfo, nextStep, resumeData } = useResumeContext();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryVariants, setSummaryVariants] = useState<SummaryVariants | null>(null);
  const [showVariants, setShowVariants] = useState(false);

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

  const canGenerate = !!(
    personalInfo.firstName?.trim() ||
    personalInfo.lastName?.trim() ||
    personalInfo.email?.trim()
  );

  const handleGenerateSummary = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setShowVariants(false);

    const education = resumeData.education || [];
    const workExperience = resumeData.workExperience || [];
    const skills = resumeData.skills || [];
    const projects = resumeData.projects || [];
    const certs = resumeData.certifications || [];

    const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
    const fieldOfStudy = education[0]?.fieldOfStudy || '';
    const degree = education[0]?.degree || '';
    const careerGoal = workExperience[0]?.position || '';
    const topSkills = skills.map(s => s.name).slice(0, 8).join(', ');

    const bestExperience = workExperience[0]
      ? `${workExperience[0].position} at ${workExperience[0].company}: ${workExperience[0].description || ''}`
      : '';
    const bestProject = projects[0]
      ? `${projects[0].name}: ${projects[0].description || ''} (${projects[0].technologies || ''})`
      : '';
    const certList = certs.map(c => `${c.name} — ${c.issuer}`).join(', ');

    const endYear = education[0]?.graduationDate || '';
    const currentYear = new Date().getFullYear();
    const gradYear = parseInt(endYear) || 0;
    const academicLevel =
      gradYear > currentYear
        ? `Final-year student (expected ${endYear})`
        : gradYear > 0
        ? `Graduate (${endYear})`
        : 'Student';

    try {
      const variants = await generateSummaryV2(
        fullName, fieldOfStudy, degree, academicLevel, careerGoal,
        topSkills, bestExperience, bestProject, certList
      );
      if (variants.summaries.skills_led.text || variants.summaries.goal_led.text) {
        setSummaryVariants(variants);
        setShowVariants(true);
      } else {
        toast.error('AI returned empty summaries. Please try again.');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseVersion = (text: string) => {
    updatePersonalInfo({ summary: text });
    setShowVariants(false);
    toast.success('Summary applied — feel free to edit it');
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

        {/* ─── Professional Summary ─── */}
        <motion.div variants={itemVariants}>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div>
              <Label htmlFor="summary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Professional Summary{' '}
                <span className="text-stone-400 font-normal text-xs">(optional)</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                The first thing a recruiter reads. AI will generate 3 tailored versions for you to choose from.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="button-generate-summary"
              disabled={!canGenerate || isGenerating}
              onClick={handleGenerateSummary}
              className="shrink-0 h-8 gap-1.5 text-xs border-[#c3ddd2] text-[#2d6a4f] hover:bg-[#f0f7f4] dark:border-[#2d5040] dark:text-[#5aad8a] dark:hover:bg-[#1e3528] disabled:opacity-50"
            >
              {isGenerating ? (
                <><Loader2 className="h-3 w-3 animate-spin" />Generating…</>
              ) : (
                <><Sparkles className="h-3 w-3" />Generate 3 Versions</>
              )}
            </Button>
          </div>

          <Textarea
            id="summary"
            data-testid="textarea-summary"
            placeholder="Write a 2–3 sentence professional summary, or click 'Generate 3 Versions' to let AI create tailored options."
            value={personalInfo.summary || ''}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            rows={4}
            className="w-full resize-none"
          />

          {/* ─── 3-version picker panel ─── */}
          {showVariants && summaryVariants && (
            <div className="mt-3 border border-[#d4cfc7] rounded-2xl overflow-hidden bg-[#faf8f5] dark:bg-[#1a1510] dark:border-[#3a3028]">
              {/* Panel header */}
              <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-[#e5ddd0] dark:border-[#3a3028]">
                <div>
                  <p className="text-sm font-semibold text-[#1a1209] dark:text-[#f0ebe3]">Choose your summary</p>
                  {summaryVariants.reason && (
                    <p className="text-xs text-[#8a7560] mt-0.5 leading-snug">{summaryVariants.reason}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowVariants(false)}
                  data-testid="button-dismiss-summary-panel"
                  className="text-[#8a7560] hover:text-[#5c4a2a] transition-colors shrink-0 mt-0.5"
                  aria-label="Close summary picker"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Version cards */}
              {(['skills_led', 'goal_led', 'story_led'] as const).map((key, i) => {
                const version = summaryVariants.summaries[key];
                const meta = VERSION_META[key];
                const isRecommended = summaryVariants.recommended === key;
                if (!version.text) return null;
                return (
                  <div
                    key={key}
                    className={cn(
                      "px-4 py-4 border-b border-[#e5ddd0] dark:border-[#3a3028]",
                      isRecommended && "bg-[#f0fdf6] dark:bg-[#1a2e22]"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", meta.color)}>
                        {meta.label}
                      </span>
                      {isRecommended && (
                        <span className="text-xs font-semibold text-[#2d6a4f] bg-[#e8f5ee] border border-[#b6d9c4] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Star size={10} className="fill-current" />
                          Recommended
                        </span>
                      )}
                    </div>
                    {version.best_for && (
                      <p className="text-xs text-[#8a7560] italic mb-2 leading-snug">
                        Best for: {version.best_for}
                      </p>
                    )}
                    <p className="text-sm text-[#1a1209] dark:text-[#e8ddd0] leading-relaxed mb-3">
                      {version.text}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleUseVersion(version.text)}
                      data-testid={`button-use-summary-${key}`}
                      className="h-7 text-xs bg-[#2d6a4f] hover:bg-[#245c43] text-white"
                    >
                      Use this version
                    </Button>
                  </div>
                );
              })}

              {/* AI tip */}
              {summaryVariants.tip && (
                <div className="px-4 py-3 flex items-start gap-2">
                  <Sparkles size={13} className="text-[#c05621] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5c4a2a] dark:text-[#c8a87a] leading-relaxed">
                    {summaryVariants.tip}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="flex justify-end pt-4 sticky bottom-0 pb-4 bg-white/90 dark:bg-[#1a1510]/90 backdrop-blur-sm sm:static sm:bg-transparent sm:backdrop-blur-none sm:pb-0"
      >
        <Button
          type="submit"
          data-testid="button-personal-info-next"
          className="w-full sm:w-auto bg-[#2d6a4f] hover:bg-[#255c43] text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md"
        >
          Next Step
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </motion.form>
  );
};
