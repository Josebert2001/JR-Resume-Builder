
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResumeContext } from '@/context/ResumeContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TouchRipple } from './ui/touch-ripple';
import { ZoomIn, ZoomOut, Maximize2, Download, Eye } from 'lucide-react';
import { FormattedResume } from './FormattedResume';
import { usePDF } from 'react-to-pdf';
import { toast } from 'sonner';

export const ResumePreview = () => {
  const { resumeData, template } = useResumeContext();
  const previewRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  const isMobile = useIsMobile();
  
  // Replace toPDF with usePDF hook
  const { toPDF, targetRef } = usePDF({
    filename: 'resume.pdf',
    page: {
      format: 'letter',
      orientation: 'portrait',
      margin: 0
    }
  });

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
    if (!resumeRef.current) return;

    try {
      setIsDownloading(true);
      const firstName = resumeData.personalInfo?.firstName || '';
      const lastName = resumeData.personalInfo?.lastName || '';
      const filename = `${firstName}_${lastName}_Resume`.replace(/\s+/g, '_');
      
      // Use the toPDF function from the usePDF hook
      await toPDF();
      
      toast.success('Resume successfully downloaded!');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset scroll position when scale changes
  useEffect(() => {
    setScrollPosition({ x: 0, y: 0 });
  }, [scale]);

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
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </TouchRipple>

        <TouchRipple className="rounded-full">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleDownload}
            disabled={isDownloading}
            className={cn(isMobile && "h-12 w-12")}
          >
            {isDownloading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </TouchRipple>
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
          <Card className="w-[816px] h-[1056px] shadow-lg overflow-hidden" ref={targetRef || resumeRef}>
            <FormattedResume template={template} resumeData={resumeData} />
          </Card>
        </div>
      </div>
    </div>
  );
};
