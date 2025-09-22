
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

export const CreativeTemplate: React.FC<{ data: TemplateData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, certifications } = data;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  
  return (
    <div className="bg-white p-8 text-left shadow-sm h-full max-w-5xl mx-auto font-sans print:p-0 print:shadow-none print:max-w-none">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
        {/* Left Sidebar */}
        <div className="lg:col-span-2 bg-gray-900 text-white p-8 rounded-lg">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-3 leading-tight">{fullName}</h1>
            <div className="w-12 h-1 bg-blue-500 mb-4"></div>
            <div className="space-y-2 text-slate-300 text-sm">
              {personalInfo.email && (
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.portfolio && (
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                  <a href={personalInfo.portfolio} className="text-blue-300 hover:text-blue-200 break-all">
                    {personalInfo.portfolio}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-slate-200">Technical Skills</h2>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="relative">
                    <div className="bg-gray-800 rounded-lg p-3 transition-colors">
                      <span className="text-sm font-medium text-white">{skill}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-slate-200">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-blue-400 pl-4 py-2">
                    <h3 className="font-semibold text-white text-sm">{edu.school}</h3>
                    <p className="text-slate-300 text-sm">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-slate-400 text-xs mt-1">{edu.graduationDate}</p>
                    {edu.gpa && (
                      <p className="text-slate-400 text-xs">GPA: {edu.gpa}</p>
                    )}
                    {edu.description && (
                      <p className="text-slate-300 text-xs mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {certifications && certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-slate-200">Certifications</h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border-l-4 border-green-400 pl-4 py-2">
                    <h3 className="font-semibold text-white text-sm">{cert.name}</h3>
                    <p className="text-slate-300 text-sm">{cert.issuer}</p>
                    <p className="text-slate-400 text-xs">{cert.date}</p>
                    {cert.description && (
                      <p className="text-slate-300 text-xs mt-1">{cert.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(data.linkedIn || data.githubUrl) && (
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4 text-slate-200">Connect</h2>
              <div className="space-y-3">
                {data.linkedIn && (
                  <a 
                    href={data.linkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    <div className="w-4 h-4 bg-blue-300 rounded-full mr-3"></div>
                    LinkedIn Profile
                  </a>
                )}
                {data.githubUrl && (
                  <a 
                    href={data.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    <div className="w-4 h-4 bg-gray-300 rounded-full mr-3"></div>
                    GitHub Profile
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-1 bg-blue-500 mr-3"></div>
                Professional Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="relative bg-white rounded-lg p-6 border border-gray-100 transition-shadow">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-lg"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                        <p className="text-blue-600 font-semibold">
                          {exp.company}
                          {exp.location && <span className="text-gray-500 font-normal"> • {exp.location}</span>}
                        </p>
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap">
                        {exp.startDate} - {exp.endDate}
                      </div>
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      {exp.description.split('\n').map((line, idx) => (
                        <p key={idx} className="mb-3 last:mb-0">{line}</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-1 bg-green-500 mr-3"></div>
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                      {project.url && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 text-sm hover:text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-full"
                        >
                          View →
                        </a>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.split(',').map((tech, idx) => (
                          <span key={idx} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
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
      </div>
    </div>
  );
};
