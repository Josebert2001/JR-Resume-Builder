import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useResumeContext } from '@/context/ResumeContext';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { analytics } from '../services/analytics';

export const PersonalInfoForm = () => {
  const { personalInfo, updatePersonalInfo, nextStep, resumeData, updateResumeData } = useResumeContext();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.trackUserEngagement('personal_info_completed', 'resume_builder');
    nextStep();
  };

  const handleTargetJobChange = (value: string) => {
    updateResumeData({ targetJobDescription: value });
    if (value.length > 50) {
      analytics.trackUserEngagement('target_job_added', 'personalization');
    }
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
              {t('personalInfo.firstName')}
            </Label>
            <Input
              id="firstName"
              placeholder={t('personalInfo.firstName')}
              value={personalInfo.firstName}
              onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
              className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
              aria-label={t('personalInfo.firstName')}
              required
            />
          </div>
          <div className="form-field">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('personalInfo.lastName')}
            </Label>
            <Input
              id="lastName"
              placeholder={t('personalInfo.lastName')}
              value={personalInfo.lastName}
              onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
              className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
              aria-label={t('personalInfo.lastName')}
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="form-field">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('personalInfo.email')}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t('personalInfo.email')}
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
            aria-label={t('personalInfo.email')}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="form-field">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('personalInfo.phone')}
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t('personalInfo.phone')}
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
            aria-label={t('personalInfo.phone')}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="form-field">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('personalInfo.location')}
          </Label>
          <Input
            id="location"
            placeholder={t('personalInfo.location')}
            value={personalInfo.location || ''}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
            aria-label={t('personalInfo.location')}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="form-field">
          <Label htmlFor="portfolio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('personalInfo.portfolio')}
          </Label>
          <Input
            id="portfolio"
            type="url"
            placeholder={t('personalInfo.portfolio')}
            value={personalInfo.portfolio || ''}
            onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
            className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20"
            aria-label={t('personalInfo.portfolio')}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="form-field">
          <Label htmlFor="targetJob" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('personalInfo.targetJob')}
          </Label>
          <Textarea
            id="targetJob"
            placeholder={t('personalInfo.targetJobPlaceholder')}
            value={resumeData.targetJobDescription || ''}
            onChange={(e) => handleTargetJobChange(e.target.value)}
            className="mt-1.5 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-resume-primary focus:ring-resume-primary/20 min-h-[120px]"
            aria-label={t('personalInfo.targetJob')}
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps our AI provide more personalized suggestions throughout the resume building process.
          </p>
        </motion.div>
      </div>

      <motion.div 
        variants={itemVariants}
        className="flex justify-end pt-6"
      >
        <Button 
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-resume-primary to-resume-secondary hover:opacity-90 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          aria-label={t('common.next')}
        >
          {t('common.next')}
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </motion.form>
  );
};