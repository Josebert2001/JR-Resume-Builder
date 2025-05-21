
import React from 'react';

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

export const MinimalTemplate: React.FC<{ data: TemplateData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, certifications } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`;
  
  return (
    <div className="bg-white p-6 md:p-8 text-left shadow-sm h-full max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">{fullName}</h1>
      <div className="text-gray-600 text-sm flex flex-wrap gap-2 mb-6">
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
            <a href={personalInfo.portfolio} className="text-gray-600 hover:text-gray-900">{personalInfo.portfolio}</a>
          </>
        )}
      </div>

      {personalInfo.summary && (
        <div className="mb-8">
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 mb-1">
                <h3 className="font-medium text-gray-800">{exp.position}</h3>
                <span className="text-gray-600 text-sm">{`${exp.startDate} - ${exp.endDate}`}</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
              <p className="text-gray-700 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Projects</h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium text-gray-800">{project.name}</h3>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xs hover:text-gray-900">
                    View
                  </a>
                )}
              </div>
              <p className="text-gray-700 text-sm">{project.description}</p>
              {project.technologies && (
                <p className="text-gray-500 text-xs mt-1">{project.technologies}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <h3 className="font-medium text-gray-800">{edu.school}</h3>
              <p className="text-gray-600 text-sm">{`${edu.degree} in ${edu.fieldOfStudy}, ${edu.graduationDate}`}</p>
              {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
              {edu.description && <p className="text-gray-700 text-sm mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-3">
              <h3 className="font-medium text-gray-800">{cert.name}</h3>
              <p className="text-gray-600 text-sm">{cert.issuer} • {cert.date}</p>
              {cert.description && <p className="text-gray-700 text-sm mt-1">{cert.description}</p>}
            </div>
          ))}
        </div>
      )}

      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="text-gray-700 text-sm">
                {skill}{index < skills.length - 1 ? " •" : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
