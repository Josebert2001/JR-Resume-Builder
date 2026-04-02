import React from 'react';
import { useResumeContext, TemplateType } from '@/context/ResumeContext';
import { Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplatePreview } from './TemplatePreview';

const templates = [
  {
    id: 'professional' as TemplateType,
    name: 'Professional',
    description: 'Traditional layout, great for corporate roles',
    atsCompatible: true,
    accentColor: '#1e3a5f',
  },
  {
    id: 'modern' as TemplateType,
    name: 'Modern',
    description: 'Contemporary split-column design',
    atsCompatible: true,
    accentColor: '#2d4a6e',
  },
  {
    id: 'minimal' as TemplateType,
    name: 'Minimal',
    description: 'Clean lines, maximum content clarity',
    atsCompatible: true,
    accentColor: '#374151',
  },
  {
    id: 'creative' as TemplateType,
    name: 'Creative',
    description: 'Bold sidebar layout for creative fields',
    atsCompatible: false,
    accentColor: '#1a1209',
  },
];

const SCALE = 0.35;

export const ResumeTemplates = () => {
  const { template, setTemplate, nextStep } = useResumeContext();

  return (
    <div className="bg-white dark:bg-[#1a1510] rounded-3xl p-6 sm:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1.5">Choose your template</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Pick the layout that fits your style — all are ATS-tested and fully customizable
          </p>
        </div>
        {template && (
          <div className="hidden sm:flex items-center gap-1.5 text-[#2d6a4f] text-xs font-semibold bg-[#f0f7f4] px-3 py-1.5 rounded-full border border-[#c3ddd2]">
            <Check className="h-3.5 w-3.5" />
            {templates.find((t) => t.id === template)?.name} selected
          </div>
        )}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {templates.map((t) => {
          const isSelected = template === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={cn(
                'group relative rounded-2xl overflow-hidden text-left transition-all duration-200 bg-white',
                isSelected
                  ? 'ring-2 ring-[#2d6a4f] shadow-md shadow-[#2d6a4f]/15'
                  : 'ring-1 ring-stone-200 dark:ring-stone-700 hover:ring-stone-300 dark:hover:ring-stone-600 hover:shadow-md'
              )}
            >
              {/* Scaled preview thumbnail */}
              <div className="relative overflow-hidden bg-stone-50" style={{ height: 190 }}>
                <div
                  style={{
                    transform: `scale(${SCALE})`,
                    transformOrigin: 'top left',
                    width: `${100 / SCALE}%`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  <TemplatePreview template={t.id} />
                </div>

                {/* ATS badge */}
                <div
                  className={cn(
                    'absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1',
                    t.atsCompatible
                      ? 'bg-[#e8f5ef] text-[#2d6a4f]'
                      : 'bg-amber-50 text-amber-700'
                  )}
                >
                  {t.atsCompatible ? (
                    <>
                      <ShieldCheck className="h-2.5 w-2.5" />
                      ATS
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-2.5 w-2.5" />
                      Design
                    </>
                  )}
                </div>

                {/* Selected overlay + checkmark */}
                {isSelected && (
                  <>
                    <div className="absolute inset-0 bg-[#2d6a4f]/8" />
                    <div className="absolute bottom-2 right-2 bg-[#2d6a4f] text-white rounded-full p-1 shadow">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </div>
                  </>
                )}
              </div>

              {/* Card label */}
              <div
                className={cn(
                  'px-3 py-2.5 border-t',
                  isSelected
                    ? 'border-[#2d6a4f]/20 bg-[#f5fbf8]'
                    : 'border-stone-100 dark:border-stone-800 dark:bg-[#1a1510]'
                )}
              >
                <p
                  className={cn(
                    'font-semibold text-sm',
                    isSelected ? 'text-[#2d6a4f]' : 'text-stone-900 dark:text-stone-100'
                  )}
                >
                  {t.name}
                </p>
                <p className="text-[11px] text-stone-400 leading-tight mt-0.5 truncate">
                  {t.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue button */}
      <button
        onClick={() => template && nextStep()}
        disabled={!template}
        className={cn(
          'w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200',
          template
            ? 'bg-[#1a1209] hover:bg-[#2a1f10] dark:bg-[#f7f3ed] dark:text-[#1a1209] text-white cursor-pointer'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
        )}
      >
        {template
          ? `Continue with ${templates.find((t) => t.id === template)?.name}`
          : 'Select a template to continue'}
        {template && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
};
