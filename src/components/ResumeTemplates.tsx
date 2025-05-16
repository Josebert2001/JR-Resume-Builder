import React, { useState } from 'react';
import { useResumeContext, TemplateType } from '@/context/ResumeContext';
import { Card } from './ui/card';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { FormWrapper } from './FormWrapper';
import { Button } from './ui/button';
import { TemplatePreview } from './TemplatePreview';

const templates = [
  {
    id: 'modern' as TemplateType,
    name: 'Modern',
    description: 'Clean and contemporary design with a focus on readability',
    preview: '/templates/modern.png'
  },
  {
    id: 'professional' as TemplateType,
    name: 'Professional',
    description: 'Traditional layout perfect for corporate environments',
    preview: '/templates/professional.png'
  },
  {
    id: 'creative' as TemplateType,
    name: 'Creative',
    description: 'Stand out with a unique and bold design',
    preview: '/templates/creative.png'
  },
  {
    id: 'minimal' as TemplateType,
    name: 'Minimal',
    description: 'Simple and elegant with focus on content',
    preview: '/templates/minimal.png'
  }
];

export const ResumeTemplates = () => {
  const { template, setTemplate } = useResumeContext();
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  // Calculate how many templates to show at once based on screen size
  const templatesPerView = isMobile ? 1 : 3;
  const canNavigatePrev = activeIndex > 0;
  const canNavigateNext = activeIndex + templatesPerView < templates.length;

  const handleNext = () => {
    if (canNavigateNext) {
      setActiveIndex(prev => Math.min(prev + 1, templates.length - templatesPerView));
    }
  };

  const handlePrev = () => {
    if (canNavigatePrev) {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const visibleTemplates = templates.slice(
    activeIndex,
    activeIndex + templatesPerView
  );

  return (
    <FormWrapper
      title="Choose a Template"
      description="Select a template that best represents your professional style"
      nextDisabled={!template}
      showBackButton={false}
    >
      {/* Mobile Indicator */}
      {isMobile && (
        <div className="flex justify-center items-center mb-4">
          <span className="text-sm text-muted-foreground">
            Swipe to browse templates ({activeIndex + 1}/{templates.length})
          </span>
        </div>
      )}
      
      <div className="relative">
        {/* Navigation Buttons - Only on desktop or larger screens */}
        {!isMobile && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrev}
              disabled={!canNavigatePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10"
              aria-label="Previous template"
            >
              <ChevronLeft />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              disabled={!canNavigateNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10"
              aria-label="Next template"
            >
              <ChevronRight />
            </Button>
          </>
        )}

        <TouchRipple
          className="rounded-lg overflow-hidden"
          onSwipeLeft={canNavigateNext ? handleNext : undefined}
          onSwipeRight={canNavigatePrev ? handlePrev : undefined}
        >
          <div className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300",
            isMobile && "px-4"
          )}>
            {visibleTemplates.map((t) => (
              <Card
                key={t.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-200 cursor-pointer h-full",
                  template === t.id && "ring-2 ring-resume-primary",
                  isMobile ? "active:scale-[0.98]" : "hover:shadow-lg",
                )}
                onClick={() => setTemplate(t.id)}
              >
                {/* Use TemplatePreview component for consistent image handling */}
                <div className="relative aspect-[3/4] border-b">
                  <TemplatePreview template={t.id} />
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">{t.name}</h3>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </TouchRipple>
        
        {/* Template pagination indicators for mobile */}
        {isMobile && (
          <div className="flex justify-center mt-6 gap-2">
            {templates.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to template ${index + 1}`}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === activeIndex ? "bg-resume-primary w-6" : "bg-gray-300"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </FormWrapper>
  );
};
