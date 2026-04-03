
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useResumeContext } from '@/context/ResumeContext';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const { personalInfo, updatePersonalInfo, nextStep } = useResumeContext();
  const [errors, setErrors] = useState<FieldErrors>({});

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
            type="url"
            placeholder="https://your-portfolio.com"
            value={personalInfo.portfolio || ''}
            onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
            className="mt-1.5 w-full"
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
