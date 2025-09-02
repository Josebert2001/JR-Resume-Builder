import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumeData, TemplateType } from '@/context/ResumeContext';
import { ProfessionalPDFTemplate } from '@/components/pdf-templates/ProfessionalPDFTemplate';
import { ModernPDFTemplate } from '@/components/pdf-templates/ModernPDFTemplate';
import { MinimalPDFTemplate } from '@/components/pdf-templates/MinimalPDFTemplate';
import { CreativePDFTemplate } from '@/components/pdf-templates/CreativePDFTemplate';

export const generatePDF = async (resumeData: ResumeData, template: TemplateType) => {
  // Format data for PDF templates
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

  // Select the appropriate PDF template
  let PDFComponent;
  switch (template) {
    case 'professional':
      PDFComponent = ProfessionalPDFTemplate;
      break;
    case 'modern':
      PDFComponent = ModernPDFTemplate;
      break;
    case 'minimal':
      PDFComponent = MinimalPDFTemplate;
      break;
    case 'creative':
      PDFComponent = CreativePDFTemplate;
      break;
    default:
      PDFComponent = ProfessionalPDFTemplate;
  }

  // Generate PDF blob
  const pdfBlob = await pdf(<PDFComponent data={formattedData} />).toBlob();
  
  // Create download link
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${formattedData.personalInfo.firstName}-${formattedData.personalInfo.lastName}-Resume.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};