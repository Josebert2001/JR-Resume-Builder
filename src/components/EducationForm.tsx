import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useResumeContext } from '@/context/ResumeContext';

export default function EducationForm() {
  const { resumeData, updateResumeData, setCurrentStep } = useResumeContext();

  const handleBack = () => {
    setCurrentStep(2);
  };

  const handleNext = () => {
    setCurrentStep(4);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-gradient-to-r from-resume-primary to-resume-secondary text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">Education</h2>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Degree (e.g., Bachelor of Science)"
              value={resumeData.degree || ''}
              onChange={(e) => updateResumeData({ degree: e.target.value })}
            />
            <Input
              placeholder="Field of Study (e.g., Cyber Security)"
              value={resumeData.fieldOfStudy || ''}
              onChange={(e) => updateResumeData({ fieldOfStudy: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="School/University"
              value={resumeData.school || ''}
              onChange={(e) => updateResumeData({ school: e.target.value })}
            />
            <Input
              placeholder="Graduation Year (e.g., 2024)"
              value={resumeData.graduationYear || ''}
              onChange={(e) => updateResumeData({ graduationYear: e.target.value })}
            />
          </div>
          <Input
            placeholder="Relevant Courses (comma-separated)"
            value={resumeData.relevantCourses?.join(', ') || ''}
            onChange={(e) => updateResumeData({ 
              relevantCourses: e.target.value.split(',').map(course => course.trim()).filter(Boolean)
            })}
          />
          <Input
            placeholder="Achievements (comma-separated)"
            value={resumeData.achievements?.join(', ') || ''}
            onChange={(e) => updateResumeData({ 
              achievements: e.target.value.split(',').map(achievement => achievement.trim()).filter(Boolean)
            })}
          />
        </CardContent>

        <CardFooter className="flex justify-between pt-4 border-t">
          <Button 
            type="button" 
            onClick={handleBack}
            variant="outline"
            className="border-resume-primary text-resume-primary"
          >
            Back
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-resume-primary hover:bg-resume-secondary text-white"
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
