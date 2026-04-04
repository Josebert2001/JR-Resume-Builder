
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, AlertCircle, Sparkles, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { FormWrapper } from './FormWrapper';
import { Card } from "@/components/ui/card";
import type { Certification } from '@/context/ResumeContext';
import { analyzeCertifications, CertAnalysis, AICertEntry } from '@/services/resumeAI';
import { toast } from 'sonner';

interface EntryErrors {
  name?: string;
  issuer?: string;
}

const RELEVANCE_STYLE: Record<string, string> = {
  high:   'bg-[#e8f5ee] text-[#2d6a4f] border-[#b6d9c4]',
  medium: 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]',
  low:    'bg-[#f5f5f4] text-[#6b7280] border-[#d1d5db]',
};

const PRIORITY_STYLE: Record<string, string> = {
  high:   'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
  medium: 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]',
};

export const CertificationsForm = () => {
  const { certifications, updateCertifications, resumeData } = useResumeContext();
  const isMobile = useIsMobile();
  const [entryErrors, setEntryErrors] = useState<Record<string, EntryErrors>>({});
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState<CertAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [expandedCerts, setExpandedCerts] = useState<Set<number>>(new Set());

  const handleAdd = () => {
    updateCertifications([
      ...certifications,
      {
        id: Date.now().toString(),
        name: '',
        issuer: '',
        date: '',
        description: '',
      },
    ]);
  };

  const handleRemove = (id: string) => {
    updateCertifications(certifications.filter((c) => c.id !== id));
    setEntryErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleChange = (id: string, field: keyof Certification, value: string) => {
    updateCertifications(
      certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
    if (entryErrors[id]?.[field as keyof EntryErrors]) {
      setEntryErrors((prev) => ({ ...prev, [id]: { ...prev[id], [field]: undefined } }));
    }
  };

  const validateForm = (): boolean => {
    const entries = certifications || [];
    if (entries.length === 0) return true;

    const newErrors: Record<string, EntryErrors> = {};
    let hasError = false;

    entries.forEach((cert) => {
      const errors: EntryErrors = {};
      if (!cert.name.trim()) { errors.name = 'Certification name is required'; hasError = true; }
      if (!cert.issuer.trim()) { errors.issuer = 'Issuing organisation is required'; hasError = true; }
      if (Object.keys(errors).length) newErrors[cert.id] = errors;
    });

    if (hasError) {
      setEntryErrors(newErrors);
      return false;
    }

    return true;
  };

  const hasCertsToAnalyse = certifications.some(c => c.name.trim().length > 0);

  const handleAnalyse = async () => {
    if (!hasCertsToAnalyse) {
      toast.error('Add at least one certification name first');
      return;
    }
    setIsAnalysing(true);
    try {
      const fieldOfStudy = resumeData.education?.[0]?.fieldOfStudy || '';
      const careerGoal =
        resumeData.workExperience?.[0]?.position ||
        resumeData.personalInfo?.summary?.slice(0, 60) ||
        '';
      const existingSkills = (resumeData.skills || []).map(s => s.name).join(', ');
      const certificationsList = certifications
        .filter(c => c.name.trim())
        .map(c => `${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.date ? ` | ${c.date}` : ''}`)
        .join('\n');

      const result = await analyzeCertifications(
        certificationsList, fieldOfStudy, careerGoal, existingSkills
      );

      if (result.certifications.length === 0 && result.missing_certifications.length === 0) {
        toast.error('AI could not analyse the certifications. Please try again.');
        return;
      }

      setAnalysis(result);
      setShowAnalysis(true);
      setExpandedCerts(new Set(result.certifications.map((_, i) => i)));
      toast.success('Certification analysis ready!');
    } catch (err) {
      console.error('Error analysing certifications:', err);
      toast.error('Could not analyse certifications. Please try again.');
    } finally {
      setIsAnalysing(false);
    }
  };

  const applyFormatting = (aiCert: AICertEntry) => {
    const certName = aiCert.formatted_name.split(' — ')[0]?.trim() || '';
    const rest = aiCert.formatted_name.split(' — ')[1] || '';
    const [issuerPart, yearPart] = rest.split(' | ');

    // Find best matching original cert by name similarity
    const target =
      certifications.find(c =>
        c.name.trim().length > 0 &&
        aiCert.formatted_name.toLowerCase().includes(
          c.name.toLowerCase().trim().split(' ').slice(0, 3).join(' ')
        )
      ) ||
      certifications.find(c =>
        c.name.trim().length > 0 &&
        c.name.toLowerCase().split(' ').slice(0, 2).every(w =>
          aiCert.formatted_name.toLowerCase().includes(w)
        )
      );

    if (!target) {
      toast.error("Could not match this to a certification. Please update manually.");
      return;
    }

    updateCertifications(
      certifications.map(c =>
        c.id === target.id
          ? {
              ...c,
              name: certName || c.name,
              issuer: issuerPart?.trim() || c.issuer,
              date: yearPart?.trim() || c.date,
              description: aiCert.value_statement,
            }
          : c
      )
    );
    toast.success('Formatting applied!');
  };

  const toggleExpanded = (i: number) => {
    setExpandedCerts(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <FormWrapper
      title="Certifications"
      description="Add professional certifications, licences, or credentials — or skip if not applicable"
      onNext={validateForm}
      showSkip={true}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {(certifications || []).map((cert, index) => {
            const errors = entryErrors[cert.id] || {};
            return (
              <Card key={cert.id} className="p-4 relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Certification {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(cert.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                    data-testid={`button-remove-cert-${cert.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={`cert-name-${cert.id}`}>
                        Certification Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`cert-name-${cert.id}`}
                        data-testid={`input-cert-name-${cert.id}`}
                        value={cert.name}
                        onChange={(e) => handleChange(cert.id, 'name', e.target.value)}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        className={cn(
                          'mt-1.5',
                          errors.name && 'border-red-400 focus-visible:ring-red-400'
                        )}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`cert-issuer-${cert.id}`}>
                        Issuing Organisation <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`cert-issuer-${cert.id}`}
                        data-testid={`input-cert-issuer-${cert.id}`}
                        value={cert.issuer}
                        onChange={(e) => handleChange(cert.id, 'issuer', e.target.value)}
                        placeholder="e.g. Amazon Web Services"
                        className={cn(
                          'mt-1.5',
                          errors.issuer && 'border-red-400 focus-visible:ring-red-400'
                        )}
                      />
                      {errors.issuer && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.issuer}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`cert-date-${cert.id}`}>
                      Date Issued
                      <span className="text-stone-400 font-normal text-xs ml-1">(optional)</span>
                    </Label>
                    <Input
                      id={`cert-date-${cert.id}`}
                      data-testid={`input-cert-date-${cert.id}`}
                      value={cert.date}
                      onChange={(e) => handleChange(cert.id, 'date', e.target.value)}
                      placeholder="e.g. Jun 2023"
                      className={cn('mt-1.5', isMobile && 'h-11')}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`cert-desc-${cert.id}`}>
                      Description
                      <span className="text-stone-400 font-normal text-xs ml-1">(optional)</span>
                    </Label>
                    <Textarea
                      id={`cert-desc-${cert.id}`}
                      data-testid={`textarea-cert-desc-${cert.id}`}
                      value={cert.description || ''}
                      onChange={(e) => handleChange(cert.id, 'description', e.target.value)}
                      placeholder="Brief note about what this certification covers or demonstrates"
                      className="mt-1.5 min-h-[70px]"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          data-testid="button-add-certification"
          className={cn(
            'w-full border-dashed hover:border-resume-primary/50 transition-colors duration-200',
            isMobile ? 'h-12 text-base' : 'h-10'
          )}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Certification
        </Button>

        {/* ─── AI Analysis button ─── */}
        {certifications.length > 0 && (
          <button
            type="button"
            onClick={handleAnalyse}
            disabled={isAnalysing || !hasCertsToAnalyse}
            data-testid="button-analyse-certifications"
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all',
              'bg-[#2d6a4f] text-white active:scale-[0.98]',
              (isAnalysing || !hasCertsToAnalyse) && 'opacity-60 cursor-not-allowed'
            )}
          >
            {isAnalysing ? (
              <><Loader2 size={16} className="animate-spin" />Analysing…</>
            ) : (
              <><Sparkles size={16} />Analyse Certifications with AI</>
            )}
          </button>
        )}

        {/* ─── AI Analysis panel ─── */}
        {showAnalysis && analysis && (
          <div className="border border-[#d4cfc7] rounded-2xl overflow-hidden bg-[#faf8f5]">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5ddd0]">
              <div>
                <p className="text-sm font-semibold text-[#1a1209]">AI Certification Analysis</p>
                <p className="text-xs text-[#8a7560] mt-0.5">
                  Apply formatting to update your certification entries
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAnalysis(false)}
                data-testid="button-dismiss-cert-analysis"
                aria-label="Close analysis"
                className="text-[#8a7560] hover:text-[#5c4a2a] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Per-cert enhanced entries */}
            {analysis.certifications.length > 0 && (
              <div className="divide-y divide-[#e5ddd0]">
                {analysis.certifications.map((aiCert, i) => {
                  const isExpanded = expandedCerts.has(i);
                  return (
                    <div key={i} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              className={cn(
                                'text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border',
                                RELEVANCE_STYLE[aiCert.relevance] || RELEVANCE_STYLE.medium
                              )}
                            >
                              {aiCert.relevance} relevance
                            </span>
                            {!aiCert.include_on_resume && (
                              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border bg-[#f5f5f4] text-[#6b7280] border-[#d1d5db]">
                                Optional
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#1a1209] leading-snug">
                            {aiCert.formatted_name}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleExpanded(i)}
                          className="text-[#8a7560] shrink-0"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-2 space-y-2">
                          <p className="text-xs text-[#5c4a2a] leading-relaxed">
                            {aiCert.value_statement}
                          </p>
                          {aiCert.hidden_skills.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold text-[#8a7560] uppercase tracking-wide mb-1">
                                Hidden skills unlocked
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {aiCert.hidden_skills.map(skill => (
                                  <span
                                    key={skill}
                                    className="text-[10px] bg-[#f0ebe3] text-[#5c4a2a] rounded-full px-2 py-0.5"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => applyFormatting(aiCert)}
                            data-testid={`button-apply-cert-${i}`}
                            className="h-7 text-xs border-[#c3ddd2] text-[#2d6a4f] hover:bg-[#f0f7f4]"
                          >
                            Apply Formatting
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Missing certifications */}
            {analysis.missing_certifications.length > 0 && (
              <div className="border-t border-[#e5ddd0] px-4 py-3">
                <p className="text-xs font-semibold text-[#1a1209] mb-2">
                  Consider adding these certifications
                </p>
                <div className="space-y-2">
                  {analysis.missing_certifications.map((mc, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 bg-white border border-[#e5ddd0] rounded-xl p-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-[#1a1209]">{mc.name}</p>
                          <span
                            className={cn(
                              'text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border',
                              PRIORITY_STYLE[mc.priority] || PRIORITY_STYLE.medium
                            )}
                          >
                            {mc.priority} priority
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8a7560]">{mc.issuer}</p>
                        <p className="text-xs text-[#5c4a2a] mt-1 leading-snug">{mc.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall tip */}
            {analysis.tip && (
              <div className="border-t border-[#e5ddd0] px-4 py-3 flex items-start gap-2">
                <Sparkles size={13} className="text-[#2d6a4f] shrink-0 mt-0.5" />
                <p className="text-xs text-[#3d5544] leading-relaxed">{analysis.tip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </FormWrapper>
  );
};
