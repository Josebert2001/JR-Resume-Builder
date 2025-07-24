
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

export const ModernTemplate: React.FC<{ data: TemplateData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, certifications } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  
  return (
    <div className="bg-white p-8 text-left shadow-sm h-full max-w-4xl mx-auto font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8 pb-6 border-b border-gray-200">
        <div className="flex-1">
          <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-wide">{fullName}</h1>
          <p className="text-xl text-blue-600 font-medium">
            {experience && experience.length > 0 ? experience[0].position : 'Professional'}
          </p>
        </div>
        <div className="text-right text-gray-600 text-sm space-y-1 min-w-0">
          {personalInfo.email && (
            <div className="flex items-center justify-end">
              <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center justify-end">
              <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center justify-end">
              <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center justify-end">
              <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
              <a href={personalInfo.portfolio} className="text-blue-600 hover:underline break-all">
                {personalInfo.portfolio}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Professional Summary</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
                Professional Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-gray-200 last:border-l-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-blue-600 font-medium">
                          {exp.company}
                          {exp.location && <span className="text-gray-500 font-normal"> • {exp.location}</span>}
                        </p>
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 font-medium whitespace-nowrap">
                        {exp.startDate} - {exp.endDate}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
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
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      {project.url && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 text-sm hover:underline font-medium"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.split(',').map((tech, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
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
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                Technical Skills
              </h2>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-blue-200 pl-4">
                    <h3 className="font-semibold text-gray-900 text-sm">{edu.school}</h3>
                    <p className="text-sm text-gray-700">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-xs text-gray-600 mt-1">{edu.graduationDate}</p>
                    {edu.gpa && (
                      <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                    )}
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border-l-4 border-green-200 pl-4">
                    <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                    <p className="text-sm text-gray-700">{cert.issuer}</p>
                    <p className="text-xs text-gray-600">{cert.date}</p>
                    {cert.description && (
                      <p className="text-xs text-gray-600 mt-1">{cert.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links Section */}
          {(data.linkedIn || data.githubUrl) && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                Connect
              </h2>
              <div className="space-y-3">
                {data.linkedIn && (
                  <a 
                    href={data.linkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    LinkedIn Profile
                  </a>
                )}
                {data.githubUrl && (
                  <a 
                    href={data.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium"
                  >
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                    GitHub Profile
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
