
import React, { useState } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
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

const ResumeChecker = () => {
  const { resumeData } = useResumeContext();
  const [jobDescription, setJobDescription] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<null | {
    score: number;
    matchedKeywords: string[];
    missedKeywords: string[];
    suggestions: string[];
  }>(null);

  const handleCheck = () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }
    
    setIsChecking(true);
    
    // Simulate resume check process
    setTimeout(() => {
      // This would normally be an API call to analyze the resume against the job description
      // For this example, we'll create a simulated result
      
      // Extract some keywords from the job description
      let allWords = jobDescription.toLowerCase().split(/\s+/);
      allWords = allWords.filter(word => word.length > 3);
      
      // Check which skills from the resume match keywords in the job description
      const resumeSkills = resumeData.skills || [];
      const matchedKeywords = resumeSkills.filter(skill => 
        jobDescription.toLowerCase().includes(skill.toLowerCase())
      );
      
      // Generate some missed keywords that might be in the job description
      // In a real implementation, this would use NLP to extract key job requirements
      const commonJobKeywords = [
        "leadership", "communication", "teamwork", "problem-solving",
        "project management", "JavaScript", "React", "Node.js",
        "agile", "scrum", "data analysis", "customer service"
      ];
      
      const missedKeywords = commonJobKeywords.filter(keyword => 
        jobDescription.toLowerCase().includes(keyword.toLowerCase()) && 
        !resumeSkills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))
      ).slice(0, 5);
      
      // Calculate match score (0-100)
      const score = Math.min(100, Math.round((matchedKeywords.length / (matchedKeywords.length + missedKeywords.length)) * 100));
      
      // Generate suggestions
      const suggestions = [
        "Add more specific skills that match the job description",
        "Quantify your achievements with numbers and percentages",
        "Include relevant industry keywords from the job posting"
      ];
      
      if (missedKeywords.length > 0) {
        suggestions.push(`Consider adding these keywords: ${missedKeywords.join(', ')}`);
      }
      
      if (score < 40) {
        suggestions.push("Your resume needs significant improvement to pass screening systems");
      } else if (score < 70) {
        suggestions.push("Your resume may pass some screening systems but could be improved");
      } else {
        suggestions.push("Your resume is well-optimized for job applications");
      }
      
      setCheckResult({
        score,
        matchedKeywords,
        missedKeywords,
        suggestions
      });
      
      setIsChecking(false);
    }, 2000);
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
          <CardTitle>Resume Compatibility Checker</CardTitle>
          <CardDescription className="text-gray-100">
            Check how well your resume matches a specific job description
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-6">
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
            disabled={isChecking || jobDescription.trim().length === 0}
            className="bg-resume-primary hover:bg-resume-secondary w-full"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Resume
              </>
            ) : (
              <>
                Check Compatibility <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          {checkResult && (
            <div className="mt-8 space-y-6">
              <div className="flex flex-col items-center">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500 mb-1">Your Resume Compatibility Score</p>
                  <div className={`text-4xl font-bold ${getScoreColor(checkResult.score)}`}>
                    {checkResult.score}%
                  </div>
                </div>
                <Progress 
                  value={checkResult.score} 
                  className="w-full h-3" 
                  indicatorClassName={getScoreBackground(checkResult.score)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-green-600 flex items-center gap-2 mb-3">
                    <CheckCircle size={18} />
                    <span>Matched Keywords</span>
                  </h3>
                  {checkResult.matchedKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {checkResult.matchedKeywords.map((keyword, index) => (
                        <span key={index} className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No matching keywords found</p>
                  )}
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-orange-600 flex items-center gap-2 mb-3">
                    <AlertCircle size={18} />
                    <span>Missing Keywords</span>
                  </h3>
                  {checkResult.missedKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {checkResult.missedKeywords.map((keyword, index) => (
                        <span key={index} className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No missing keywords detected</p>
                  )}
                </div>
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
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Resume Tips</h3>
        <div className="space-y-3">
          <p className="text-gray-700">
            <strong>What makes a good resume?</strong> A good resume clearly showcases your skills, experience, and achievements in a concise, professional format.
          </p>
          <p className="text-gray-700">
            <strong>Why it matters:</strong> 75% of resumes are rejected by automated screening systems before a human sees them. Optimizing your resume is crucial for getting past this first filter.
          </p>
          <div className="text-gray-700">
            <strong>Quick resume tips:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use a simple, clean format without tables or complicated graphics</li>
              <li>Include keywords directly from the job description</li>
              <li>Use standard section headings (Experience, Education, Skills)</li>
              <li>Submit in PDF format (unless requested otherwise)</li>
              <li>Include your name and contact information at the top</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeChecker;
