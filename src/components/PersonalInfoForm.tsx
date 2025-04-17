import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useResumeContext } from '@/context/ResumeContext';

export const PersonalInfoForm = () => {
  const { personalInfo, updatePersonalInfo, nextStep } = useResumeContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
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
            value={personalInfo.location}
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
            value={personalInfo.portfolio}
            onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
            className="mt-1.5 w-full px-3 py-2 bg-background border border-input"
          />
        </div>

        <div className="form-field">
          <Label htmlFor="summary" className="text-sm font-medium">
            Professional Summary
          </Label>
          <Textarea
            id="summary"
            placeholder="Write a brief summary of your professional background and goals..."
            value={personalInfo.summary}
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
    </form>
  );
};
