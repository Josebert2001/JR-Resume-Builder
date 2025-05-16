
import React, { useState } from 'react';
import { TemplateType } from '@/context/ResumeContext';

interface TemplatePreviewProps {
  template: TemplateType;
}

export const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  const [imageError, setImageError] = useState(false);
  
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
    'creative': '/templates/creative.png',
    'blind': '/templates/blind.png'
  };

  // Use a fallback placeholder if the image doesn't exist
  const imageSrc = imageError 
    ? '/placeholder.svg' 
    : templateImages[template] || '/placeholder.svg';

  return (
    <div className="relative w-full h-full overflow-hidden border rounded-md">
      <img 
        src={imageSrc} 
        alt={`${template} template preview`} 
        className="object-cover w-full h-full"
        onError={() => {
          console.log(`Failed to load image for template: ${template}`);
          setImageError(true);
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <p className="text-white capitalize text-sm font-medium">{template}</p>
      </div>
    </div>
  );
};
