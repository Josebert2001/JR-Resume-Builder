import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Loader2, Sparkles, Copy, CheckCircle2, MessageCircle, Linkedin, Mail, Globe, Tag } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { generateShareableCopy, type ShareableCopyResult } from '@/services/resumeAI';
import { toast } from 'sonner';

interface CopyFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  testId?: string;
}

const CopyField = ({ label, icon, value, testId }: CopyFieldProps) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  if (!value) return null;
  return (
    <div className="rounded-lg border bg-white p-3 space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {icon}{label}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
          data-testid={testId}
        >
          {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
};

export const ShareableResumePanel = () => {
  const { resumeData } = useResumeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ShareableCopyResult | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const pi = resumeData.personalInfo;
      const fullName = [pi?.firstName, pi?.lastName].filter(Boolean).join(' ');
      const topSkills = (resumeData.skills || []).slice(0, 5).map((s: any) => s.name).join(', ');
      const fieldOfStudy = resumeData.education?.[0]?.fieldOfStudy || '';
      const certNames = (resumeData.certifications || []).map((c: any) => c.name).join(', ');
      const bestAchievement = certNames || (resumeData.projects?.[0]?.name ? `Built ${resumeData.projects[0].name}` : '');

      const res = await generateShareableCopy({
        fullName: fullName || 'Student',
        careerGoal: pi?.summary || pi?.jobTitle || '',
        topSkills,
        fieldOfStudy,
        availabilityStatus: 'open to work',
        bestAchievement,
      });

      if (!res.page_headline && !res.whatsapp_message) {
        toast.error('Could not generate share copy. Please try again.');
      } else {
        setResult(res);
        toast.success('Share copy ready!');
      }
    } catch {
      toast.error('Failed to generate share copy. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!result) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <div className="w-14 h-14 rounded-full bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
            <Share2 className="h-6 w-6 text-[#2d6a4f]" />
          </div>
          <h3 className="text-base font-semibold mb-1.5">Share Your Resume</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-5">
            Generate personalised copy for WhatsApp, LinkedIn, email, and more — all tailored to your name, career goal, and top skills.
          </p>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-[#2d6a4f] hover:bg-[#255c43] text-white px-6"
            data-testid="button-generate-share-copy"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating…</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" />Generate Share Copy</>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in-50">
      {/* Page Headline + Badge */}
      {(result.page_headline || result.availability_badge) && (
        <Card className="border-[#2d6a4f]/30">
          <CardContent className="pt-4 pb-4 px-4 space-y-2">
            {result.page_headline && (
              <div className="flex items-start justify-between gap-2">
                <p className="text-lg font-semibold leading-snug">{result.page_headline}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(result.page_headline);
                    toast.success('Headline copied!');
                  }}
                  data-testid="button-copy-headline"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            {result.availability_badge && (
              <Badge variant="outline" className="text-xs border-[#2d6a4f]/40 text-[#2d6a4f] bg-[#e8f5ee]">
                <Tag className="h-3 w-3 mr-1" />
                {result.availability_badge}
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* All copy fields */}
      <div className="space-y-3">
        <CopyField
          label="WhatsApp Message"
          icon={<MessageCircle className="h-3.5 w-3.5" />}
          value={result.whatsapp_message}
          testId="button-copy-whatsapp"
        />
        <CopyField
          label="LinkedIn Caption"
          icon={<Linkedin className="h-3.5 w-3.5" />}
          value={result.linkedin_caption}
          testId="button-copy-linkedin"
        />
        <CopyField
          label="Email Signature"
          icon={<Mail className="h-3.5 w-3.5" />}
          value={result.email_signature}
          testId="button-copy-email-sig"
        />
        <CopyField
          label="Link Preview (OG Description)"
          icon={<Globe className="h-3.5 w-3.5" />}
          value={result.og_description}
          testId="button-copy-og"
        />
      </div>

      <div className="text-center">
        <Button variant="outline" size="sm" className="text-xs" onClick={() => setResult(null)}>
          Regenerate
        </Button>
      </div>
    </div>
  );
};
