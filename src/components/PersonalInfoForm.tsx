import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paintbrush } from 'lucide-react';

const PersonalInfoForm = () => {
  const { resumeData, updateResumeData, setCurrentStep } = useResumeContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleSelectTemplate = () => {
    setCurrentStep(1);
  };

  React.useEffect(() => {
    // Set empty default values to encourage user input
    updateResumeData({ 
      email: '', 
      phone: '' 
    });
  }, []);

  return (
    <form onSubmit={handleSubmit} className="resume-form max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-resume-primary">Personal Information</h2>
        <Button
          type="button"
          onClick={handleSelectTemplate}
          variant="outline"
          className="flex items-center gap-2 border-resume-primary text-resume-primary hover:bg-resume-light"
        >
          <Paintbrush size={16} />
          Choose Template
        </Button>
      </div>

      <div className="space-y-6">
        <div className="input-group">
          <Label htmlFor="name" className="block mb-2">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={resumeData.name}
            onChange={(e) => updateResumeData({ name: e.target.value })}
            placeholder="e.g. John Smith"
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
            placeholder="e.g. john.smith@example.com"
            required
            className="w-full"
          />
        </div>

        <div className="input-group">
          <Label htmlFor="phone" className="block mb-2">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={resumeData.phone}
            onChange={(e) => updateResumeData({ phone: e.target.value })}
            placeholder="e.g. +1 234 567 8900"
            required
            className="w-full"
          />
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-resume-primary hover:bg-resume-secondary text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
