
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
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`;
  
  return (
    <div className="bg-white p-6 md:p-8 text-left shadow-sm h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 h-full">
        <div className="md:col-span-1 bg-gray-900 text-white p-4 md:p-6 rounded-lg">
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-bold mb-2">{fullName}</h1>
            <div className="space-y-1 text-gray-300 text-sm">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
              {personalInfo.portfolio && (
                <p>
                  <a href={personalInfo.portfolio} className="text-blue-300 hover:text-blue-200">{personalInfo.portfolio}</a>
                </p>
              )}
            </div>
          </div>

          {skills && skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base md:text-lg font-semibold mb-3 text-gray-300">Skills</h2>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-gray-800 px-3 py-1 rounded text-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base md:text-lg font-semibold mb-3 text-gray-300">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <h3 className="font-medium">{edu.school}</h3>
                  <p className="text-sm text-gray-300">{`${edu.degree} in ${edu.fieldOfStudy}`}</p>
                  <p className="text-sm text-gray-300">{edu.graduationDate}</p>
                  {edu.gpa && <p className="text-sm text-gray-300">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base md:text-lg font-semibold mb-3 text-gray-300">Certifications</h2>
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-3">
                  <h3 className="font-medium">{cert.name}</h3>
                  <p className="text-sm text-gray-300">{cert.issuer}</p>
                  <p className="text-sm text-gray-300">{cert.date}</p>
                </div>
              ))}
            </div>
          )}

          {(data.linkedIn || data.githubUrl) && (
            <div>
              <h2 className="text-base md:text-lg font-semibold mb-3 text-gray-300">Connect</h2>
              <div className="space-y-2">
                {data.linkedIn && (
                  <a href={data.linkedIn} target="_blank" rel="noopener noreferrer" className="block bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 rounded text-sm">
                    LinkedIn
                  </a>
                )}
                {data.githubUrl && (
                  <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" className="block bg-purple-900 hover:bg-purple-800 text-white px-3 py-2 rounded text-sm">
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          {personalInfo.summary && (
            <div className="mb-8">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {experience && experience.length > 0 && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Experience</h2>
              {experience.map((exp, index) => (
                <div key={index} className="mb-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">{exp.position}</h3>
                      <p className="text-gray-600 text-sm">{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                    </div>
                    <p className="text-gray-600 text-sm">{`${exp.startDate} - ${exp.endDate}`}</p>
                  </div>
                  <p className="text-gray-700 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {projects && projects.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800">{project.name}</h3>
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">
                          View
                        </a>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mt-2">{project.description}</p>
                    {project.technologies && (
                      <p className="text-gray-500 text-xs mt-3">{project.technologies}</p>
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
