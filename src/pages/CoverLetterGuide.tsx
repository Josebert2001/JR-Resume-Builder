
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CoverLetterGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" 
              alt="JR Resume Builder Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-resume-primary to-coral-red text-transparent bg-clip-text">JR Resume Builder</h1>
              <p className="text-gray-600 text-sm">Create professional resumes with ease</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-resume-primary transition-colors">Home</Link>
            <Link to="/cover-letter-guide" className="text-resume-primary font-medium">Cover Letter Guide</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-resume-primary mb-6">Cover Letter Guide</h2>
          <p className="text-gray-600 mb-10">Learn how to write compelling cover letters that complement your resume and help you stand out to potential employers.</p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What is a Cover Letter?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">A cover letter is a one-page document that you submit alongside your resume when applying for jobs. Its purpose is to introduce yourself and briefly summarize your professional background. A well-written cover letter should highlight your most relevant qualifications for the job and explain why you're interested in the position.</p>
              <p className="text-gray-700">While your resume provides a detailed summary of your skills, education, and experience, your cover letter gives you the opportunity to point out specific achievements that would make you a great fit for the role and explain aspects of your career that might need clarification, such as gaps in employment or career changes.</p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cover Letter Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">1. Header</h3>
                  <p className="text-gray-700">Include your contact information, the date, and the recipient's contact information at the top of the letter.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">2. Greeting</h3>
                  <p className="text-gray-700">Address the hiring manager by name if possible. If you don't know their name, use "Dear Hiring Manager" or "Dear [Department] Team".</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">3. Opening Paragraph</h3>
                  <p className="text-gray-700">State the position you're applying for and where you found the job posting. Express your enthusiasm for the role and briefly mention why you're interested in the position and company.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">4. Body Paragraphs</h3>
                  <p className="text-gray-700">Highlight your most relevant skills and experiences, explaining how they make you a good fit for the position. Use specific examples and quantify your achievements when possible. Connect your background to the job requirements.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">5. Closing Paragraph</h3>
                  <p className="text-gray-700">Restate your interest in the position and company. Thank the reader for their time and consideration. Express interest in an interview and provide your availability if applicable.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">6. Signature</h3>
                  <p className="text-gray-700">End with a professional closing, such as "Sincerely," followed by your name.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-xl text-resume-primary mb-4">Cover Letter Tips</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Keep it concise – aim for one page with 3-4 paragraphs</li>
              <li>Customize each letter for the specific job you're applying for</li>
              <li>Address a specific person when possible</li>
              <li>Focus on how you can benefit the company, not how the job benefits you</li>
              <li>Use a professional tone and avoid using complex language</li>
              <li>Proofread carefully for spelling and grammar errors</li>
              <li>Match the formatting style of your resume for a cohesive application package</li>
            </ul>
          </div>
          
          <Link to="/">
            <Button className="bg-resume-primary hover:bg-resume-secondary">
              Return to Resume Builder
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-white py-8 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} JR Resume Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CoverLetterGuide;
