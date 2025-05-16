
import React from 'react';
import { TemplateType } from '@/context/ResumeContext';

interface TemplatePreviewProps {
  template: TemplateType;
}

export const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  // Map templates to their preview images
  const templateImages: Record<TemplateType, string> = {
    'professional': '/templates/professional.png',
    'modern': '/templates/modern.png',
    'minimal': '/templates/minimal.png',
    'chronological': '/templates/chronological.png',
    'functional': '/templates/functional.png',
    'combination': '/templates/combination.png',
    'infographic': '/templates/infographic.png',
    'profile': '/templates/profile.png',
    'targeted': '/templates/targeted.png',
    'mini': '/templates/mini.png',
    'creative': '/templates/creative.png'
  };

  return (
    <div className="relative w-full h-full overflow-hidden border rounded-md">
      <img 
        src={templateImages[template]} 
        alt={`${template} template preview`} 
        className="object-cover w-full h-full"
        onError={(e) => {
          // Fallback if image doesn't exist
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <p className="text-white capitalize text-sm font-medium">{template}</p>
      </div>
    </div>
  );
};
