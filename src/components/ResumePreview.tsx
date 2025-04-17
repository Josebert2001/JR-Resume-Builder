import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResumeContext } from '@/context/ResumeContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TouchRipple } from './ui/touch-ripple';
import { ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';

export const ResumePreview = () => {
  const { resumeData } = useResumeContext();
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

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
            onClick={() => {
              // Download functionality will be implemented later
              console.log('Download resume');
            }}
            className={cn(isMobile && "h-12 w-12")}
          >
            <Download className="h-4 w-4" />
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
          <Card className="w-[816px] h-[1056px] shadow-lg">
            <div className="p-8">
              {/* Resume content will be rendered here */}
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(resumeData, null, 2)}
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
