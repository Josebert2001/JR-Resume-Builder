
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResumeContext } from '@/context/ResumeContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TouchRipple } from './ui/touch-ripple';
import { ZoomIn, ZoomOut, Maximize2, Download, Settings, Eye, Printer } from 'lucide-react';
import { FormattedResume } from './FormattedResume';
import { usePDF } from 'react-to-pdf';
import { toast } from 'sonner';
import { printResume } from '@/utils/printPdf';

export const ResumePreview = () => {
  const { resumeData, template } = useResumeContext();
  const previewRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPdfOptions, setShowPdfOptions] = useState(false);
  const isMobile = useIsMobile();
  
  // PDF options state
  const [pdfOptions, setPdfOptions] = useState({
    format: 'a4',
    orientation: 'portrait',
    margin: 15,
    filename: 'resume.pdf'
  });
  
  // Utility to map page format to exact millimeter dimensions
  const getPageDimensions = (format: string, orientation: 'portrait' | 'landscape') => {
    const base = (() => {
      switch (format) {
        case 'a4':
          return { widthMm: 210, heightMm: 297 };
        case 'legal':
          return { widthMm: 216, heightMm: 356 };
        case 'letter':
        default:
          return { widthMm: 216, heightMm: 279 };
      }
    })();
    return orientation === 'landscape'
      ? { widthMm: base.heightMm, heightMm: base.widthMm }
      : base;
  };

  // usePDF hook with dynamic options
  const { toPDF, targetRef } = usePDF({
    filename: pdfOptions.filename,
    page: {
      format: pdfOptions.format as any,
      orientation: pdfOptions.orientation as 'portrait' | 'landscape',
      margin: pdfOptions.margin
    },
    method: 'save'
  });

  const pageDims = getPageDimensions(pdfOptions.format, pdfOptions.orientation as 'portrait' | 'landscape');
  // Update filename when user data changes
  useEffect(() => {
    const firstName = resumeData.personalInfo?.firstName || '';
    const lastName = resumeData.personalInfo?.lastName || '';
    if (firstName || lastName) {
      setPdfOptions(prev => ({
        ...prev,
        filename: `${firstName}_${lastName}_Resume`.replace(/\s+/g, '_') + '.pdf'
      }));
    }
  }, [resumeData.personalInfo?.firstName, resumeData.personalInfo?.lastName]);

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(newScale, 0.5), 2);
    });
  };

  const handleFitToScreen = () => {
    if (previewRef.current) {
      const containerWidth = previewRef.current.clientWidth;
      const containerHeight = previewRef.current.clientHeight;
      const contentWidth = 816; // Standard US Letter width in pixels at 96 DPI
      const contentHeight = 1056; // Standard US Letter height in pixels at 96 DPI
      
      const widthRatio = containerWidth / contentWidth;
      const heightRatio = containerHeight / contentHeight;
      
      setScale(Math.min(widthRatio, heightRatio, 1));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setIsPanning(true);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      setStartPoint({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentPoint = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };

      const deltaX = currentPoint.x - startPoint.x;
      const deltaY = currentPoint.y - startPoint.y;

      setScrollPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));

      setStartPoint(currentPoint);
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      if (!targetRef.current) {
        toast.error('Failed to prepare PDF', {
          description: 'Export target not available'
        });
        return;
      }

      // Ensure web fonts are loaded before rendering
      if ('fonts' in document && (document as any).fonts?.ready) {
        try {
          await (document as any).fonts.ready;
        } catch {}
      }

      // Wait a frame to ensure DOM is painted
      await new Promise((res) => requestAnimationFrame(() => res(undefined)));

      await toPDF();

      toast.success('Resume successfully downloaded!', {
        description: `Your resume has been saved as ${pdfOptions.filename}`
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume', {
        description: 'Please try again or use a different browser'
      });
    } finally {
      setIsDownloading(false);
    }
  };
  // Toggle PDF options panel
  const togglePdfOptions = () => {
    setShowPdfOptions(prev => !prev);
  };

  // Update PDF option
  const updatePdfOption = (key: string, value: any) => {
    setPdfOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset scroll position when scale changes
  useEffect(() => {
    setScrollPosition({ x: 0, y: 0 });
  }, [scale]);

  // Auto-fit to screen on initial render
  useEffect(() => {
    handleFitToScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-full">
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <TouchRipple className="rounded-full">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleZoom('out')}
            disabled={scale <= 0.5}
            className={cn(isMobile && "h-12 w-12")}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </TouchRipple>
        
        <TouchRipple className="rounded-full">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleZoom('in')}
            disabled={scale >= 2}
            className={cn(isMobile && "h-12 w-12")}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </TouchRipple>

        <TouchRipple className="rounded-full">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleFitToScreen}
            className={cn(isMobile && "h-12 w-12")}
            aria-label="Fit to screen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </TouchRipple>

        <TouchRipple className="rounded-full">
          <Button
            variant="secondary"
            size="icon"
            onClick={togglePdfOptions}
            className={cn(isMobile && "h-12 w-12")}
            aria-label="PDF options"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </TouchRipple>

        <TouchRipple className="rounded-full">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => printResume('resume-print-area')}
            className={cn(isMobile && "h-12 w-12")}
            aria-label="Print to PDF"
          >
            <Printer className="h-4 w-4" />
          </Button>
        </TouchRipple>

        <TouchRipple className="rounded-full">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleDownload}
            disabled={isDownloading}
            className={cn(isMobile && "h-12 w-12")}
            aria-label="Download resume"
          >
            {isDownloading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </TouchRipple>
      </div>

      {showPdfOptions && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-10 w-72 border border-border">
          <h3 className="text-sm font-medium mb-2">PDF Options</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="pdf-format" className="block text-sm mb-1">Paper Format</label>
              <select
                id="pdf-format"
                className="w-full p-2 text-sm rounded border border-input bg-transparent"
                value={pdfOptions.format}
                onChange={(e) => updatePdfOption('format', e.target.value)}
              >
                <option value="letter">US Letter</option>
                <option value="a4">A4</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="pdf-orientation" className="block text-sm mb-1">Orientation</label>
              <select
                id="pdf-orientation"
                className="w-full p-2 text-sm rounded border border-input bg-transparent"
                value={pdfOptions.orientation}
                onChange={(e) => updatePdfOption('orientation', e.target.value)}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="pdf-margin" className="block text-sm mb-1">Margin (mm)</label>
              <input
                id="pdf-margin"
                type="number"
                min="0"
                max="50"
                className="w-full p-2 text-sm rounded border border-input bg-transparent"
                value={pdfOptions.margin}
                onChange={(e) => updatePdfOption('margin', parseInt(e.target.value, 10))}
              />
            </div>
            
            <div>
              <label htmlFor="pdf-filename" className="block text-sm mb-1">Filename</label>
              <input
                id="pdf-filename"
                type="text"
                className="w-full p-2 text-sm rounded border border-input bg-transparent"
                value={pdfOptions.filename}
                onChange={(e) => updatePdfOption('filename', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Off-screen export container for PDF (unscaled, exact page size) */}
      <div
        id="resume-print-area"
        ref={targetRef}
        aria-hidden="true"
        className="bg-background"
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: `${pageDims.widthMm}mm`,
          minHeight: `${pageDims.heightMm}mm`,
          padding: 0,
          margin: 0,
          boxShadow: 'none',
          transform: 'none',
          background: 'white'
        }}
      >
        <div className="w-full h-full">
          <FormattedResume template={template} resumeData={resumeData} />
        </div>
      </div>

      <div 
        ref={previewRef}
        className="h-full w-full overflow-auto bg-muted rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="min-h-full w-full flex items-center justify-center p-4"
          style={{
            transform: `scale(${scale}) translate(${scrollPosition.x}px, ${scrollPosition.y}px)`,
            transformOrigin: 'center',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          <Card className="w-[816px] h-[1056px] shadow-lg overflow-hidden" ref={resumeRef}>
            <FormattedResume template={template} resumeData={resumeData} />
          </Card>
        </div>
      </div>
    </div>
  );
};
