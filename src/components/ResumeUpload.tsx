import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileText, Sparkles, Loader2, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { analyzeResume } from '@/services/resumeAI';
import { useResumeContext } from '@/context/ResumeContext';
import { toast } from 'sonner';

interface ImprovementSuggestion {
  type: 'critical' | 'important' | 'suggestion';
  title: string;
  description: string;
  section: string;
}

interface AnalysisResult {
  score: number;
  improvements: ImprovementSuggestion[];
  atsScore: number;
  keywords: string[];
  extractedData?: {
    personalInfo?: any;
    workExperience?: any[];
    education?: any[];
    skills?: { id: string; name: string; level: number }[];
  };
}

export const ResumeUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [parsedContent, setParsedContent] = useState<string>('');
  const isMobile = useIsMobile();
  const { updateResumeData } = useResumeContext();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file);
        setAnalysis(null);
        setParsedContent('');
      } else {
        toast.error('Please upload a PDF, Word document, or text file.');
      }
    }
  };

  const parseResumeContent = async (content: string) => {
    // Simple parsing logic to extract basic information
    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
    
    // Extract email
    const emailMatch = content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const email = emailMatch ? emailMatch[0] : '';
    
    // Extract phone
    const phoneMatch = content.match(/[\+]?[1-9]?[\-\.\s]?\(?[0-9]{3}\)?[\-\.\s]?[0-9]{3}[\-\.\s]?[0-9]{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';
    
    // Extract skills (look for common skill section headers)
    const skillsSection = content.match(/(?:SKILLS|Skills|TECHNICAL SKILLS|Technical Skills)[:\n](.*?)(?:\n\n|\n[A-Z]|\n$)/s);
    const skills = skillsSection ? 
      skillsSection[1].split(/[,\n]/).map(s => s.trim()).filter(Boolean).slice(0, 10) : [];
    
    return {
      personalInfo: {
        email,
        phone,
        // Try to extract name from first few lines
        firstName: '',
        lastName: '',
        location: '',
        summary: ''
      },
      skills: skills.map(skill => ({ 
        id: Math.random().toString(36).substr(2, 9),
        name: skill, 
        level: 3 // intermediate level
      })),
      workExperience: [],
      education: []
    };
  };

  const generateImprovements = (score: number, content: string): ImprovementSuggestion[] => {
    const improvements: ImprovementSuggestion[] = [];
    
    // Critical improvements
    if (score < 60) {
      improvements.push({
        type: 'critical',
        title: 'Resume Needs Major Improvements',
        description: 'Your uploaded resume has significant room for improvement. Consider restructuring and adding more relevant content.',
        section: 'overall'
      });
    }

    if (!content.toLowerCase().includes('summary') && !content.toLowerCase().includes('objective')) {
      improvements.push({
        type: 'critical',
        title: 'Add Professional Summary',
        description: 'Your resume is missing a professional summary or objective statement.',
        section: 'summary'
      });
    }

    // Important improvements
    if (!content.toLowerCase().includes('experience') && !content.toLowerCase().includes('work')) {
      improvements.push({
        type: 'important',
        title: 'Add Work Experience',
        description: 'Include detailed work experience to strengthen your resume.',
        section: 'experience'
      });
    }

    if (!content.toLowerCase().includes('skill')) {
      improvements.push({
        type: 'important',
        title: 'Add Skills Section',
        description: 'Include a dedicated skills section to highlight your capabilities.',
        section: 'skills'
      });
    }

    // Suggestions
    if (content.length < 500) {
      improvements.push({
        type: 'suggestion',
        title: 'Expand Content',
        description: 'Your resume appears quite brief. Consider adding more detailed descriptions.',
        section: 'content'
      });
    }

    if (!content.toLowerCase().includes('education')) {
      improvements.push({
        type: 'suggestion',
        title: 'Add Education',
        description: 'Include your educational background to provide a complete picture.',
        section: 'education'
      });
    }

    return improvements;
  };

  const processUploadedResume = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    try {
      // Read file content
      let content = '';
      
      if (uploadedFile.type === 'text/plain') {
        content = await uploadedFile.text();
      } else {
        // For PDF and Word documents, we'll use a simple text extraction
        // In a real implementation, you'd use a proper document parsing library
        const reader = new FileReader();
        reader.onload = async (e) => {
          content = e.target?.result as string || '';
          await analyzeContent(content);
        };
        reader.readAsText(uploadedFile);
        return;
      }
      
      await analyzeContent(content);
    } catch (error) {
      console.error('Error processing resume:', error);
      toast.error('Failed to process resume. Please try again.');
      setIsProcessing(false);
    }
  };

  const analyzeContent = async (content: string) => {
    try {
      setParsedContent(content);
      
      // Generic job description for analysis
      const genericJobDescription = `
        We are looking for a qualified professional with relevant experience and skills.
        The ideal candidate should have strong communication skills, problem-solving abilities,
        and technical expertise in their field. Experience with modern tools and technologies
        is preferred. The role requires attention to detail, teamwork, and the ability to
        work in a fast-paced environment.
      `;
      
      const result = await analyzeResume(content, genericJobDescription);
      const extractedData = await parseResumeContent(content);
      const improvements = generateImprovements(result.score, content);
      
      setAnalysis({
        score: result.score,
        improvements,
        atsScore: Math.max(result.score - 10, 0),
        keywords: result.matchedKeywords,
        extractedData
      });
      
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Error analyzing content:', error);
      toast.error('Failed to analyze resume content.');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyExtractedData = () => {
    if (analysis?.extractedData) {
      updateResumeData(analysis.extractedData);
      toast.success('Resume data applied to your profile!');
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
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload Your Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-6">
              <FileText className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Upload Your Existing Resume
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Upload your current resume and let our AI analyze it for improvements. 
                We support PDF, Word documents, and text files.
              </p>
            </div>
            
            <div className="mb-6">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors",
                  isMobile && "w-full justify-center"
                )}
              >
                <Upload className="h-5 w-5" />
                Choose Resume File
              </label>
            </div>

            {uploadedFile && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">{uploadedFile.name}</span>
                  <Badge variant="secondary">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                </div>
              </div>
            )}

            {uploadedFile && (
              <TouchRipple className="rounded-lg inline-block">
                <Button
                  onClick={processUploadedResume}
                  disabled={isProcessing}
                  size="lg"
                  className={cn(
                    "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3",
                    isMobile && "w-full"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Analyze & Improve
                    </>
                  )}
                </Button>
              </TouchRipple>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
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

          {/* Apply Data Button */}
          {analysis.extractedData && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Button
                    onClick={applyExtractedData}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Apply Extracted Data to My Profile
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    This will populate your resume builder with the information from your uploaded resume.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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
                      <p>Great job! Your uploaded resume looks excellent.</p>
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