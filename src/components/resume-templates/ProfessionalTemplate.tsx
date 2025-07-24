
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TemplateData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    portfolio: string;
  };
  education: Array<{
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    graduationDate: string;
    description: string;
    gpa?: string;
  }>;
  experience: Array<{
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies?: string;
    url?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  linkedIn: string;
  githubUrl: string;
}

export const ProfessionalTemplate: React.FC<{ data: TemplateData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, certifications } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  
  return (
    <div className="bg-white p-8 text-left shadow-sm h-full max-w-4xl mx-auto font-sans leading-relaxed">
      {/* Header Section */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-900">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-wide">{fullName}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
              {personalInfo.location}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
              {personalInfo.portfolio}
            </span>
          )}
        </div>
      </div>
      
      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-1">{exp.position}</h3>
                  <p className="text-sm font-medium text-gray-700">
                    {exp.company}
                    {exp.location && <span className="text-gray-500"> • {exp.location}</span>}
                  </p>
                </div>
                <div className="text-sm text-gray-600 font-medium ml-4 text-right whitespace-nowrap">
                  {exp.startDate} - {exp.endDate}
                </div>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed ml-4 border-l-2 border-gray-200 pl-4">
                {exp.description.split('\n').map((line, idx) => (
                  <p key={idx} className="mb-2 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-300 pb-1">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900">{edu.school}</h3>
                  <p className="text-sm text-gray-700">
                    {edu.degree} in {edu.fieldOfStudy}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                  )}
                </div>
                <div className="text-sm text-gray-600 font-medium ml-4 text-right whitespace-nowrap">
                  {edu.graduationDate}
                </div>
              </div>
              {edu.description && (
                <div className="text-sm text-gray-700 leading-relaxed ml-4 border-l-2 border-gray-200 pl-4">
                  <p>{edu.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-300 pb-1">
            Projects
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-gray-900">{project.name}</h3>
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 text-sm hover:underline ml-4"
                    >
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2 leading-relaxed">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.split(',').map((tech, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-300 pb-1">
            Certifications
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-700">{cert.issuer}</p>
                  {cert.description && (
                    <p className="text-sm text-gray-600 mt-1">{cert.description}</p>
                  )}
                </div>
                <div className="text-sm text-gray-600 font-medium ml-4 text-right whitespace-nowrap">
                  {cert.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-300 pb-1">
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skills.map((skill, index) => (
              <div key={index} className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-md text-center">
                <span className="text-sm font-medium text-gray-800">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Links */}
      {(data.linkedIn || data.githubUrl) && (
        <div className="mt-8 pt-4 border-t border-gray-300">
          <div className="flex justify-center gap-6">
            {data.linkedIn && (
              <a 
                href={data.linkedIn} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 text-sm hover:underline font-medium"
              >
                LinkedIn Profile
              </a>
            )}
            {data.githubUrl && (
              <a 
                href={data.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 text-sm hover:underline font-medium"
              >
                GitHub Profile
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
