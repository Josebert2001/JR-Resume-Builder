import React, { useRef, useState, useEffect } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, ArrowLeft, RefreshCw, Briefcase, MapPin, Calendar, Link2, Award, FileCode, Github, Linkedin, Loader2, Mail, Phone, GraduationCap } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { toast } from 'sonner';
import JobSearch from '@/components/JobSearch';
import { generateProfessionalInterests } from '@/services/aiService';

const ResumePreview = () => {
  const { resumeData, setCurrentStep, setIsGenerating, updateResumeData } = useResumeContext();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [showJobSearch, setShowJobSearch] = React.useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showInterestsDialog, setShowInterestsDialog] = useState(false);
  const [suggestedInterests, setSuggestedInterests] = useState<{ interests: string[], descriptions: Record<string, string> }>({ interests: [], descriptions: {} });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(false);

  const { toPDF, targetRef } = usePDF({
    filename: `${resumeData.name.replace(/\s+/g, '_')}_resume.pdf`,
    page: {
      format: 'a4',
      margin: 20,
      orientation: 'portrait'
    }
  });

  const getTemplateStyles = () => {
    // Set A4 width, narrow margin, and base font size 13.5px
    const baseStyles = "bg-white border border-gray-200 rounded-lg shadow-sm mx-auto print:shadow-none print:border-none" +
      " w-[210mm] min-h-[297mm] p-[10mm] text-[13.5px]";
    
    switch (resumeData.template) {
      case 'modern':
        return `${baseStyles} modern-template`;
      case 'minimal':
        return `${baseStyles} minimal-template`;
      case 'professional':
        return `${baseStyles} professional-template`;
      case 'creative':
        return `${baseStyles} creative-template`;
      case 'chronological':
        return `${baseStyles} chronological-template`;
      case 'functional':
        return `${baseStyles} functional-template`;
      case 'combination':
        return `${baseStyles} combination-template`;
      case 'infographic':
        return `${baseStyles} infographic-template`;
      case 'targeted':
        return `${baseStyles} targeted-template`;
      case 'profile':
        return `${baseStyles} profile-template`;
      case 'mini':
        return `${baseStyles} mini-template`;
      default:
        return baseStyles;
    }
  };

  const handleBack = () => {
    setCurrentStep(5); // Go back to Skills step
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setCurrentStep(2);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await toPDF();
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download. Please try again.');
      console.error('PDF generation error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleJobSearch = () => {
    setShowJobSearch(!showJobSearch);
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return '';
    if (!endDate) return `${startDate} - Present`;
    return `${startDate} - ${endDate}`;
  };

  const handleGenerateInterests = async () => {
    setIsLoadingInterests(true);
    try {
      const result = await generateProfessionalInterests(
        resumeData.fieldOfStudy || '',
        resumeData.skills || []
      );
      setSuggestedInterests(result);
      setSelectedInterests(resumeData.interests ? resumeData.interests.split(', ') : []);
      setShowInterestsDialog(true);
    } catch (error) {
      toast.error('Failed to generate professional interests');
    } finally {
      setIsLoadingInterests(false);
    }
  };

  const handleInterestSelection = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      }
      return [...prev, interest];
    });
  };

  const handleSaveInterests = () => {
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }

    // Save the selected interests to resumeData using updateResumeData
    const interests = selectedInterests.join(', ');
    updateResumeData({ interests });

    // Show success message and close dialog
    toast.success('Professional interests saved successfully');
    setShowInterestsDialog(false);
  };

  const downloadInterests = async () => {
    if (!resumeData.interests) {
      toast.error('No professional interests to download');
      return;
    }

    try {
      const interestsContent = resumeData.interests.split(', ').map(interest => 
        `${interest}${suggestedInterests.descriptions[interest] ? `\n- ${suggestedInterests.descriptions[interest]}` : ''}`
      ).join('\n\n');
      
      const blob = new Blob([interestsContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.name.replace(/\s+/g, '_')}_professional_interests.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Professional interests downloaded successfully!');
    } catch (error) {
      console.error('Error downloading interests:', error);
      toast.error('Failed to download professional interests');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between mb-4">
        <Button 
          type="button" 
          onClick={handleBack}
          variant="outline"
          className="border-resume-primary text-resume-primary flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <div className="flex gap-2">
          <Button 
            type="button" 
            onClick={handleRegenerate}
            variant="outline"
            className="border-resume-primary text-resume-primary flex items-center gap-2"
          >
            <RefreshCw size={16} /> Regenerate
          </Button>
          <Button 
            type="button" 
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-resume-primary hover:bg-resume-secondary text-white flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download size={16} />
                Download PDF
              </>
            )}
          </Button>
          <Button 
            type="button" 
            onClick={toggleJobSearch}
            variant="outline"
            className="border-resume-primary text-resume-primary flex items-center gap-2"
          >
            <Briefcase size={16} /> {showJobSearch ? 'Hide' : 'Find'} Jobs
          </Button>
        </div>
      </div>

      {showJobSearch && <JobSearch resumeData={resumeData} />}

      <div 
        ref={targetRef} 
        className={getTemplateStyles()}
        style={{
          fontFamily: resumeData.template === 'modern' ? "'Poppins', sans-serif" : 
                     resumeData.template === 'minimal' ? "'Inter', sans-serif" :
                     "'Open Sans', sans-serif",
          fontSize: '13.5px', // enforce base font size
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
          padding: '10mm',
          boxSizing: 'border-box',
        }}
      >
        {/* Header Section - Template-specific styling */}
        <div className={`header-section ${resumeData.template}-header mb-6`}>
          <h1 className={`name-title ${resumeData.template}-name text-3xl font-bold`}>{resumeData.name}</h1>
          <div className={`contact-info ${resumeData.template}-contact`}>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-resume-secondary" />
                  <p>{resumeData.email}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-resume-secondary" />
                  <p>{resumeData.phone}</p>
                </div>
                {resumeData.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-resume-secondary" />
                    <span>{resumeData.location}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 justify-end items-end">
                {(resumeData.canRelocate || resumeData.openToRemote) && (
                  <p className="text-xs italic text-gray-600">
                    {resumeData.canRelocate ? '✓ Open to relocation' : ''}
                    {resumeData.canRelocate && resumeData.openToRemote ? ' • ' : ''}
                    {resumeData.openToRemote ? '✓ Remote work available' : ''}
                  </p>
                )}
                {(resumeData.linkedIn || resumeData.githubUrl) && (
                  <div className="flex gap-3">
                    {resumeData.linkedIn && (
                      <a href={resumeData.linkedIn} target="_blank" rel="noopener noreferrer" 
                        className="text-resume-primary hover:underline flex items-center gap-1.5 text-sm">
                        <Linkedin className="h-3.5 w-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {resumeData.githubUrl && (
                      <a href={resumeData.githubUrl} target="_blank" rel="noopener noreferrer" 
                        className="text-resume-primary hover:underline flex items-center gap-1.5 text-sm">
                        <Github className="h-3.5 w-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Career Objective - Template-specific styling */}
        {resumeData.summary && (
          <div className={`section-container ${resumeData.template}-section`}>
            <h2 className={`section-title ${resumeData.template}-title text-2xl font-semibold`}>Career Objective</h2>
            <p className={`section-content ${resumeData.template}-content`}>{resumeData.summary}</p>
          </div>
        )}

        {/* Education - Template-specific styling */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-resume-secondary mb-3">Education</h2>
          <div className="ml-2">
            <p className="font-medium text-lg">{resumeData.fieldOfStudy}</p>
            <p className="text-gray-700 text-base">{resumeData.school}</p>
            <p className="text-gray-600 text-base">Degree: {resumeData.degree}</p>
            <p className="text-gray-600 text-base">Graduation Year: {resumeData.graduationYear}</p>
            {resumeData.relevantCourses?.length > 0 && (
              <p className="text-gray-600 text-base">
                <span className="font-medium">Relevant Courses:</span> {resumeData.relevantCourses.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Work Experience - Template-specific styling */}
        {resumeData.workExperience && resumeData.workExperience.length > 0 && (
          <div className={`section-container ${resumeData.template}-section`}>
            <h2 className={`section-title ${resumeData.template}-title text-2xl font-semibold`}>Work Experience</h2>
            <div className="space-y-4">
              {resumeData.workExperience.map((exp) => (
                <div key={exp.id} className="ml-2">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-medium text-lg">{exp.position}</h3>
                      <div className="flex items-center gap-1.5 text-gray-700 text-base">
                        <Briefcase className="h-3.5 w-3.5 text-resume-secondary" />
                        <span>{exp.company}</span>
                        {exp.location && (
                          <>
                            <span className="mx-1">•</span>
                            <MapPin className="h-3.5 w-3.5 text-resume-secondary" />
                            <span>{exp.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-resume-secondary" />
                      <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
                    </div>
                  </div>
                  <div className="pl-4 text-gray-700 text-sm leading-snug">
                    {exp.description.split('\n').map((point, idx) => (
                      <p key={idx} className="mb-1">{point}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills - Template-specific styling */}
        <div className={`section-container ${resumeData.template}-section`}>
          <h2 className={`section-title ${resumeData.template}-title text-2xl font-semibold`}>Skills</h2>
          <div className="grid grid-cols-2 gap-2 ml-2">
            {resumeData.skills?.map((skill, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-resume-secondary"></div>
                <span className="text-gray-700 text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects - Template-specific styling */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <div className={`section-container ${resumeData.template}-section`}>
            <h2 className={`section-title ${resumeData.template}-title text-2xl font-semibold`}>Projects</h2>
            <div className="space-y-3">
              {resumeData.projects.map((project) => (
                <div key={project.id} className="ml-2">
                  <div className="flex items-center gap-2 mb-1">
                    <FileCode className="h-4 w-4 text-resume-secondary" />
                    <h3 className="font-medium text-lg">{project.name}</h3>
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-resume-primary hover:underline flex items-center gap-1 text-sm"
                      >
                        <Link2 className="h-3.5 w-3.5" />
                        <span>View Project</span>
                      </a>
                    )}
                  </div>
                  <div className="pl-6">
                    <p className="text-gray-700 mb-1 text-sm">{project.description}</p>
                    {project.technologies && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Technologies:</span> {project.technologies}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Interests - Template-specific styling */}
        <div className={`section-container ${resumeData.template}-section`}>
          <div className="flex justify-between items-center mb-2">
            <h2 className={`section-title ${resumeData.template}-title text-2xl font-semibold`}>Professional Interests</h2>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleGenerateInterests}
                variant="outline"
                size="sm"
                disabled={isLoadingInterests}
                className="text-xs"
              >
                {isLoadingInterests ? (
                  <>
                    <Loader2 size={12} className="animate-spin mr-1" />
                    Generating...
                  </>
                ) : (
                  'Generate Suggestions'
                )}
              </Button>
              {resumeData.interests && (
                <Button
                  type="button"
                  onClick={downloadInterests}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Download size={12} className="mr-1" />
                  Save Interests
                </Button>
              )}
            </div>
          </div>
          {resumeData.interests ? (
            <ul className={`section-content ${resumeData.template}-content list-disc ml-6`}>
              {resumeData.interests.split(',').map((interest, idx) => (
                <li key={idx} className="mb-1">{interest.trim()}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">Click 'Generate Suggestions' to add professional interests</p>
          )}
        </div>

        <Dialog open={showInterestsDialog} onOpenChange={setShowInterestsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select Professional Interests</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {suggestedInterests.interests.map((interest) => (
                  <div key={interest} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50">
                    <Checkbox
                      id={interest}
                      checked={selectedInterests.includes(interest)}
                      onCheckedChange={() => handleInterestSelection(interest)}
                    />
                    <div>
                      <label htmlFor={interest} className="font-medium text-sm cursor-pointer">
                        {interest}
                      </label>
                      <p className="text-gray-600 text-xs mt-1">
                        {suggestedInterests.descriptions[interest]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowInterestsDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveInterests}>
                Save Selected Interests
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ResumePreview;
