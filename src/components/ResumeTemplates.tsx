import React, { useState } from 'react';
import { useResumeContext, TemplateType } from '@/context/ResumeContext';
import { Card } from './ui/card';
import { Check, Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { FormWrapper } from './FormWrapper';
import { TemplatePreview } from './TemplatePreview';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';

// Simplified templates - only 4 main templates
const templates = [
  {
    id: 'professional' as TemplateType,
    name: 'Professional',
    description: 'Traditional layout perfect for corporate environments',
    preview: '/templates/professional.png',
    atsCompatible: true
  },
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
  },
  {
    id: 'minimal' as TemplateType,
    name: 'Minimal',
    description: 'Simple and elegant with focus on content',
    preview: '/templates/minimal.png',
    atsCompatible: true
  }
];

export const ResumeTemplates = () => {
  const { template, setTemplate, nextStep } = useResumeContext();
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Calculate how many templates to show at once based on screen size
  const templatesPerView = isMobile ? 1 : 4;
  const visibleTemplates = templates.slice(
    activeIndex,
    activeIndex + templatesPerView
  );

  const handleNextTemplates = () => {
    if (activeIndex < templates.length - templatesPerView) {
      setActiveIndex(prev => prev + 1);
    } else {
      setActiveIndex(0); // Loop back to start
    }
  };

  const handleContinue = () => {
    if (template) {
      nextStep();
    }
  };

  return (
    <FormWrapper
      title="Choose a Template"
      description="Select a template that best represents your professional style"
      nextDisabled={true}
      showBackButton={false}
    >
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-2">
          Choose the template that best highlights your strengths and matches your target industry.
        </div>
      </div>
      
      {/* Mobile Indicator */}
      {isMobile && (
        <div className="flex justify-center items-center mb-4">
          <span className="text-sm text-muted-foreground">
            Template {activeIndex + 1} of {templates.length}
          </span>
        </div>
      )}
      
      <div className="relative">
        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-300",
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
              <div className="relative aspect-[3/4] border-b">
                <TemplatePreview template={t.id} />
                
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
                
                {template === t.id && (
                  <div className="absolute inset-0 bg-resume-primary/10 flex items-center justify-center">
                    <div className="bg-resume-primary text-white rounded-full p-2">
                      <Check className="h-6 w-6" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex flex-col gap-4 items-center">
          {templates.length > templatesPerView && (
            <Button
              onClick={handleNextTemplates}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Browse More Templates
            </Button>
          )}
          
          <Button
            onClick={handleContinue}
            disabled={!template}
            className="w-full sm:w-auto bg-resume-primary hover:bg-resume-secondary text-white"
          >
            Continue with Selected Template
          </Button>
        </div>
        
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

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-medium mb-2">About Resume Templates</h3>
        <p className="text-sm text-muted-foreground">
          Different templates serve different purposes. Professional and Minimal templates are ATS-friendly and work well for traditional industries. Modern offers a contemporary look while maintaining professionalism, and Creative provides a unique design for creative fields.
        </p>
      </div>
    </FormWrapper>
  );
};