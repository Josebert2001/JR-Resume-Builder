
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { FormWrapper } from './FormWrapper';
import { Card } from "@/components/ui/card";
import type { Certification } from '@/context/ResumeContext';

interface EntryErrors {
  name?: string;
  issuer?: string;
}

export const CertificationsForm = () => {
  const { certifications, updateCertifications } = useResumeContext();
  const isMobile = useIsMobile();
  const [entryErrors, setEntryErrors] = useState<Record<string, EntryErrors>>({});

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
      </div>
    </FormWrapper>
  );
};
