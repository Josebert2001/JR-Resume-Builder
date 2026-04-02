import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, Loader2 } from 'lucide-react';
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
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    const toastId = toast.loading('Generating PDF from your resume…');
    try {
      await generatePDF(resumeData, template);
      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Could not generate PDF. Try the Print button and save as PDF instead.', {
        id: toastId,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={className}>
      {/* Action bar — hidden when printing */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <h2 className="text-2xl font-bold">Preview</h2>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            variant="outline"
            size="sm"
            className="print:hidden"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Generating…' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Resume content — this is exactly what gets captured for the PDF */}
      <div
        className={cn(
          'resume-preview w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden',
          'print:shadow-none print:rounded-none print:max-w-none print:w-full'
        )}
      >
        <div
          id="resume-content"
          className="print:p-0"
        >
          <FormattedResume template={template} resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}
