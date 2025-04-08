
import React, { useRef } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, RefreshCw } from 'lucide-react';
import { useReactToPdf } from 'react-to-pdf';
import { toast } from 'sonner';

const ResumePreview = () => {
  const { resumeData, setCurrentStep, setIsGenerating } = useResumeContext();
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const { toPDF, targetRef } = useReactToPdf({
    filename: `${resumeData.name.replace(/\s+/g, '_')}_resume.pdf`,
    options: {
      format: 'a4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    },
  });

  const handleBack = () => {
    setCurrentStep(2);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setCurrentStep(2);
  };

  const handleDownload = () => {
    if (toPDF) {
      toPDF();
      toast.success('Resume downloaded successfully!');
    } else {
      toast.error('Failed to download. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between mb-8">
        <Button 
          type="button" 
          onClick={handleBack}
          variant="outline"
          className="border-resume-primary text-resume-primary flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <div className="flex gap-2">
          <Button 
            type="button" 
            onClick={handleRegenerate}
            variant="outline"
            className="border-resume-primary text-resume-primary flex items-center gap-2"
          >
            <RefreshCw size={16} /> Regenerate
          </Button>
          <Button 
            type="button" 
            onClick={handleDownload}
            className="bg-resume-primary hover:bg-resume-secondary text-white flex items-center gap-2"
          >
            <Download size={16} /> Download PDF
          </Button>
        </div>
      </div>

      <div 
        ref={targetRef as React.RefObject<HTMLDivElement>} 
        className="resume-preview"
      >
        <div className="border-b-2 border-resume-primary pb-4 mb-6">
          <h1 className="text-3xl font-bold text-resume-primary">{resumeData.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-gray-600">
            <p>{resumeData.email}</p>
            <p>{resumeData.phone}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-resume-secondary mb-3">Career Objective</h2>
          <p className="text-gray-700">{resumeData.summary}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-resume-secondary mb-3">Education</h2>
          <div className="ml-2">
            <p className="font-medium">{resumeData.course}</p>
            <p className="text-gray-700">{resumeData.school}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-resume-secondary mb-3">Skills</h2>
          <ul className="list-disc ml-6">
            {resumeData.skills?.map((skill, index) => (
              <li key={index} className="text-gray-700 mb-1">{skill}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-resume-secondary mb-3">Professional Interests</h2>
          <p className="text-gray-700">{resumeData.interests}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
