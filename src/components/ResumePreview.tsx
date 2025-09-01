import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { FormattedResume } from './FormattedResume';
import { useResumeContext } from '@/context/ResumeContext';

interface ResumePreviewProps {
  className?: string;
}

export function ResumePreview({ className }: ResumePreviewProps) {
  const { resumeData, template } = useResumeContext();

  const handlePrint = () => {
    const printContent = document.getElementById('resume-card');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Resume</title>
              <style>
                @media print {
                  body { margin: 0; padding: 20px; }
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Preview</h2>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <Card id="resume-card" className="w-full max-w-4xl mx-auto bg-white shadow-lg">
        <CardContent className="p-8">
          <FormattedResume template={template} resumeData={resumeData} />
        </CardContent>
      </Card>
    </div>
  );
}