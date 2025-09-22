
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
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  
  return (
    <div className="bg-white p-8 text-left shadow-sm h-full max-w-3xl mx-auto font-serif leading-normal print:p-0 print:shadow-none print:max-w-none">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-normal text-gray-900 mb-3 tracking-wide">{fullName}</h1>
        <div className="text-gray-600 text-sm flex flex-wrap justify-center gap-4 mb-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.portfolio && (
            <a href={personalInfo.portfolio} className="text-gray-600 hover:text-gray-900 underline">
              {personalInfo.portfolio}
            </a>
          )}
        </div>
        <div className="w-16 h-px bg-gray-400 mx-auto mt-4"></div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-8 text-center">
          <p className="text-gray-700 text-base leading-relaxed italic max-w-2xl mx-auto">
            "{personalInfo.summary}"
          </p>
        </div>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 text-center uppercase tracking-widest">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="text-center mb-4">
                  <h3 className="text-base font-medium text-gray-900 mb-1">{exp.position}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {exp.company}
                    {exp.location && <span> • {exp.location}</span>}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {exp.startDate} — {exp.endDate}
                  </p>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed text-justify max-w-2xl mx-auto">
                  {exp.description.split('\n').map((line, idx) => (
                    <p key={idx} className="mb-2 last:mb-0">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 text-center uppercase tracking-widest">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="text-center border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <h3 className="text-base font-medium text-gray-900">{project.name}</h3>
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-500 text-xs hover:text-gray-700 underline"
                    >
                      View
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2 max-w-2xl mx-auto">{project.description}</p>
                {project.technologies && (
                  <p className="text-xs text-gray-500 font-mono">{project.technologies}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 text-center uppercase tracking-widest">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="text-center border-b border-gray-100 pb-4 last:border-b-0">
                <h3 className="text-base font-medium text-gray-900 mb-1">{edu.school}</h3>
                <p className="text-sm text-gray-700 mb-1">
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
                <p className="text-xs text-gray-500 font-mono mb-2">{edu.graduationDate}</p>
                {edu.gpa && (
                  <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
                )}
                {edu.description && (
                  <p className="text-sm text-gray-600 mt-2 italic max-w-2xl mx-auto">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 text-center uppercase tracking-widest">
            Certifications
          </h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-center border-b border-gray-100 pb-3 last:border-b-0">
                <h3 className="text-base font-medium text-gray-900 mb-1">{cert.name}</h3>
                <p className="text-sm text-gray-700">{cert.issuer}</p>
                <p className="text-xs text-gray-500 font-mono">{cert.date}</p>
                {cert.description && (
                  <p className="text-sm text-gray-600 mt-1 italic">{cert.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 text-center uppercase tracking-widest">
            Skills
          </h2>
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {skills.map((skill, index) => (
                <span key={index} className="text-sm text-gray-700 font-mono">
                  {skill}
                  {index < skills.length - 1 && <span className="text-gray-400 mx-2">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Links */}
      {(data.linkedIn || data.githubUrl) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-center gap-8">
            {data.linkedIn && (
              <a 
                href={data.linkedIn} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 text-sm hover:text-gray-900 underline"
              >
                LinkedIn
              </a>
            )}
            {data.githubUrl && (
              <a 
                href={data.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 text-sm hover:text-gray-900 underline"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
