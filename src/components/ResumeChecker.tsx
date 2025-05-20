
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, ChevronRight, Loader2, FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { analyzeResume } from '@/services/resumeAI';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ResumeCheckerProps {
  resumeData: any;
}

interface AnalysisResult {
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
  suggestions: string[];
}

export const ResumeChecker = ({ resumeData }: ResumeCheckerProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const isMobile = useIsMobile();

  const formatResumeData = () => {
    const { personalInfo = {}, education = [], workExperience = [], skills = [] } = resumeData;
    
    let resumeText = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}
${personalInfo.email || ''}
${personalInfo.phone || ''}
${personalInfo.location || ''}
${personalInfo.portfolio ? `Portfolio: ${personalInfo.portfolio}` : ''}

EDUCATION
`;

    education.forEach((edu: any) => {
      resumeText += `${edu.degree || ''} in ${edu.fieldOfStudy || ''} - ${edu.school || ''}
${edu.graduationDate ? `Graduation: ${edu.graduationDate}` : ''}
${edu.gpa ? `GPA: ${edu.gpa}` : ''}
${edu.description ? `${edu.description}` : ''}

`;
    });

    resumeText += `WORK EXPERIENCE
`;

    workExperience?.forEach((exp: any) => {
      resumeText += `${exp.position || ''} - ${exp.company || ''}
${exp.location ? `Location: ${exp.location}` : ''}
${exp.startDate ? `From: ${exp.startDate}` : ''} ${exp.endDate ? `To: ${exp.endDate}` : 'Present'}
${exp.description ? `${exp.description}` : ''}

`;
    });

    resumeText += `SKILLS
${skills?.map((skill: any) => skill.name).join(', ') || ''}
`;

    return resumeText;
  };

  const checkResume = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description to compare your resume against');
      return;
    }

    setIsChecking(true);
    try {
      const resumeText = formatResumeData();
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20';
      default:
        return '';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className={cn("h-5 w-5", getIconColor(type))} />;
      case 'warning':
      case 'error':
        return <AlertCircle className={cn("h-5 w-5", getIconColor(type))} />;
      default:
        return null;
    }
  };

  const renderKeywordsList = (keywords: string[], title: string, type: 'success' | 'error') => {
    if (!keywords.length) return null;
    
    return (
      <div className={cn(
        "p-3 rounded-lg border mb-3",
        type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-red-50 border-red-200 dark:bg-red-900/20'
      )}>
        <div className="flex gap-3">
          <div className="shrink-0 mt-0.5">
            {type === 'success' 
              ? <CheckCircle2 className="h-5 w-5 text-green-600" />
              : <AlertCircle className="h-5 w-5 text-red-600" />
            }
          </div>
          <div>
            <h4 className="font-medium mb-1">{title}</h4>
            <div className="flex flex-wrap gap-1">
              {keywords.map((keyword, i) => (
                <span 
                  key={i} 
                  className={cn(
                    "px-2 py-0.5 rounded text-xs",
                    type === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  )}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSuggestions = (suggestions: string[]) => {
    if (!suggestions.length) return null;
    
    return (
      <div className="p-3 rounded-lg border bg-blue-50 border-blue-200 dark:bg-blue-900/20">
        <h4 className="font-medium mb-2">Improvement Suggestions</h4>
        <ul className="list-disc pl-5 space-y-1">
          {suggestions.map((suggestion, i) => (
            <li key={i} className="text-sm text-muted-foreground">{suggestion}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in-50">
      {!isChecking && !analysisResult ? (
        <div className="space-y-6">
          <div className="text-center py-4">
            <h3 className="text-xl font-semibold mb-4">
              Ready to check your resume?
            </h3>
            <p className="text-muted-foreground mb-6">
              Add a job description below to compare your resume against. Our AI-powered tool will analyze your resume and provide personalized feedback.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea 
                id="jobDescription" 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to compare your resume against..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          
          <TouchRipple className="rounded-md inline-block">
            <Button 
              onClick={checkResume}
              disabled={!jobDescription.trim()}
              className={cn(
                "bg-resume-primary text-white hover:bg-resume-secondary transition-colors rounded-md font-medium w-full",
                "inline-flex items-center justify-center gap-2",
                isMobile ? "h-12 text-base px-6" : "h-10 text-sm px-4"
              )}
            >
              Start Resume Analysis
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TouchRipple>
        </div>
      ) : (
        <Card className={cn(
          "p-6",
          isMobile && "mx-0"
        )}>
          {isChecking ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-resume-primary" />
              <h3 className="text-lg font-medium mb-2">Analyzing your resume...</h3>
              <p className="text-sm text-muted-foreground">
                This will just take a moment
              </p>
            </div>
          ) : analysisResult && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Resume Analysis Complete</h3>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Progress 
                    value={analysisResult.score || 0}
                    className="absolute inset-0 w-24 h-24"
                    indicatorClassName={cn(
                      "transition-all duration-500",
                      analysisResult.score && analysisResult.score >= 80 ? "text-green-500" :
                      analysisResult.score && analysisResult.score >= 60 ? "text-yellow-500" :
                      "text-red-500"
                    )}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{analysisResult.score}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Match score based on comparison with the job description
                </p>
              </div>

              <Tabs defaultValue="analysis">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="mt-4">
                  <ScrollArea className={cn(
                    "border rounded-lg",
                    isMobile ? "h-[calc(100vh-360px)]" : "h-[400px]"
                  )}>
                    <div className="p-4 space-y-3">
                      {analysisResult.suggestions.length > 0 && renderSuggestions(analysisResult.suggestions)}
                      
                      <div className="p-3 rounded-lg border">
                        <div className="flex gap-3">
                          <div className="shrink-0 mt-0.5">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Resume Score Interpretation</h4>
                            <p className="text-sm text-muted-foreground">
                              {analysisResult.score >= 80 
                                ? "Excellent match! Your resume is well-aligned with this job description."
                                : analysisResult.score >= 60
                                  ? "Good match. With a few improvements, your resume could be even better aligned with this position."
                                  : "Your resume needs significant improvements to match this job description better."
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="keywords" className="mt-4">
                  <ScrollArea className={cn(
                    "border rounded-lg",
                    isMobile ? "h-[calc(100vh-360px)]" : "h-[400px]"
                  )}>
                    <div className="p-4 space-y-3">
                      {renderKeywordsList(
                        analysisResult.matchedKeywords, 
                        "Matched Keywords", 
                        "success"
                      )}
                      
                      {renderKeywordsList(
                        analysisResult.missedKeywords, 
                        "Missing Keywords", 
                        "error"
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <div className={cn(
                isMobile && "sticky bottom-0 pt-4 pb-2 bg-background/80 backdrop-blur-sm border-t"
              )}>
                <TouchRipple className="rounded-md w-full">
                  <Button
                    onClick={checkResume}
                    className={cn(
                      "w-full bg-resume-primary hover:bg-resume-secondary text-white transition-colors rounded-md font-medium inline-flex items-center justify-center gap-2",
                      isMobile ? "h-12 text-base" : "h-10 text-sm"
                    )}
                  >
                    Run Analysis Again
                    <Loader2 className="h-4 w-4" />
                  </Button>
                </TouchRipple>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
