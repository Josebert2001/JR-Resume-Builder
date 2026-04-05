import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Sparkles, Loader2, CheckCircle2, Copy } from 'lucide-react';
import { formatNigerianEducation, type NigerianNyscResult } from '@/services/resumeAI';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const NYSC_STATUSES = ['Awaiting', 'Serving', 'Completed', 'Exempted'] as const;

interface Props {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  cgpa?: string;
  degreeClass?: string;
  careerGoal?: string;
}

export const NigerianNyscPanel = ({
  institution,
  degree,
  fieldOfStudy,
  graduationYear,
  cgpa = '',
  degreeClass = '',
  careerGoal = '',
}: Props) => {
  const [open, setOpen] = useState(false);
  const [nyscStatus, setNyscStatus] = useState('');
  const [nyscState, setNyscState] = useState('');
  const [ppa, setPpa] = useState('');
  const [ppaRole, setPpaRole] = useState('');
  const [cdsGroup, setCdsGroup] = useState('');
  const [cgpaLocal, setCgpaLocal] = useState(cgpa);
  const [cgpaScale, setCgpaScale] = useState('5.0');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NigerianNyscResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleFormat = async () => {
    setIsLoading(true);
    try {
      const res = await formatNigerianEducation({
        institution, degree, fieldOfStudy, graduationYear,
        cgpa: cgpaLocal, cgpaScale,
        degreeClass, honors: '',
        nyscStatus, nyscState, ppa, ppaRole, cdsGroup, careerGoal,
      });
      if (!res.local_version.degree_line && !res.international_version.degree_line) {
        toast.error('Could not format education. Please try again.');
      } else {
        setResult(res);
        toast.success('Education formatted for both markets!');
      }
    } catch {
      toast.error('Failed to format education. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const allResultLines = (version: any) =>
    [version.degree_line, version.cgpa_line || version.gpa_line, version.nysc_line || version.service_line, ...(version.bullets || [])].filter(Boolean).join('\n');

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs justify-between border-dashed border-[#2d6a4f]/50 text-[#2d6a4f] hover:bg-[#e8f5ee]"
          data-testid="button-nigerian-student-toggle"
        >
          <span>🇳🇬 Nigerian Student? Format for local & international employers</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 p-4 rounded-lg bg-[#f7f3ed] border border-[#e8ddd0] space-y-4">
          {/* NYSC fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">CGPA</Label>
              <Input
                placeholder="e.g. 4.2"
                value={cgpaLocal}
                onChange={e => setCgpaLocal(e.target.value)}
                className="h-8 text-sm"
                data-testid="input-nysc-cgpa"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Scale</Label>
              <Select value={cgpaScale} onValueChange={setCgpaScale}>
                <SelectTrigger className="h-8 text-sm" data-testid="select-cgpa-scale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5.0">5.0</SelectItem>
                  <SelectItem value="4.0">4.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">NYSC Status</Label>
            <Select value={nyscStatus} onValueChange={setNyscStatus}>
              <SelectTrigger className="h-8 text-sm" data-testid="select-nysc-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {NYSC_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {(nyscStatus === 'Serving' || nyscStatus === 'Completed') && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">State of Posting</Label>
                  <Input
                    placeholder="e.g. Lagos"
                    value={nyscState}
                    onChange={e => setNyscState(e.target.value)}
                    className="h-8 text-sm"
                    data-testid="input-nysc-state"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">PPA Name</Label>
                  <Input
                    placeholder="e.g. Access Bank"
                    value={ppa}
                    onChange={e => setPpa(e.target.value)}
                    className="h-8 text-sm"
                    data-testid="input-ppa"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Role at PPA</Label>
                  <Input
                    placeholder="e.g. IT Support Officer"
                    value={ppaRole}
                    onChange={e => setPpaRole(e.target.value)}
                    className="h-8 text-sm"
                    data-testid="input-ppa-role"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">CDS Group</Label>
                  <Input
                    placeholder="e.g. Tech CDS"
                    value={cdsGroup}
                    onChange={e => setCdsGroup(e.target.value)}
                    className="h-8 text-sm"
                    data-testid="input-cds-group"
                  />
                </div>
              </div>
            </>
          )}
          <Button
            onClick={handleFormat}
            disabled={isLoading}
            size="sm"
            className="w-full bg-[#2d6a4f] hover:bg-[#255c43] text-white text-xs"
            data-testid="button-format-with-ai"
          >
            {isLoading ? (
              <><Loader2 className="mr-1.5 h-3 w-3 animate-spin" />Formatting…</>
            ) : (
              <><Sparkles className="mr-1.5 h-3 w-3" />Format with AI</>
            )}
          </Button>

          {/* Dual-column result */}
          {result && (
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              {/* Local Version */}
              <div className="rounded-lg border border-green-200 bg-white p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="text-xs bg-green-600 text-white">🇳🇬 Nigerian Employers</Badge>
                  <Button
                    variant="ghost" size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={() => copyText(allResultLines(result.local_version), 'Local version')}
                    data-testid="button-copy-local"
                  >
                    {copied === 'Local version' ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="space-y-0.5 text-xs">
                  {result.local_version.degree_line && <p className="font-medium">{result.local_version.degree_line}</p>}
                  {result.local_version.cgpa_line && <p className="text-muted-foreground">{result.local_version.cgpa_line}</p>}
                  {result.local_version.nysc_line && <p className="text-[#2d6a4f] font-medium mt-1">{result.local_version.nysc_line}</p>}
                  {result.local_version.bullets?.map((b, i) => (
                    <p key={i} className="text-muted-foreground pl-2">• {b}</p>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-7 border-green-300 text-green-700"
                  onClick={() => toast.info('Applied! Update your education entries with this format.')}
                  data-testid="button-apply-local"
                >
                  Apply Local Version
                </Button>
              </div>

              {/* International Version */}
              <div className="rounded-lg border border-blue-200 bg-white p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="text-xs bg-blue-600 text-white">🌍 International Employers</Badge>
                  <Button
                    variant="ghost" size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={() => copyText(allResultLines(result.international_version), 'International version')}
                    data-testid="button-copy-international"
                  >
                    {copied === 'International version' ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="space-y-0.5 text-xs">
                  {result.international_version.degree_line && <p className="font-medium">{result.international_version.degree_line}</p>}
                  {result.international_version.gpa_line && <p className="text-muted-foreground">{result.international_version.gpa_line}</p>}
                  {result.international_version.service_line && <p className="text-[#2d6a4f] font-medium mt-1">{result.international_version.service_line}</p>}
                  {result.international_version.bullets?.map((b, i) => (
                    <p key={i} className="text-muted-foreground pl-2">• {b}</p>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-7 border-blue-300 text-blue-700"
                  onClick={() => toast.info('Applied! Update your education entries with this format.')}
                  data-testid="button-apply-international"
                >
                  Apply International Version
                </Button>
              </div>
            </div>
          )}

          {result?.tip && (
            <p className="text-xs text-muted-foreground italic border-t pt-2 mt-1">{result.tip}</p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
