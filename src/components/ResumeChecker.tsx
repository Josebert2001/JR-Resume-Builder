import React, { useState } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle, CheckCircle, ArrowRight, Upload, Building, Coins, FileText, CheckSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { getDetailedAnalysis, DetailedResumeAnalysis } from '@/services/aiService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const ResumeChecker = () => {
  const { resumeData } = useResumeContext();
  const [jobDescription, setJobDescription] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<DetailedResumeAnalysis | null>(null);

  // Convert resume data to a string format for analysis
  const getResumeContent = () => {
    const sections = [
      `Name: ${resumeData.name}`,
      `Summary: ${resumeData.summary || ''}`,
      `Skills: ${resumeData.skills?.join(', ') || ''}`,
      'Work Experience:',
      ...resumeData.workExperience?.map(exp => 
        `${exp.position} at ${exp.company}\n${exp.description}`
      ) || [],
      'Education:',
      `${resumeData.course} at ${resumeData.school}`,
      'Projects:',
      ...resumeData.projects?.map(project => 
        `${project.name}: ${project.description}\nTechnologies: ${project.technologies}`
      ) || []
    ];
    
    return sections.join('\n\n');
  };

  const handleCheck = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    if (!resumeData.name || !resumeData.skills?.length) {
      toast.error("Please complete your resume first");
      return;
    }
    
    setIsChecking(true);
    try {
      const result = await getDetailedAnalysis(getResumeContent(), jobDescription);
      setCheckResult(result);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error('Resume analysis error:', error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return "text-red-500";
    if (score < 70) return "text-orange-500";
    return "text-green-500";
  };

  const getScoreBackground = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-gradient-to-r from-resume-primary to-resume-secondary text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <CardTitle>Resume Compatibility Checker</CardTitle>
          </div>
          <CardDescription className="text-gray-100">
            Check how well your resume matches a specific job description
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            {(!resumeData.name || !resumeData.skills?.length) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Resume Incomplete</AlertTitle>
                <AlertDescription>
                  Please complete your resume before checking compatibility.
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Paste the job description here:</h3>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Copy and paste the full job description here to check your resume's compatibility..."
                className="min-h-[200px]"
              />
            </div>
          
            <Button
              onClick={handleCheck}
              disabled={isChecking || !jobDescription.trim() || !resumeData.name || !resumeData.skills?.length}
              className="bg-resume-primary hover:bg-resume-secondary w-full"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Resume
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Check Compatibility
                </>
              )}
            </Button>

            {checkResult && (
              <div className="mt-8 space-y-6 animate-fade-in">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-gray-200">
                    <span className={`text-3xl font-bold ${getScoreColor(checkResult.score)}`}>
                      {checkResult.score}%
                    </span>
                  </div>
                  <Progress 
                    value={checkResult.score} 
                    className="w-full mt-4" 
                    indicatorClassName={getScoreBackground(checkResult.score)} 
                  />
                </div>

                <Tabs defaultValue="match" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="match">Match Analysis</TabsTrigger>
                    <TabsTrigger value="industry">Industry Insights</TabsTrigger>
                    <TabsTrigger value="ats">ATS Check</TabsTrigger>
                    <TabsTrigger value="cover">Cover Letter</TabsTrigger>
                  </TabsList>

                  <TabsContent value="match" className="space-y-6 mt-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">Matched Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {checkResult.matchedKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">Missing Keywords</h3>
                      {checkResult.missedKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {checkResult.missedKeywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="bg-orange-50 text-orange-700">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No missing keywords detected</p>
                      )}
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-3">Suggestions for Improvement</h3>
                      <ul className="space-y-2">
                        {checkResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <ArrowRight size={16} className="mt-1 flex-shrink-0 text-resume-primary" />
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="industry" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-resume-primary" />
                            <CardTitle className="text-base">Industry Trends</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">{checkResult.industryInsights.trendsAndDemand}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4 text-resume-primary" />
                            <CardTitle className="text-base">Salary Information</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">{checkResult.industryInsights.salaryRange}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">Key Competitors in the Industry</h3>
                      <div className="flex flex-wrap gap-2">
                        {checkResult.industryInsights.keyCompetitors.map((competitor, index) => (
                          <Badge key={index} variant="outline">
                            {competitor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ats" className="space-y-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-800">ATS Compatibility Score</h3>
                      <Badge variant="secondary" className={`${getScoreColor(checkResult.atsCompatibility.score)}`}>
                        {checkResult.atsCompatibility.score}%
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Formatting Issues</h4>
                        <ul className="space-y-2">
                          {checkResult.atsCompatibility.formatting.map((issue, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckSquare size={16} className="mt-1 flex-shrink-0 text-resume-primary" />
                              <span className="text-gray-700">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Content Issues</h4>
                        <ul className="space-y-2">
                          {checkResult.atsCompatibility.issues.map((issue, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <AlertCircle size={16} className="mt-1 flex-shrink-0 text-orange-500" />
                              <span className="text-gray-700">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cover" className="space-y-6 mt-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">Key Points to Address</h3>
                      <ul className="space-y-2">
                        {checkResult.coverLetterSuggestions.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <ArrowRight size={16} className="mt-1 flex-shrink-0 text-resume-primary" />
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">Your Unique Selling Points</h3>
                      <div className="flex flex-wrap gap-2">
                        {checkResult.coverLetterSuggestions.uniqueSellingPoints.map((point, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-resume-primary" />
                          <CardTitle className="text-base">Customization Guide</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{checkResult.coverLetterSuggestions.customization}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>
        
        {checkResult && (
          <CardFooter className="border-t pt-6">
            <p className="text-sm text-gray-500">
              This analysis is powered by AI and should be used as a guide. Always review and customize your resume for each application.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ResumeChecker;
