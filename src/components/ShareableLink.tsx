import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Copy, CheckCheck, AlertCircle, RefreshCcw } from 'lucide-react';
import { useResumeContext, type ResumeData } from '@/context/ResumeContext';
import { toast } from 'sonner';

function encodeResume(data: object): string {
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeResume(encoded: string): object | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch {
    return null;
  }
}

export const ShareableLink = () => {
  const { resumeData } = useResumeContext();
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [importValue, setImportValue] = useState('');
  const [showImport, setShowImport] = useState(false);

  const generateLink = () => {
    setError('');
    try {
      const encoded = encodeResume(resumeData);
      const url = `${window.location.origin}${window.location.pathname}?resume=${encoded}`;
      if (url.length > 8000) {
        setError('Your resume data is too large to share as a link. Try the Download options instead.');
        return;
      }
      setLink(url);
    } catch {
      setError('Could not generate link. Please try again.');
    }
  };

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="h-5 w-5 text-[#2d6a4f]" />
            Share Your Resume
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a shareable link that encodes your entire resume. Anyone with the link can view and import your resume data. No account needed.
          </p>

          {!link ? (
            <Button
              onClick={generateLink}
              className="bg-[#2d6a4f] hover:bg-[#255c43] text-white"
              data-testid="button-generate-link"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Generate Shareable Link
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={link}
                  readOnly
                  className="text-xs font-mono"
                  data-testid="input-shareable-link"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                  data-testid="button-copy-link"
                >
                  {copied ? (
                    <CheckCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => { setLink(''); setCopied(false); }}
                >
                  <RefreshCcw className="mr-1.5 h-3 w-3" />
                  Regenerate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This link contains your full resume data. Share it with yourself to continue on another device, or send it to a friend for feedback.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import from link */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-foreground">Load a Resume from a Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Have a resume link? Paste the full URL below to load that resume into the builder.
          </p>
          {!showImport ? (
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowImport(true)} data-testid="button-show-import">
              Load from link
            </Button>
          ) : (
            <ImportFromLink onDone={() => setShowImport(false)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ImportFromLink = ({ onDone }: { onDone: () => void }) => {
  const { updateResumeData } = useResumeContext();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleLoad = () => {
    setError('');
    try {
      const paramStr = url.includes('?resume=') ? url.split('?resume=')[1].split('&')[0] : url.trim();
      if (!paramStr) { setError('Invalid link'); return; }
      const data = decodeResume(paramStr);
      if (!data) { setError('Could not decode this link. Make sure you copied the full URL.'); return; }
      updateResumeData(data as Partial<ResumeData>);
      toast.success('Resume loaded successfully!');
      onDone();
    } catch {
      setError('Failed to load resume from this link.');
    }
  };

  return (
    <div className="space-y-2">
      <Input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Paste full URL here…"
        className="text-xs"
        data-testid="input-import-link"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" className="bg-[#2d6a4f] hover:bg-[#255c43] text-white text-xs" onClick={handleLoad} data-testid="button-load-link">
          Load Resume
        </Button>
        <Button size="sm" variant="ghost" className="text-xs" onClick={onDone}>Cancel</Button>
      </div>
    </div>
  );
};
