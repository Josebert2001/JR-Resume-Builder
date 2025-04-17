import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Card } from './ui/card';
import { Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { FormWrapper } from './FormWrapper';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with a focus on readability',
    preview: '/templates/modern.png'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional layout perfect for corporate environments',
    preview: '/templates/professional.png'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with a unique and bold design',
    preview: '/templates/creative.png'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with focus on content',
    preview: '/templates/minimal.png'
  }
];

export const ResumeTemplates = () => {
  const { template, setTemplate } = useResumeContext();
  const isMobile = useIsMobile();

  return (
    <FormWrapper
      title="Choose a Template"
      description="Select a template that best represents your professional style"
      nextDisabled={!template}
      showBackButton={false}
    >
      <div className={cn(
        "grid gap-6",
        isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
      )}>
        {templates.map((t) => (
          <TouchRipple key={t.id} className="rounded-lg">
            <Card
              className={cn(
                "relative overflow-hidden transition-all duration-200 cursor-pointer h-full",
                template === t.id && "ring-2 ring-resume-primary",
                isMobile ? "active:scale-[0.98]" : "hover:shadow-lg",
              )}
              onClick={() => setTemplate(t.id)}
            >
              {/* Preview Image */}
              <div className="relative aspect-[3/4] border-b">
                <img
                  src={t.preview}
                  alt={`${t.name} template preview`}
                  className="object-cover w-full h-full"
                />
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
          </TouchRipple>
        ))}
      </div>
    </FormWrapper>
  );
};
