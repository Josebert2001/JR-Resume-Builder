import { ResumeData, TemplateType } from '@/context/ResumeContext';

export const generatePDF = async (resumeData: ResumeData, _template: TemplateType): Promise<void> => {
  const element = document.getElementById('resume-content');
  if (!element) {
    throw new Error('Resume preview not found. Please make sure you are on the Preview step.');
  }

  const firstName = resumeData.personalInfo?.firstName ?? 'Resume';
  const lastName = resumeData.personalInfo?.lastName ?? '';
  const filename = `${firstName}${lastName ? '-' + lastName : ''}-Resume`.replace(/\s+/g, '-');

  // Collect stylesheets from the current page so the print window renders identically
  const linkTags = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .map(el => `<link rel="stylesheet" href="${el.href}" />`)
    .join('\n');

  const inlineStyles = Array.from(document.querySelectorAll('style'))
    .map(el => `<style>${el.textContent ?? ''}</style>`)
    .join('\n');

  const printWindow = window.open('', '_blank', 'width=850,height=1100');
  if (!printWindow) {
    throw new Error('Pop-up blocked. Please allow pop-ups for this site and try again.');
  }

  printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${filename}</title>
  ${linkTags}
  ${inlineStyles}
  <style>
    @page { size: A4; margin: 0; }
    html, body { margin: 0; padding: 0; background: white; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  </style>
</head>
<body>
  <div id="resume-content">${element.innerHTML}</div>
</body>
</html>`);
  printWindow.document.close();

  const doPrint = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.addEventListener('afterprint', () => printWindow.close());
  };

  if (printWindow.document.readyState === 'complete') {
    setTimeout(doPrint, 150);
  } else {
    printWindow.addEventListener('load', () => setTimeout(doPrint, 150));
  }
};
