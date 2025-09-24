import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfService = () => {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using ResumeBuilder, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily use ResumeBuilder for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Create and customize resume templates</li>
                <li>Generate AI-powered content for your resume</li>
                <li>Download your completed resume</li>
                <li>Store your resume data locally in your browser</li>
              </ul>
              <p className="mb-4">
                This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. AI-Generated Content</h2>
              <p className="mb-4">
                Our service uses artificial intelligence to help generate resume content. By using our AI features, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>AI-generated content is provided as suggestions and should be reviewed and edited by you</li>
                <li>You are responsible for the accuracy and truthfulness of all content in your resume</li>
                <li>We do not guarantee the quality or appropriateness of AI-generated content</li>
                <li>You retain full ownership of your resume content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Privacy and Data</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Resume data is stored locally in your browser</li>
                <li>We do not sell or share your personal information</li>
                <li>Uploaded files are processed securely and not permanently stored</li>
                <li>You can delete your data at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
              <p className="mb-4">You may not use our service:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
              <p className="mb-4">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Excludes all representations and warranties relating to this website and its contents</li>
                <li>Does not guarantee job placement or interview success</li>
                <li>Is not responsible for the outcome of your job applications</li>
                <li>Does not warrant that the service will be uninterrupted or error-free</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Limitations</h2>
              <p className="mb-4">
                In no event shall ResumeBuilder or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ResumeBuilder's website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Accuracy of Materials</h2>
              <p className="mb-4">
                The materials appearing on ResumeBuilder's website could include technical, typographical, or photographic errors. ResumeBuilder does not warrant that any of the materials on its website are accurate, complete, or current.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Links</h2>
              <p className="mb-4">
                ResumeBuilder has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ResumeBuilder of the site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Modifications</h2>
              <p className="mb-4">
                ResumeBuilder may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us through our website.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};