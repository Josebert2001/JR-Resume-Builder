
import React from 'react';
import { ResumeData, TemplateType } from '@/context/ResumeContext';
import { ProfessionalTemplate } from './resume-templates/ProfessionalTemplate';
import { ModernTemplate } from './resume-templates/ModernTemplate';
import { MinimalTemplate } from './resume-templates/MinimalTemplate';
import { CreativeTemplate } from './resume-templates/CreativeTemplate';

interface FormattedResumeProps {
  template: TemplateType;
  resumeData: ResumeData;
}

export const FormattedResume: React.FC<FormattedResumeProps> = ({ template, resumeData }) => {
  // Format data for the templates
  const formattedData = {
    personalInfo: {
      firstName: resumeData.personalInfo?.firstName || '',
      lastName: resumeData.personalInfo?.lastName || '',
      email: resumeData.personalInfo?.email || '',
      phone: resumeData.personalInfo?.phone || '',
      location: resumeData.personalInfo?.location || '',
      summary: resumeData.personalInfo?.summary || '',
      portfolio: resumeData.personalInfo?.portfolio || '',
    },
    education: resumeData.education || [],
    experience: resumeData.workExperience?.map(exp => ({
      position: exp.position,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.endDate || 'Present',
      description: exp.description,
    })) || [],
    skills: resumeData.skills?.map(skill => skill.name) || [],
    projects: resumeData.projects || [],
    certifications: resumeData.certifications || [],
    linkedIn: resumeData.linkedIn || '',
    githubUrl: resumeData.githubUrl || '',
  };

  // This function renders the appropriate template based on the selected template type
  const renderTemplate = () => {
    switch (template) {
      case 'professional':
        return <ProfessionalTemplate data={formattedData} />;
      case 'modern':
        return <ModernTemplate data={formattedData} />;
      case 'minimal':
        return <MinimalTemplate data={formattedData} />;
      case 'creative':
        return <CreativeTemplate data={formattedData} />;
      default:
        return <ProfessionalTemplate data={formattedData} />;
    }
  };

  return (
    <div className="w-full h-full print:w-[210mm] print:h-[297mm] print:p-0">
      {renderTemplate()}
    </div>
  );
};
