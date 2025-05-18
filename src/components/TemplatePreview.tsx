import React from 'react';
import { TemplateType } from '@/context/ResumeContext';

interface PreviewData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  education: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    graduationDate: string;
  }[];
  experience: {
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];
}

const sampleData: PreviewData = {
  personalInfo: {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    location: "Lagos, Nigeria",
    summary: "Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about creating efficient, scalable solutions and mentoring junior developers."
  },
  education: [
    {
      school: "University of Lagos",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      graduationDate: "2020"
    }
  ],
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Solutions Ltd",
      location: "Lagos, Nigeria",
      startDate: "2020",
      endDate: "Present",
      description: "Led development of enterprise web applications using React and Node.js. Improved system performance by 40% through optimization."
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"]
};

interface TemplatePreviewProps {
  template: TemplateType;
}

const ProfessionalPreview = ({ data }: { data: PreviewData }) => (
  <div className="bg-white p-6 md:p-8 text-left shadow-sm">
    <div className="border-b-2 border-gray-800 pb-4 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{`${data.personalInfo.firstName} ${data.personalInfo.lastName}`}</h1>
      <div className="flex flex-wrap gap-2 md:gap-3 text-sm md:text-base text-gray-600">
        <span>{data.personalInfo.email}</span>
        <span className="hidden md:inline">•</span>
        <span>{data.personalInfo.phone}</span>
        <span className="hidden md:inline">•</span>
        <span>{data.personalInfo.location}</span>
      </div>
    </div>
    
    <div className="mb-6">
      <p className="text-gray-700 text-sm md:text-base leading-relaxed">{data.personalInfo.summary}</p>
    </div>

    <div className="mb-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 border-b pb-1">Experience</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
            <div>
              <h3 className="font-bold text-gray-800">{exp.position}</h3>
              <p className="text-gray-600 text-sm">{exp.company}</p>
            </div>
            <p className="text-gray-600 text-sm">{`${exp.startDate} - ${exp.endDate}`}</p>
          </div>
          <p className="text-gray-700 text-sm mt-2">{exp.description}</p>
        </div>
      ))}
    </div>

    <div className="mb-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 border-b pb-1">Education</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-3">
          <h3 className="font-bold text-gray-800">{edu.school}</h3>
          <p className="text-gray-600 text-sm">{`${edu.degree} in ${edu.fieldOfStudy}`}</p>
          <p className="text-gray-600 text-sm">Graduated {edu.graduationDate}</p>
        </div>
      ))}
    </div>

    <div>
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 border-b pb-1">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill, index) => (
          <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ModernPreview = ({ data }: { data: PreviewData }) => (
  <div className="bg-white p-6 md:p-8 text-left shadow-sm">
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{`${data.personalInfo.firstName} ${data.personalInfo.lastName}`}</h1>
        <p className="text-lg text-gray-600 mt-2">Senior Software Engineer</p>
      </div>
      <div className="text-left md:text-right text-gray-600 text-sm space-y-1">
        <p>{data.personalInfo.email}</p>
        <p>{data.personalInfo.phone}</p>
        <p>{data.personalInfo.location}</p>
      </div>
    </div>

    <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-8">
      <p className="text-gray-700 text-sm md:text-base leading-relaxed">{data.personalInfo.summary}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      <div className="md:col-span-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
              <div>
                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                <p className="text-gray-600 text-sm">{exp.company}</p>
              </div>
              <p className="text-gray-600 text-sm">{`${exp.startDate} - ${exp.endDate}`}</p>
            </div>
            <p className="text-gray-700 text-sm mt-2">{exp.description}</p>
          </div>
        ))}

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-4">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-bold text-gray-800">{edu.school}</h3>
            <p className="text-gray-600 text-sm">{`${edu.degree} in ${edu.fieldOfStudy}`}</p>
            <p className="text-gray-600 text-sm">Graduated {edu.graduationDate}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Skills</h2>
        <div className="space-y-2">
          {data.skills.map((skill, index) => (
            <div key={index} className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700 text-sm">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MinimalPreview = ({ data }: { data: PreviewData }) => (
  <div className="bg-white p-6 md:p-8 text-left shadow-sm max-w-3xl mx-auto">
    <h1 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">{`${data.personalInfo.firstName} ${data.personalInfo.lastName}`}</h1>
    <div className="text-gray-600 text-sm flex flex-wrap gap-2 mb-6">
      <span>{data.personalInfo.email}</span>
      <span className="hidden md:inline">•</span>
      <span>{data.personalInfo.phone}</span>
      <span className="hidden md:inline">•</span>
      <span>{data.personalInfo.location}</span>
    </div>

    <div className="mb-8">
      <p className="text-gray-700 text-sm md:text-base leading-relaxed">{data.personalInfo.summary}</p>
    </div>

    <div className="mb-8">
      <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Experience</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 mb-1">
            <h3 className="font-medium text-gray-800">{exp.position}</h3>
            <span className="text-gray-600 text-sm">{`${exp.startDate} - ${exp.endDate}`}</span>
          </div>
          <p className="text-gray-600 text-sm mb-2">{exp.company}</p>
          <p className="text-gray-700 text-sm">{exp.description}</p>
        </div>
      ))}
    </div>

    <div className="mb-8">
      <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Education</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-medium text-gray-800">{edu.school}</h3>
          <p className="text-gray-600 text-sm">{`${edu.degree} in ${edu.fieldOfStudy}, ${edu.graduationDate}`}</p>
        </div>
      ))}
    </div>

    <div>
      <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill, index) => (
          <span key={index} className="text-gray-700 text-sm">
            {skill}{index < data.skills.length - 1 ? " •" : ""}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const CreativePreview = ({ data }: { data: PreviewData }) => (
  <div className="bg-white p-6 md:p-8 text-left shadow-sm">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      <div className="md:col-span-1 bg-gray-900 text-white p-4 md:p-6 rounded-lg">
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-2">{`${data.personalInfo.firstName} ${data.personalInfo.lastName}`}</h1>
          <div className="space-y-1 text-gray-300 text-sm">
            <p>{data.personalInfo.email}</p>
            <p>{data.personalInfo.phone}</p>
            <p>{data.personalInfo.location}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-base md:text-lg font-semibold mb-3 text-gray-300">Skills</h2>
          <div className="space-y-2">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-gray-800 px-3 py-1 rounded text-sm">
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base md:text-lg font-semibold mb-3 text-gray-300">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium">{edu.school}</h3>
              <p className="text-sm text-gray-300">{`${edu.degree} in ${edu.fieldOfStudy}`}</p>
              <p className="text-sm text-gray-300">{edu.graduationDate}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="mb-8">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-2">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">{exp.position}</h3>
                  <p className="text-gray-600 text-sm">{exp.company}</p>
                </div>
                <p className="text-gray-600 text-sm">{`${exp.startDate} - ${exp.endDate}`}</p>
              </div>
              <p className="text-gray-700 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  switch (template) {
    case 'professional':
      return <ProfessionalPreview data={sampleData} />;
    case 'modern':
      return <ModernPreview data={sampleData} />;
    case 'minimal':
      return <MinimalPreview data={sampleData} />;
    case 'creative':
      return <CreativePreview data={sampleData} />;
    default:
      return <ProfessionalPreview data={sampleData} />;
  }
};