
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const JobSearchTips = () => {
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
            <Link to="/job-search-tips" className="text-resume-primary font-medium">Job Search Tips</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-resume-primary mb-6">Job Search Tips</h2>
          <p className="text-gray-600 mb-10">Discover effective strategies to navigate the job market and find opportunities that match your skills and career goals.</p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Define Your Job Search Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">Before diving into job applications, take time to clarify your career goals and what you're looking for in your next position. Consider:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>The type of role and industry you want to work in</li>
                  <li>Your preferred work environment (remote, hybrid, in-office)</li>
                  <li>Salary expectations and benefits you need</li>
                  <li>Company culture and values that align with yours</li>
                  <li>Opportunities for growth and development</li>
                </ul>
                <p className="text-gray-700">Having clarity on these points will help you focus your search and evaluate opportunities more effectively.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Optimize Your Online Presence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">In today's digital job market, your online presence matters:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li><span className="font-medium">LinkedIn Profile:</span> Keep it updated with your current skills, experiences, and a professional photo. Use relevant keywords for your industry.</li>
                  <li><span className="font-medium">Portfolio/Personal Website:</span> Showcase your work and skills, especially for creative or technical roles.</li>
                  <li><span className="font-medium">GitHub/Technical Profiles:</span> For tech roles, maintain an active presence on platforms like GitHub.</li>
                  <li><span className="font-medium">Social Media Audit:</span> Review your social media accounts and adjust privacy settings or remove content that might be viewed negatively by potential employers.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Job Search Platforms and Networking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">Diversify your job search approach:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li><span className="font-medium">Job Boards:</span> Use popular platforms like Indeed, LinkedIn, Glassdoor, and industry-specific job boards.</li>
                  <li><span className="font-medium">Company Websites:</span> Check career pages of companies you're interested in.</li>
                  <li><span className="font-medium">Networking:</span> Reach out to professional connections, attend industry events, join online communities, and participate in relevant discussions.</li>
                  <li><span className="font-medium">Recruiters:</span> Connect with recruiters specializing in your field.</li>
                  <li><span className="font-medium">Alumni Networks:</span> Leverage your educational institution's alumni network.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Application Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li><span className="font-medium">Tailor applications:</span> Customize your resume and cover letter for each position.</li>
                  <li><span className="font-medium">Follow instructions:</span> Pay attention to application requirements and follow them carefully.</li>
                  <li><span className="font-medium">Use keywords:</span> Incorporate relevant keywords from the job description.</li>
                  <li><span className="font-medium">Apply early:</span> Submit your application as soon as possible after a job is posted.</li>
                  <li><span className="font-medium">Follow up:</span> Send a polite follow-up email if you haven't heard back after a week or two.</li>
                  <li><span className="font-medium">Stay organized:</span> Keep track of applications, follow-ups, and responses.</li>
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

export default JobSearchTips;
