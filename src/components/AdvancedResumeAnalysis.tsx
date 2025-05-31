
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { AlertCircle, CheckCircle, TrendingUp, Target } from 'lucide-react';
import { 
  getComprehensiveResumeAnalysis, 
  getIndustryOptimization 
} from '../services/langchain/langchainService';
import { useToast } from './ui/use-toast';
import { useResumeContext } from '../context/ResumeContext';

export const AdvancedResumeAnalysis = () => {
  const { resumeData } = useResumeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [industryOptimization, setIndustryOptimization] = useState<any>(null);
  const { toast } = useToast();

  const generateResumeText = () => {
    const { personalInfo, workExperience, education, skills } = resumeData;
    
    return `
${personalInfo.firstName} ${personalInfo.lastName}
${personalInfo.email} | ${personalInfo.phone}

SUMMARY
${personalInfo.summary || 'Professional seeking new opportunities'}

WORK EXPERIENCE
${workExperience.map(job => `
${job.position} at ${job.company}
${job.startDate} - ${job.endDate || 'Present'}
${job.description}
`).join('\n')}

EDUCATION
${education.map(edu => `
${edu.degree} in ${edu.fieldOfStudy}
${edu.school} (${edu.graduationDate})
${edu.description || ''}
`).join('\n')}

SKILLS
${skills.join(', ')}
    `.trim();
  };

  const handleComprehensiveAnalysis = async () => {
    if (!targetRole || !industry || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields for comprehensive analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const resumeText = generateResumeText();
      const result = await getComprehensiveResumeAnalysis(
        resumeText,
        targetRole,
        industry,
        jobDescription
      );
      setAnalysis(result);
      
      toast({
        title: "Analysis Complete",
        description: "Your comprehensive resume analysis is ready!",
      });
    } catch (error) {
      console.error('Error in comprehensive analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndustryOptimization = async () => {
    if (!targetRole || !industry) {
      toast({
        title: "Missing Information",
        description: "Please specify target role and industry.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const resumeText = generateResumeText();
      const result = await getIndustryOptimization(resumeText, targetRole, industry);
      setIndustryOptimization(result);
      
      toast({
        title: "Optimization Complete",
        description: "Industry-specific recommendations are ready!",
      });
    } catch (error) {
      console.error('Error in industry optimization:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to generate optimization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Advanced Resume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role</Label>
              <Input
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Technology"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here for detailed analysis..."
              className="min-h-[120px]"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleComprehensiveAnalysis}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Analyzing..." : "Comprehensive Analysis"}
            </Button>
            <Button
              onClick={handleIndustryOptimization}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? "Optimizing..." : "Industry Optimization"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="improvements">Improvements</TabsTrigger>
            <TabsTrigger value="ats">ATS Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Resume Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Overall Score</span>
                      <span className="text-2xl font-bold">{analysis.analysis.overallScore}%</span>
                    </div>
                    <Progress value={analysis.analysis.overallScore} className="h-3" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.analysis.strengths.map((strength: string, index: number) => (
                        <Badge key={index} variant="secondary">{strength}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Areas for Improvement</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.analysis.weaknesses.map((weakness: string, index: number) => (
                        <Badge key={index} variant="destructive">{weakness}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-blue-600">Missing Elements</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.analysis.missingElements.map((element: string, index: number) => (
                        <Badge key={index} variant="outline">{element}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="improvements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Improvement Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Priority Actions</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysis.improvements.priorityActions.map((action: string, index: number) => (
                          <li key={index} className="text-sm">{action}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Content Suggestions</h4>
                      <div className="space-y-2">
                        <div>
                          <h5 className="text-sm font-medium">Summary</h5>
                          <p className="text-sm text-muted-foreground">{analysis.improvements.contentSuggestions.summary}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Recommended Skills</h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.improvements.contentSuggestions.skills.map((skill: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Formatting Tips</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysis.improvements.formattingTips.map((tip: string, index: number) => (
                          <li key={index} className="text-sm">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  ATS Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">ATS Score</span>
                      <span className="text-2xl font-bold">{analysis.atsOptimization.atsScore}%</span>
                    </div>
                    <Progress value={analysis.atsOptimization.atsScore} className="h-3" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">Matched Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.atsOptimization.keywordMatches.map((keyword: string, index: number) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.atsOptimization.missingKeywords.map((keyword: string, index: number) => (
                        <Badge key={index} variant="destructive">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.atsOptimization.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {industryOptimization && (
        <Card>
          <CardHeader>
            <CardTitle>Industry-Specific Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Industry Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {industryOptimization.industryKeywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline">{keyword}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Essential Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {industryOptimization.essentialSkills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Optimized Summary</h4>
                <p className="text-sm text-muted-foreground">{industryOptimization.optimizedContent.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
