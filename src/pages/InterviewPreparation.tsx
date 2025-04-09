
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InterviewPreparation = () => {
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
            <Link to="/interview-preparation" className="text-resume-primary font-medium">Interview Preparation</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-resume-primary mb-6">Interview Preparation</h2>
          <p className="text-gray-600 mb-10">Prepare effectively for job interviews with these comprehensive tips and strategies.</p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Before the Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-2">Research the Company</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Study the company's website, mission, vision, and values</li>
                  <li>Research recent news, projects, and achievements</li>
                  <li>Understand their products, services, and target market</li>
                  <li>Learn about their company culture and work environment</li>
                  <li>Research who will be interviewing you if possible</li>
                </ul>
                
                <h3 className="font-semibold text-gray-800 mb-2 mt-6">Understand the Role</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Review the job description thoroughly</li>
                  <li>Identify required skills and qualifications</li>
                  <li>Prepare examples from your experience that demonstrate these skills</li>
                  <li>Think about how your background fits the role's requirements</li>
                </ul>
                
                <h3 className="font-semibold text-gray-800 mb-2 mt-6">Practice Common Interview Questions</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Prepare answers for behavioral questions using the STAR method (Situation, Task, Action, Result)</li>
                  <li>Practice explaining your resume and career transitions</li>
                  <li>Prepare questions to ask the interviewer</li>
                  <li>Consider conducting mock interviews with friends or mentors</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>During the Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-2">Make a Strong First Impression</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Dress professionally and appropriately for the company culture</li>
                  <li>Arrive 10-15 minutes early (or log in early for virtual interviews)</li>
                  <li>Greet the interviewer with a firm handshake and confident smile</li>
                  <li>Make good eye contact and demonstrate positive body language</li>
                </ul>
                
                <h3 className="font-semibold text-gray-800 mb-2 mt-6">Communication Tips</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Listen carefully to questions before responding</li>
                  <li>Speak clearly and concisely, avoiding filler words</li>
                  <li>Use concrete examples to illustrate your points</li>
                  <li>Be authentic and show your personality</li>
                  <li>Demonstrate enthusiasm for the role and company</li>
                </ul>
                
                <h3 className="font-semibold text-gray-800 mb-2 mt-6">Handling Difficult Questions</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Stay calm and composed when faced with challenging questions</li>
                  <li>It's okay to take a moment to think before answering</li>
                  <li>Be honest about areas where you're still developing</li>
                  <li>Frame weaknesses as areas for growth and describe steps you're taking to improve</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>After the Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-2">Follow Up</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Send a thank-you email within 24 hours</li>
                  <li>Express appreciation for the opportunity to interview</li>
                  <li>Reiterate your interest in the position</li>
                  <li>Briefly mention a key point from the conversation</li>
                </ul>
                
                <h3 className="font-semibold text-gray-800 mb-2 mt-6">Self-Assessment</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Reflect on your performance and the interview experience</li>
                  <li>Note questions that were difficult to answer for future preparation</li>
                  <li>Consider if the role and company feel like a good fit</li>
                </ul>
                
                <h3 className="font-semibold text-gray-800 mb-2 mt-6">Next Steps</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Follow up after one week if you haven't heard back</li>
                  <li>Continue your job search while waiting for a response</li>
                  <li>Prepare for potential subsequent interviews or assessments</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
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

export default InterviewPreparation;
