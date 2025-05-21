
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
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`;
  
  return (
    <div className="bg-white p-6 md:p-8 text-left shadow-sm h-full">
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{fullName}</h1>
        <div className="flex flex-wrap gap-2 md:gap-3 text-sm md:text-base text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span className="hidden md:inline">•</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span className="hidden md:inline">•</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span className="hidden md:inline">•</span>
              <span>{personalInfo.portfolio}</span>
            </>
          )}
        </div>
      </div>
      
      {personalInfo.summary && (
        <div className="mb-6">
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 border-b pb-1">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                <div>
                  <h3 className="font-bold text-gray-800">{exp.position}</h3>
                  <p className="text-gray-600 text-sm">{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                </div>
                <p className="text-gray-600 text-sm">{`${exp.startDate} - ${exp.endDate}`}</p>
              </div>
              <p className="text-gray-700 text-sm mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 border-b pb-1">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h3 className="font-bold text-gray-800">{edu.school}</h3>
              <p className="text-gray-600 text-sm">{`${edu.degree} in ${edu.fieldOfStudy}`}</p>
              <p className="text-gray-600 text-sm">Graduated {edu.graduationDate}</p>
              {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
              {edu.description && <p className="text-gray-700 text-sm mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 border-b pb-1">Projects</h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800">{project.name}</h3>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">
                    View Project
                  </a>
                )}
              </div>
              <p className="text-gray-700 text-sm">{project.description}</p>
              {project.technologies && (
                <p className="text-gray-600 text-sm mt-1">
                  <span className="font-medium">Technologies:</span> {project.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 border-b pb-1">Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-3">
              <h3 className="font-bold text-gray-800">{cert.name}</h3>
              <p className="text-gray-600 text-sm">{cert.issuer} • {cert.date}</p>
              {cert.description && <p className="text-gray-700 text-sm mt-1">{cert.description}</p>}
            </div>
          ))}
        </div>
      )}

      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 border-b pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
