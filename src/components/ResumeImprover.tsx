import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, TrendingUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { analyzeResume } from '@/services/resumeAI';
import { toast } from 'sonner';
import type { ResumeData } from '@/context/ResumeContext';

interface ResumeImproverProps {
  resumeData: ResumeData;
}

interface ImprovementSuggestion {
  type: 'critical' | 'important' | 'suggestion';
  title: string;
  description: string;
  section: string;
}

export const ResumeImprover = ({ resumeData }: ResumeImproverProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    score: number;
    improvements: ImprovementSuggestion[];
    atsScore: number;
    keywords: string[];
  } | null>(null);
  const isMobile = useIsMobile();

  const formatResumeData = () => {
    const { personalInfo = {}, education = [], workExperience = [], skills = [] } = resumeData;
    
    return `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}
${personalInfo.email || ''}
${personalInfo.phone || ''}
${personalInfo.location || ''}

PROFESSIONAL SUMMARY
${personalInfo.summary || 'Professional seeking new opportunities'}

WORK EXPERIENCE
${workExperience?.map((exp: any) => `
${exp.position || ''} - ${exp.company || ''}
${exp.startDate ? `${exp.startDate} - ${exp.endDate || 'Present'}` : ''}
${exp.description || ''}
`).join('\n') || ''}

EDUCATION
${education.map((edu: any) => `
${edu.degree || ''} in ${edu.fieldOfStudy || ''} - ${edu.school || ''}
${edu.graduationDate ? `Graduated: ${edu.graduationDate}` : ''}
${edu.description || ''}
`).join('\n')}

SKILLS
${skills?.map((skill: any) => skill.name).join(', ') || ''}`;
  };

  const generateImprovements = (analysisResult: any): ImprovementSuggestion[] => {
    const improvements: ImprovementSuggestion[] = [];
    
    // Critical improvements
    if (analysisResult.score < 60) {
      improvements.push({
        type: 'critical',
        title: 'Resume Needs Major Improvements',
        description: 'Your resume score is below 60%. Consider restructuring content and adding more relevant keywords.',
        section: 'overall'
      });
    }

    if (!resumeData.personalInfo?.summary) {
      improvements.push({
        type: 'critical',
        title: 'Add Professional Summary',
        description: 'A compelling professional summary is essential for grabbing recruiter attention.',
        section: 'summary'
      });
    }

    // Important improvements
    if (analysisResult.missedKeywords?.length > 5) {
      improvements.push({
        type: 'important',
        title: 'Missing Key Industry Terms',
        description: `Add ${analysisResult.missedKeywords.length} important keywords to improve ATS compatibility.`,
        section: 'keywords'
      });
    }

    if (!resumeData.workExperience?.length) {
      improvements.push({
        type: 'important',
        title: 'Add Work Experience',
        description: 'Include relevant work experience to strengthen your resume.',
        section: 'experience'
      });
    }

    // Suggestions
    if (resumeData.skills?.length < 5) {
      improvements.push({
        type: 'suggestion',
        title: 'Expand Skills Section',
        description: 'Add more relevant skills to showcase your capabilities.',
        section: 'skills'
      });
    }

    if (!resumeData.projects?.length) {
      improvements.push({
        type: 'suggestion',
        title: 'Add Projects',
        description: 'Include relevant projects to demonstrate your practical experience.',
        section: 'projects'
      });
    }

    return improvements;
  };

  const handleImproveResume = async () => {
    setIsAnalyzing(true);
    try {
      const resumeText = formatResumeData();
      
      // Generic job description for general analysis
      const genericJobDescription = `
        We are looking for a qualified professional with relevant experience and skills.
        The ideal candidate should have strong communication skills, problem-solving abilities,
        and technical expertise in their field. Experience with modern tools and technologies
        is preferred. The role requires attention to detail, teamwork, and the ability to
        work in a fast-paced environment.
      `;
      
      const result = await analyzeResume(resumeText, genericJobDescription);
      
      const improvements = generateImprovements(result);
      
      setAnalysis({
        score: result.score,
        improvements,
        atsScore: Math.max(result.score - 10, 0), // ATS score is typically lower
        keywords: result.matchedKeywords
      });
      
      toast.success('Resume analysis complete!');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'important': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'suggestion': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="h-5 w-5" />;
      case 'important': return <TrendingUp className="h-5 w-5" />;
      case 'suggestion': return <CheckCircle className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Resume Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-6">
              <Sparkles className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Get AI-Powered Resume Suggestions
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI will analyze your resume and provide personalized recommendations to improve your chances of landing interviews.
              </p>
            </div>
            
            <TouchRipple className="rounded-lg inline-block">
              <Button
                onClick={handleImproveResume}
                disabled={isAnalyzing}
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3",
                  isMobile && "w-full"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Your Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Improve My Resume with AI
                  </>
                )}
              </Button>
            </TouchRipple>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resume Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{analysis.score}%</div>
                  <Progress value={analysis.score} className="mb-4" />
                  <p className="text-sm text-gray-600">
                    {analysis.score >= 80 ? 'Excellent resume!' : 
                     analysis.score >= 60 ? 'Good foundation, room for improvement' : 
                     'Needs significant improvements'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ATS Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{analysis.atsScore}%</div>
                  <Progress value={analysis.atsScore} className="mb-4" />
                  <p className="text-sm text-gray-600">
                    {analysis.atsScore >= 80 ? 'ATS-friendly!' : 
                     analysis.atsScore >= 60 ? 'Mostly compatible' : 
                     'Needs ATS optimization'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle>Improvement Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className={cn(
                "rounded-lg",
                isMobile ? "h-[400px]" : "h-[500px]"
              )}>
                <div className="space-y-4">
                  {analysis.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border",
                        getTypeColor(improvement.type)
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getTypeIcon(improvement.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{improvement.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {improvement.section}
                            </Badge>
                          </div>
                          <p className="text-sm">{improvement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {analysis.improvements.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>Great job! Your resume looks excellent.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Keywords */}
          {analysis.keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detected Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};