import React from 'react';
import html2canvas from 'html2canvas';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, Image as PDFImage } from '@react-pdf/renderer';
import { ResumeData, TemplateType } from '@/context/ResumeContext';

// Slices a canvas into an A4-tall chunk at a given vertical offset
function sliceCanvas(source: HTMLCanvasElement, yStart: number, sliceHeight: number): string {
  const slice = document.createElement('canvas');
  slice.width = source.width;
  slice.height = sliceHeight;
  const ctx = slice.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, slice.width, sliceHeight);
  ctx.drawImage(source, 0, -yStart);
  return slice.toDataURL('image/png');
}

export const generatePDF = async (resumeData: ResumeData, _template: TemplateType) => {
  // Find the resume element rendered in the preview
  const element = document.getElementById('resume-content');
  if (!element) {
    throw new Error('Resume preview not found. Please make sure you are on the Preview step.');
  }

  // Capture the exact HTML rendering at 2× resolution
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    allowTaint: false,
  });

  // A4 dimensions in PDF points (72 pt/in)
  const A4_W_PT = 595.28;
  const A4_H_PT = 841.89;

  // Scale canvas to A4 width, then compute proportional height in PDF points
  const scale = A4_W_PT / canvas.width;
  const totalPdfHeight = canvas.height * scale;

  // How many canvas pixels correspond to one PDF page height
  const canvasPageHeight = A4_H_PT / scale;
  const numPages = Math.ceil(totalPdfHeight / A4_H_PT);

  // Build one image per page by slicing the canvas
  const pageImages: string[] = [];
  for (let i = 0; i < numPages; i++) {
    const yStart = Math.round(i * canvasPageHeight);
    const sliceH = Math.min(Math.round(canvasPageHeight), canvas.height - yStart);
    if (sliceH <= 0) break;
    pageImages.push(sliceCanvas(canvas, yStart, sliceH));
  }

  const firstName = resumeData.personalInfo?.firstName || 'Resume';
  const lastName = resumeData.personalInfo?.lastName || '';

  const MyDocument = () => (
    <Document>
      {pageImages.map((imgData, i) => (
        <Page key={i} size="A4" style={{ padding: 0, margin: 0 }}>
          <PDFImage
            src={imgData}
            style={{ width: A4_W_PT, height: A4_H_PT }}
          />
        </Page>
      ))}
    </Document>
  );

  const pdfBlob = await pdf(<MyDocument />).toBlob();

  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${firstName}-${lastName}-Resume.pdf`.replace(/\s+/g, '-');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
