import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';

interface ResumeCheckerProps {
  resumeData: any;
}

export const ResumeChecker = ({ resumeData }: ResumeCheckerProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<any[]>([]);
  const isMobile = useIsMobile();

  const checkResume = () => {
    setIsChecking(true);
    // Simulated API call for resume checking
    setTimeout(() => {
      const mockScore = 85;
      const mockFeedback = [
        {
          type: 'success',
          section: 'Skills',
          message: 'Good range of technical skills that match industry requirements.'
        },
        {
          type: 'warning',
          section: 'Work Experience',
          message: 'Consider adding more quantifiable achievements to your work experience.'
        },
        {
          type: 'error',
          section: 'Education',
          message: 'Missing relevant coursework section which could highlight additional qualifications.'
        }
      ];
      setScore(mockScore);
      setFeedback(mockFeedback);
      setIsChecking(false);
    }, 2000);
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

  return (
    <div className="animate-in fade-in-50">
      {!isChecking && score === null ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-4">
            Ready to check your resume?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our AI-powered tool will analyze your resume and provide personalized feedback
          </p>
          <TouchRipple className="rounded-md inline-block">
            <button 
              onClick={checkResume}
              className={cn(
                "bg-resume-primary text-white hover:bg-resume-secondary transition-colors rounded-md font-medium",
                "inline-flex items-center justify-center gap-2",
                isMobile ? "w-full h-12 text-base px-6" : "h-10 text-sm px-4"
              )}
            >
              Start Resume Analysis
              <ChevronRight className="h-4 w-4" />
            </button>
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
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Resume Analysis Complete</h3>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Progress 
                    value={score || 0}
                    className="absolute inset-0 w-24 h-24"
                    indicatorClassName={cn(
                      "transition-all duration-500",
                      score && score >= 80 ? "text-green-500" :
                      score && score >= 60 ? "text-yellow-500" :
                      "text-red-500"
                    )}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{score}%</span>
                  </div>
                </div>
              </div>

              <ScrollArea className={cn(
                "border rounded-lg",
                isMobile ? "h-[calc(100vh-360px)]" : "h-[400px]"
              )}>
                <div className="p-4 space-y-3">
                  {feedback.map((item, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border",
                        getStatusColor(item.type)
                      )}
                    >
                      <div className="flex gap-3">
                        <div className="shrink-0 mt-0.5">
                          {getIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{item.section}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className={cn(
                isMobile && "sticky bottom-0 pt-4 pb-2 bg-background/80 backdrop-blur-sm border-t"
              )}>
                <TouchRipple className="rounded-md w-full">
                  <button
                    onClick={checkResume}
                    className={cn(
                      "w-full bg-resume-primary hover:bg-resume-secondary text-white transition-colors rounded-md font-medium inline-flex items-center justify-center gap-2",
                      isMobile ? "h-12 text-base" : "h-10 text-sm"
                    )}
                  >
                    Run Analysis Again
                    <Loader2 className="h-4 w-4" />
                  </button>
                </TouchRipple>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
