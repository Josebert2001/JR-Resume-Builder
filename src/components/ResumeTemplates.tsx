
import React, { useState } from 'react';
import { useResumeContext, TemplateType } from '@/context/ResumeContext';
import { Card } from './ui/card';
import { Check, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { FormWrapper } from './FormWrapper';
import { Button } from './ui/button';
import { TemplatePreview } from './TemplatePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Organized templates by categories
const templates = {
  traditional: [
    {
      id: 'professional' as TemplateType,
      name: 'Professional',
      description: 'Traditional layout perfect for corporate environments',
      preview: '/templates/professional.png',
      atsCompatible: true
    },
    {
      id: 'chronological' as TemplateType,
      name: 'Chronological',
      description: 'Industry standard format focusing on work history',
      preview: '/templates/chronological.png',
      atsCompatible: true
    },
    {
      id: 'minimal' as TemplateType,
      name: 'Minimal',
      description: 'Simple and elegant with focus on content',
      preview: '/templates/minimal.png',
      atsCompatible: true
    }
  ],
  modern: [
    {
      id: 'modern' as TemplateType,
      name: 'Modern',
      description: 'Clean and contemporary design with a focus on readability',
      preview: '/templates/modern.png',
      atsCompatible: true
    },
    {
      id: 'creative' as TemplateType,
      name: 'Creative',
      description: 'Stand out with a unique and bold design',
      preview: '/templates/creative.png',
      atsCompatible: false
    }
  ],
  specialized: [
    {
      id: 'functional' as TemplateType,
      name: 'Functional',
      description: 'Highlights skills and abilities over work history',
      preview: '/templates/functional.png',
      atsCompatible: true
    },
    {
      id: 'combination' as TemplateType,
      name: 'Combination',
      description: 'Blends chronological history with skills emphasis',
      preview: '/templates/combination.png',
      atsCompatible: true
    },
    {
      id: 'targeted' as TemplateType,
      name: 'Targeted',
      description: 'Customized for specific jobs or industries',
      preview: '/templates/targeted.png',
      atsCompatible: true
    }
  ],
  unique: [
    {
      id: 'infographic' as TemplateType,
      name: 'Infographic',
      description: 'Visual representation of your qualifications and experience',
      preview: '/templates/infographic.png',
      atsCompatible: false
    },
    {
      id: 'profile' as TemplateType,
      name: 'Profile',
      description: 'Focuses on your professional profile and personal brand',
      preview: '/templates/profile.png',
      atsCompatible: false
    },
    {
      id: 'blind' as TemplateType,
      name: 'Blind',
      description: 'Minimizes personal identifiers to reduce bias in hiring',
      preview: '/templates/blind.png',
      atsCompatible: true
    }
  ]
};

export const ResumeTemplates = () => {
  const { template, setTemplate } = useResumeContext();
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<keyof typeof templates>("traditional");
  const [activeIndex, setActiveIndex] = useState(0);

  // Get templates for the active category
  const activeTemplates = templates[activeCategory];
  
  // Calculate how many templates to show at once based on screen size
  const templatesPerView = isMobile ? 1 : 3;
  const canNavigatePrev = activeIndex > 0;
  const canNavigateNext = activeIndex + templatesPerView < activeTemplates.length;

  const handleNext = () => {
    if (canNavigateNext) {
      setActiveIndex(prev => Math.min(prev + 1, activeTemplates.length - templatesPerView));
    }
  };

  const handlePrev = () => {
    if (canNavigatePrev) {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const visibleTemplates = activeTemplates.slice(
    activeIndex,
    activeIndex + templatesPerView
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category as keyof typeof templates);
    setActiveIndex(0); // Reset the index when changing categories
  };

  return (
    <FormWrapper
      title="Choose a Template"
      description="Select a template that best represents your professional style"
      nextDisabled={!template}
      showBackButton={false}
    >
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-2">
          Different resume formats serve different purposes. Choose the one that best highlights your strengths.
        </div>
        
        <Tabs 
          defaultValue="traditional" 
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="traditional">Traditional</TabsTrigger>
            <TabsTrigger value="modern">Modern</TabsTrigger>
            <TabsTrigger value="specialized">Specialized</TabsTrigger>
            <TabsTrigger value="unique">Unique</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Mobile Indicator */}
      {isMobile && (
        <div className="flex justify-center items-center mb-4">
          <span className="text-sm text-muted-foreground">
            Swipe to browse templates ({activeIndex + 1}/{activeTemplates.length})
          </span>
        </div>
      )}
      
      <div className="relative">
        {/* Navigation Buttons - Only on desktop or larger screens */}
        {!isMobile && activeTemplates.length > templatesPerView && (
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
                  
                  {/* ATS Compatible Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                            t.atsCompatible 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          )}>
                            <Info className="h-3 w-3" />
                            {t.atsCompatible ? "ATS Friendly" : "Design Focused"}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {t.atsCompatible 
                            ? "This template is optimized for Applicant Tracking Systems" 
                            : "This creative template may not be ideal for all ATS systems"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  {/* Selected indicator */}
                  {template === t.id && (
                    <div className="absolute inset-0 bg-resume-primary/10 flex items-center justify-center">
                      <div className="bg-resume-primary text-white rounded-full p-2">
                        <Check className="h-6 w-6" />
                      </div>
                    </div>
                  )}
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
            {activeTemplates.map((_, index) => (
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

      {/* Format information section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-medium mb-2">About {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Resume Formats</h3>
        <p className="text-sm text-muted-foreground">
          {activeCategory === "traditional" && (
            "Traditional formats are widely accepted across industries. The chronological format, most popular among employers, emphasizes your work history in reverse chronological order."
          )}
          {activeCategory === "modern" && (
            "Modern formats provide a fresh, contemporary look while maintaining professional standards. They work well for forward-thinking companies and creative fields."
          )}
          {activeCategory === "specialized" && (
            "Specialized formats serve specific purposes. Functional resumes highlight skills over work history, while combination formats blend chronological and functional approaches."
          )}
          {activeCategory === "unique" && (
            "These innovative formats stand out from traditional resumes. Infographic and visual resumes work well in creative industries, while blind resumes help reduce bias in hiring."
          )}
        </p>
      </div>
    </FormWrapper>
  );
};
