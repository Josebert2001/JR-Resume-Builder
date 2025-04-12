
import React from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import type { TemplateType } from '@/context/ResumeContext';

const ResumeTemplates = () => {
  const { resumeData, setTemplate } = useResumeContext();
  
  // Get the currently selected template from resumeData
  const selectedTemplate = resumeData.template || 'professional';
  
  const handleSelectTemplate = (template: TemplateType) => {
    setTemplate(template);
    toast.success(`${template.charAt(0).toUpperCase() + template.slice(1)} template selected!`);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-resume-primary mb-2">Resume Templates</h2>
      <p className="text-gray-600 mb-6">Choose a template that best represents your professional style</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Professional Template */}
        <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'professional' ? 'ring-2 ring-resume-primary' : ''}`}>
          <div className="aspect-w-3 aspect-h-4 bg-gray-100 relative">
            <div className="absolute inset-0 p-4 flex flex-col">
              <div className="h-6 bg-resume-primary mb-3"></div>
              <div className="h-4 w-3/4 bg-gray-300 mb-4"></div>
              <div className="h-3 w-1/2 bg-gray-300 mb-6"></div>
              <div className="h-4 w-1/3 bg-resume-secondary mb-2"></div>
              <div className="flex-1 flex flex-col space-y-2">
                <div className="h-2 bg-gray-200"></div>
                <div className="h-2 bg-gray-200"></div>
                <div className="h-2 w-3/4 bg-gray-200"></div>
              </div>
            </div>
            
            {selectedTemplate === 'professional' && (
              <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900">Professional</h3>
            <p className="text-sm text-gray-500">Clean and traditional design, ideal for most industries</p>
            <Button 
              onClick={() => handleSelectTemplate('professional')}
              variant={selectedTemplate === 'professional' ? 'default' : 'outline'}
              className={`w-full mt-3 ${selectedTemplate === 'professional' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
            >
              {selectedTemplate === 'professional' ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
        
        {/* Modern Template */}
        <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'modern' ? 'ring-2 ring-resume-primary' : ''}`}>
          <div className="aspect-w-3 aspect-h-4 bg-gray-100 relative">
            <div className="absolute inset-0 p-4 flex flex-col">
              <div className="flex space-x-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-resume-secondary"></div>
                <div className="flex-1">
                  <div className="h-4 w-2/3 bg-gray-300 mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-300"></div>
                </div>
              </div>
              <div className="flex space-x-3 mb-4">
                <div className="w-1/3">
                  <div className="h-4 bg-resume-primary mb-2"></div>
                  <div className="h-2 bg-gray-200 mb-1"></div>
                  <div className="h-2 bg-gray-200 mb-1"></div>
                  <div className="h-2 bg-gray-200"></div>
                </div>
                <div className="w-2/3">
                  <div className="h-4 bg-resume-primary mb-2"></div>
                  <div className="h-2 bg-gray-200 mb-1"></div>
                  <div className="h-2 bg-gray-200 mb-1"></div>
                  <div className="h-2 bg-gray-200"></div>
                </div>
              </div>
            </div>
            
            {selectedTemplate === 'modern' && (
              <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900">Modern</h3>
            <p className="text-sm text-gray-500">Contemporary layout with creative touches</p>
            <Button 
              onClick={() => handleSelectTemplate('modern')}
              variant={selectedTemplate === 'modern' ? 'default' : 'outline'}
              className={`w-full mt-3 ${selectedTemplate === 'modern' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
            >
              {selectedTemplate === 'modern' ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
        
        {/* Minimal Template */}
        <div className={`border rounded-lg overflow-hidden ${selectedTemplate === 'minimal' ? 'ring-2 ring-resume-primary' : ''}`}>
          <div className="aspect-w-3 aspect-h-4 bg-gray-100 relative">
            <div className="absolute inset-0 p-4 flex flex-col">
              <div className="h-5 w-1/2 bg-gray-300 mb-6"></div>
              <div className="h-3 w-1/3 bg-gray-200 mb-1"></div>
              <div className="h-3 w-2/3 bg-gray-200 mb-4"></div>
              
              <div className="h-4 w-1/4 bg-gray-300 mb-2"></div>
              <div className="h-2 bg-gray-200 mb-1"></div>
              <div className="h-2 bg-gray-200 mb-1"></div>
              <div className="h-2 w-2/3 bg-gray-200 mb-4"></div>
              
              <div className="h-4 w-1/4 bg-gray-300 mb-2"></div>
              <div className="h-2 bg-gray-200 mb-1"></div>
              <div className="h-2 bg-gray-200 mb-1"></div>
              <div className="h-2 w-3/4 bg-gray-200"></div>
            </div>
            
            {selectedTemplate === 'minimal' && (
              <div className="absolute top-2 right-2 bg-resume-primary text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900">Minimal</h3>
            <p className="text-sm text-gray-500">Simple and elegant design with plenty of white space</p>
            <Button 
              onClick={() => handleSelectTemplate('minimal')}
              variant={selectedTemplate === 'minimal' ? 'default' : 'outline'}
              className={`w-full mt-3 ${selectedTemplate === 'minimal' ? 'bg-resume-primary hover:bg-resume-secondary' : ''}`}
            >
              {selectedTemplate === 'minimal' ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-50 p-4 rounded border">
        <h3 className="font-medium text-gray-900 mb-2">Premium Templates</h3>
        <p className="text-gray-600 mb-4">Unlock our premium templates for more professional options</p>
        <Button className="bg-resume-primary hover:bg-resume-secondary">
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
};

export default ResumeTemplates;
