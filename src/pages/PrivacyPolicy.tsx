import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Privacy Policy
            </CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 not-prose">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Lock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold text-green-800 dark:text-green-200">Local Storage</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Your data stays on your device</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Eye className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">No Tracking</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">We don't track your behavior</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold text-purple-800 dark:text-purple-200">Secure Processing</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">AI processing is secure</p>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                ResumeBuilder is designed with privacy in mind. We collect minimal information to provide our services:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Personal Information You Provide</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Resume content (name, contact information, work history, education, skills)</li>
                <li>Files you upload for resume improvement</li>
                <li>Account information if you choose to create an account</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Basic usage analytics (pages visited, features used)</li>
                <li>Technical information (browser type, device type, IP address)</li>
                <li>Error logs to improve service reliability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Provide Services:</strong> Generate AI-powered resume content and suggestions</li>
                <li><strong>Improve Experience:</strong> Analyze usage patterns to enhance features</li>
                <li><strong>Technical Support:</strong> Diagnose and fix technical issues</li>
                <li><strong>Communication:</strong> Send important service updates (if you have an account)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
              
              <h3 className="text-xl font-semibold mb-3">Local Storage</h3>
              <p className="mb-4">
                Your resume data is primarily stored locally in your browser's storage. This means:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Data remains on your device and under your control</li>
                <li>We cannot access your data unless you explicitly share it</li>
                <li>You can clear your data at any time by clearing browser storage</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Temporary Processing</h3>
              <p className="mb-4">
                When using AI features:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your content is temporarily sent to our AI service for processing</li>
                <li>Data is processed securely and deleted immediately after use</li>
                <li>We do not store or retain AI-processed content</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Security Measures</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>All data transmission is encrypted using HTTPS</li>
                <li>AI processing uses secure, isolated environments</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and monitoring for our systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information only in these limited circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>AI Processing:</strong> Temporary sharing with AI service providers (content is deleted after processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Service Providers:</strong> With trusted partners who help operate our service (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
              <p className="mb-4">You have the following rights regarding your data:</p>
              
              <h3 className="text-xl font-semibold mb-3">Access and Control</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>View and edit all your resume data at any time</li>
                <li>Download your resume data in various formats</li>
                <li>Delete your local data by clearing browser storage</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Account Management</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Delete your account and associated data</li>
                <li>Opt-out of non-essential communications</li>
                <li>Request data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
              <p className="mb-4">
                We use minimal cookies and tracking:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li><strong>Analytics:</strong> Anonymous usage statistics to improve our service</li>
                <li><strong>Preferences:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="mb-4">
                You can control cookies through your browser settings. Disabling cookies may affect some functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Third-Party Services</h2>
              <p className="mb-4">Our service integrates with:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>AI Providers:</strong> For content generation (data is processed securely and not stored)</li>
                <li><strong>Analytics Services:</strong> For anonymous usage statistics</li>
                <li><strong>CDN Services:</strong> For fast, reliable content delivery</li>
              </ul>
              <p className="mb-4">
                These services have their own privacy policies, which we encourage you to review.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
              <p className="mb-4">
                Our service is intended for users 16 years and older. We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child under 16, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. International Users</h2>
              <p className="mb-4">
                Our service is operated from the United States. If you are accessing our service from outside the US, please be aware that your information may be transferred to, stored, and processed in the US where our servers are located.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this privacy policy from time to time. We will notify you of any significant changes by:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Updating the "Last updated" date at the top of this policy</li>
                <li>Displaying a prominent notice on our website</li>
                <li>Sending an email notification (if you have an account)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Through our website contact form</li>
                <li>By email: privacy@resumebuilder.com</li>
              </ul>
            </section>

            <section className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-200">Our Privacy Commitment</h2>
              <p className="mb-4 text-blue-700 dark:text-blue-300">
                We believe privacy is a fundamental right. Our business model is built on providing excellent resume-building tools, not on collecting and monetizing your personal data. We are committed to transparency, security, and giving you control over your information.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};