import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Printer } from 'lucide-react';
import { FormattedResume } from './FormattedResume';
import { useResumeContext } from '@/context/ResumeContext';
import { generatePDF } from '@/services/pdfService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  className?: string;
}

export function ResumePreview({ className }: ResumePreviewProps) {
  const { resumeData, template } = useResumeContext();

  const handlePrint = () => {
    // Use the browser's native print functionality with our CSS
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating PDF...');
      await generatePDF(resumeData, template);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Preview</h2>
        <div className="flex gap-2 print-hidden">
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div className="resume-preview w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden" data-print="true">
        <div className={cn(
          "p-8",
          "print:p-0 print:shadow-none print:rounded-none"
        )}>
          <FormattedResume template={template} resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}