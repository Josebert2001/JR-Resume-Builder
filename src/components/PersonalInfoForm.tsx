
import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PersonalInfoForm = () => {
  const { resumeData, updateResumeData, setCurrentStep } = useResumeContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit} className="resume-form animate-fade-in">
      <h2 className="text-2xl font-bold text-resume-primary mb-6">Personal Information</h2>

      <div className="input-group">
        <Label htmlFor="name" className="block mb-2">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={resumeData.name}
          onChange={(e) => updateResumeData({ name: e.target.value })}
          placeholder="e.g. John Doe"
          required
          className="w-full"
        />
      </div>

      <div className="input-group">
        <Label htmlFor="email" className="block mb-2">Email</Label>
        <Input
          id="email"
          type="email"
          value={resumeData.email}
          onChange={(e) => updateResumeData({ email: e.target.value })}
          placeholder="e.g. john.doe@example.com"
          required
          className="w-full"
        />
      </div>

      <div className="input-group">
        <Label htmlFor="phone" className="block mb-2">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={resumeData.phone}
          onChange={(e) => updateResumeData({ phone: e.target.value })}
          placeholder="e.g. +234 800 1234 567"
          required
          className="w-full"
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button type="submit" className="bg-resume-primary hover:bg-resume-secondary text-white">
          Next
        </Button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
