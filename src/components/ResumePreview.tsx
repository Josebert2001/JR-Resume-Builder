import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, Loader2, FileText, Share2, X } from 'lucide-react';
import { FormattedResume } from './FormattedResume';
import { useResumeContext } from '@/context/ResumeContext';
import { generatePDF } from '@/services/pdfService';
import { generateDocx } from '@/services/docxService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ShareableResumePanel } from './ShareableLink';

interface ResumePreviewProps {
  className?: string;
}

export function ResumePreview({ className }: ResumePreviewProps) {
  const { resumeData, template } = useResumeContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);

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

  const handleDownloadWord = async () => {
    if (isGeneratingWord) return;
    setIsGeneratingWord(true);
    const toastId = toast.loading('Building Word document…');
    try {
      await generateDocx(resumeData, template);
      toast.success('Word document downloaded!', { id: toastId });
    } catch (error) {
      console.error('Word generation error:', error);
      toast.error('Could not generate Word document. Please try again.', { id: toastId });
    } finally {
      setIsGeneratingWord(false);
    }
  };

  return (
    <div className={className}>
      {/* Action bar — hidden when printing */}
      <div className="flex items-center justify-between mb-4 print:hidden gap-2 flex-wrap">
        <h2 className="text-2xl font-bold">Preview</h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handlePrint} variant="outline" size="sm" className="print:hidden" data-testid="button-print">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            onClick={handleDownloadWord}
            disabled={isGeneratingWord}
            variant="outline"
            size="sm"
            className="print:hidden"
            data-testid="button-download-word"
          >
            {isGeneratingWord ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            {isGeneratingWord ? 'Building…' : 'Download Word'}
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            variant="outline"
            size="sm"
            className="print:hidden"
            data-testid="button-download-pdf"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Generating…' : 'Download PDF'}
          </Button>
          <Button
            onClick={() => setShowSharePanel(s => !s)}
            variant={showSharePanel ? "default" : "outline"}
            size="sm"
            className={cn("print:hidden", showSharePanel && "bg-[#2d6a4f] hover:bg-[#255c43] text-white")}
            data-testid="button-share-resume"
          >
            {showSharePanel ? <X className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
            {showSharePanel ? 'Close' : 'Share Resume'}
          </Button>
        </div>
      </div>

      {/* Share panel — inline below action bar */}
      {showSharePanel && (
        <div className="mb-6 print:hidden">
          <ShareableResumePanel />
        </div>
      )}

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
