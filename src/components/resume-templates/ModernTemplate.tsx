
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
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`;
  
  return (
    <div className="bg-white p-6 md:p-8 text-left shadow-sm h-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{fullName}</h1>
          <p className="text-lg text-gray-600 mt-2">
            {experience && experience.length > 0 ? experience[0].position : 'Professional'}
          </p>
        </div>
        <div className="text-left md:text-right text-gray-600 text-sm space-y-1">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.portfolio && (
            <p>
              <a href={personalInfo.portfolio} className="text-blue-600 hover:underline">{personalInfo.portfolio}</a>
            </p>
          )}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-8">
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2">
          {experience && experience.length > 0 && (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Experience</h2>
              {experience.map((exp, index) => (
                <div key={index} className="mb-6">
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
            </>
          )}

          {projects && projects.length > 0 && (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-4">Projects</h2>
              {projects.map((project) => (
                <div key={project.id} className="mb-4">
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
            </>
          )}

          {education && education.length > 0 && (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-4">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <h3 className="font-bold text-gray-800">{edu.school}</h3>
                  <p className="text-gray-600 text-sm">{`${edu.degree} in ${edu.fieldOfStudy}`}</p>
                  <p className="text-gray-600 text-sm">Graduated {edu.graduationDate}</p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-gray-700 text-sm mt-1">{edu.description}</p>}
                </div>
              ))}
            </>
          )}
        </div>

        <div>
          {skills && skills.length > 0 && (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Skills</h2>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700 text-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </>
          )}

          {certifications && certifications.length > 0 && (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-4">Certifications</h2>
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-4">
                  <h3 className="font-bold text-gray-800">{cert.name}</h3>
                  <p className="text-gray-600 text-sm">{cert.issuer} • {cert.date}</p>
                  {cert.description && <p className="text-gray-700 text-sm mt-1">{cert.description}</p>}
                </div>
              ))}
            </>
          )}

          {(data.linkedIn || data.githubUrl) && (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-4">Links</h2>
              <div className="space-y-2">
                {data.linkedIn && (
                  <a href={data.linkedIn} target="_blank" rel="noopener noreferrer" className="block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-100">
                    LinkedIn
                  </a>
                )}
                {data.githubUrl && (
                  <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" className="block bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
                    GitHub
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
