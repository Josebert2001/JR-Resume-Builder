import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, Copy, CheckCheck } from 'lucide-react';
import { generateNyscBullets } from '@/services/resumeAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const NIGERIA_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River',
  'Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa','Kaduna',
  'Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo',
  'Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

const SECTORS = [
  'Education','Healthcare','Agriculture','Finance & Banking','Technology & ICT',
  'Government / Public Sector','NGO / Non-profit','Construction & Engineering',
  'Media & Communications','Law & Legal Services','Other',
];

interface NyscHelperProps {
  open: boolean;
  onClose: () => void;
  fieldOfStudy: string;
  careerGoal: string;
  onApply: (entry: { position: string; description: string }) => void;
}

export const NyscHelper = ({ open, onClose, fieldOfStudy, careerGoal, onApply }: NyscHelperProps) => {
  const [state, setState] = useState('');
  const [ppa, setPpa] = useState('');
  const [sector, setSector] = useState('');
  const [rawDesc, setRawDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ job_title: string; company_line: string; bullets: string[]; tip: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!ppa.trim()) {
      toast.error('Please enter your PPA name');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await generateNyscBullets({
        state: state || 'Nigeria',
        ppa: ppa.trim(),
        ppaSector: sector || 'General',
        rawDescription: rawDesc.trim(),
        fieldOfStudy,
        careerGoal,
        duration: 'July 2024 – June 2025',
      });
      if (res.bullets.length === 0) {
        toast.error('Could not generate bullets. Please add more details and try again.');
      } else {
        setResult(res);
        toast.success('NYSC bullets generated!');
      }
    } catch {
      toast.error('Failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    const description = result.bullets.map(b => `• ${b}`).join('\n');
    onApply({ position: result.job_title, description });
    toast.success('NYSC entry added to your resume!');
    onClose();
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `${result.job_title}\n${result.company_line}\n\n${result.bullets.map(b => `• ${b}`).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const reset = () => {
    setResult(null);
    setState('');
    setPpa('');
    setSector('');
    setRawDesc('');
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#2d6a4f]" />
            NYSC Experience Helper
          </DialogTitle>
          <DialogDescription>
            Turn your NYSC posting into a powerful work experience entry. Nigerian employers understand NYSC — let's make it shine.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="nysc-state" className="text-sm">State of Deployment</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="nysc-state" className="mt-1.5" data-testid="select-nysc-state">
                  <SelectValue placeholder="Select state…" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIA_STATES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nysc-ppa">PPA Name <span className="text-red-500">*</span></Label>
              <Input
                id="nysc-ppa"
                value={ppa}
                onChange={e => setPpa(e.target.value)}
                placeholder="e.g. Government Secondary School, Makurdi"
                className="mt-1.5"
                data-testid="input-nysc-ppa"
              />
            </div>

            <div>
              <Label htmlFor="nysc-sector" className="text-sm">PPA Sector</Label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger id="nysc-sector" className="mt-1.5" data-testid="select-nysc-sector">
                  <SelectValue placeholder="Select sector…" />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nysc-desc" className="text-sm">What did you do there?
                <span className="text-muted-foreground font-normal text-xs ml-1">(optional but helpful)</span>
              </Label>
              <Textarea
                id="nysc-desc"
                value={rawDesc}
                onChange={e => setRawDesc(e.target.value)}
                placeholder="e.g. I taught mathematics to SS2 students, organised inter-house sports, and helped with the school's timetable…"
                className="mt-1.5 min-h-[80px] text-sm"
                data-testid="textarea-nysc-desc"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !ppa.trim()}
              className="bg-[#2d6a4f] hover:bg-[#255c43] text-white w-full"
              data-testid="button-generate-nysc"
            >
              {isGenerating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating bullets…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Generate NYSC Bullets</>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="rounded-xl border bg-[#f7f3ed] p-4 space-y-2">
              <p className="font-semibold text-sm">{result.job_title}</p>
              <p className="text-xs text-muted-foreground">{result.company_line}</p>
              <ul className="space-y-1 mt-2">
                {result.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[#2d6a4f] mt-0.5 shrink-0">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.tip && (
              <div className="flex items-start gap-2 bg-[#e8f5ee] border border-[#b6d9c4] rounded-xl p-3">
                <Sparkles className="text-[#2d6a4f] shrink-0 mt-0.5" size={13} />
                <p className="text-xs text-[#3d5544] leading-relaxed">{result.tip}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCopy}
                data-testid="button-copy-nysc"
              >
                {copied ? (
                  <><CheckCheck className="mr-2 h-4 w-4 text-green-600" />Copied!</>
                ) : (
                  <><Copy className="mr-2 h-4 w-4" />Copy</>
                )}
              </Button>
              <Button
                size="sm"
                className={cn("flex-1 bg-[#2d6a4f] hover:bg-[#255c43] text-white")}
                onClick={handleApply}
                data-testid="button-apply-nysc"
              >
                Add to My Resume
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={reset}>
              Try different details
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
