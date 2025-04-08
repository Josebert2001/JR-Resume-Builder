
import React, { useRef } from 'react';
import { useResumeContext } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, RefreshCw, Briefcase, MapPin, Calendar, Link2, Award, FileCode, Github, Linkedin } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { toast } from 'sonner';
import JobSearch from '@/components/JobSearch';

const ResumePreview = () => {
  const { resumeData, setCurrentStep, setIsGenerating } = useResumeContext();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [showJobSearch, setShowJobSearch] = React.useState(false);
  
  const { toPDF, targetRef } = usePDF({
    filename: `${resumeData.name.replace(/\s+/g, '_')}_resume.pdf`,
  });

  const handleBack = () => {
    setCurrentStep(2);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setCurrentStep(2);
  };

  const handleDownload = () => {
    if (toPDF) {
      toPDF();
      toast.success('Resume downloaded successfully!');
    } else {
      toast.error('Failed to download. Please try again.');
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

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between mb-8">
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
            className="bg-resume-primary hover:bg-resume-secondary text-white flex items-center gap-2"
          >
            <Download size={16} /> Download PDF
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
        className="resume-preview bg-white p-8 border border-gray-200 rounded-lg shadow-sm"
      >
        <div className="border-b-2 border-resume-primary pb-4 mb-6">
          <h1 className="text-3xl font-bold text-resume-primary">{resumeData.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-gray-600">
            <p>{resumeData.email}</p>
            <p>{resumeData.phone}</p>
            {resumeData.location && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{resumeData.location}</span>
              </div>
            )}
            {(resumeData.canRelocate || resumeData.openToRemote) && (
              <p className="text-sm italic">
                {resumeData.canRelocate ? 'Open to relocation' : ''}
                {resumeData.canRelocate && resumeData.openToRemote ? ' • ' : ''}
                {resumeData.openToRemote ? 'Remote work available' : ''}
              </p>
            )}
          </div>
          
          {/* Social Links */}
          {(resumeData.linkedIn || resumeData.githubUrl) && (
            <div className="flex gap-4 mt-2">
              {resumeData.linkedIn && (
                <a href={resumeData.linkedIn} target="_blank" rel="noopener noreferrer" className="text-resume-primary hover:underline flex items-center gap-1">
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                </a>
              )}
              {resumeData.githubUrl && (
                <a href={resumeData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-resume-primary hover:underline flex items-center gap-1">
                  <Github size={14} />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-resume-secondary mb-3">Career Objective</h2>
          <p className="text-gray-700">{resumeData.summary}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-resume-secondary mb-3">Education</h2>
          <div className="ml-2">
            <p className="font-medium">{resumeData.course}</p>
            <p className="text-gray-700">{resumeData.school}</p>
          </div>
        </div>

        {/* Work Experience Section */}
        {resumeData.workExperience && resumeData.workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-resume-secondary mb-3">Work Experience</h2>
            <div className="space-y-4">
              {resumeData.workExperience.map((exp) => (
                <div key={exp.id} className="ml-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{exp.position}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-700">
                    <Briefcase size={12} />
                    <span>{exp.company}</span>
                    {exp.location && (
                      <>
                        <span className="mx-1">•</span>
                        <MapPin size={12} />
                        <span>{exp.location}</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-resume-secondary mb-3">Skills</h2>
          <ul className="list-disc ml-6">
            {resumeData.skills?.map((skill, index) => (
              <li key={index} className="text-gray-700 mb-1">{skill}</li>
            ))}
          </ul>
        </div>

        {/* Certifications Section */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-resume-secondary mb-3">Certifications</h2>
            <div className="space-y-3">
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="ml-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium flex items-center gap-1">
                      <Award size={14} />
                      {cert.name}
                    </p>
                    <p className="text-sm text-gray-600">{cert.date}</p>
                  </div>
                  <p className="text-gray-700">{cert.issuer}</p>
                  {cert.description && <p className="text-sm text-gray-600 mt-1">{cert.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-resume-secondary mb-3">Projects</h2>
            <div className="space-y-3">
              {resumeData.projects.map((project) => (
                <div key={project.id} className="ml-2">
                  <div className="flex items-center gap-2">
                    <FileCode size={14} />
                    <p className="font-medium">{project.name}</p>
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-resume-primary hover:underline flex items-center gap-1"
                      >
                        <Link2 size={12} />
                        <span className="text-xs">View</span>
                      </a>
                    )}
                  </div>
                  <p className="text-gray-700 mt-1">{project.description}</p>
                  {project.technologies && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Technologies:</span> {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-resume-secondary mb-3">Professional Interests</h2>
          <p className="text-gray-700">{resumeData.interests}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
