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
  <div className="bg-white p-8 text-left">
    <div className="border-b-2 border-gray-800 pb-4 mb-6">
      <h1 className="text-3xl font-bold text-gray-900">{`${data.personalInfo.firstName} ${data.personalInfo.lastName}`}</h1>
      <div className="flex flex-wrap gap-3 mt-2 text-gray-600">
        <span>{data.personalInfo.email}</span>
        <span>•</span>
        <span>{data.personalInfo.phone}</span>
        <span>•</span>
        <span>{data.personalInfo.location}</span>
      </div>
    </div>
    
    <div className="mb-6">
      <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
    </div>

    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Experience</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-800">{exp.position}</h3>
              <p className="text-gray-600">{exp.company}</p>
            </div>
            <p className="text-gray-600 text-sm">{`${exp.startDate} - ${exp.endDate}`}</p>
          </div>
          <p className="text-gray-700 mt-2">{exp.description}</p>
        </div>
      ))}
    </div>

    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Education</h2>
      {data.education.map((edu, index) => (
        <div key={index}>
          <h3 className="font-bold text-gray-800">{edu.school}</h3>
          <p className="text-gray-600">{`${edu.degree} in ${edu.fieldOfStudy}`}</p>
          <p className="text-gray-600">Graduated {edu.graduationDate}</p>
        </div>
      ))}
    </div>

    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-3">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill, index) => (
          <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ModernPreview = ({ data }: { data: PreviewData }) => (
  <div className="bg-white p-8 text-left">
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">{`${data.personalInfo.firstName} ${data.personalInfo.lastName}`}</h1>
        <p className="text-lg text-gray-600 mt-2">Senior Software Engineer</p>
      </div>
      <div className="text-right text-gray-600">
        <p>{data.personalInfo.email}</p>
        <p>{data.personalInfo.phone}</p>
        <p>{data.personalInfo.location}</p>
      </div>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
    </div>

    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <p className="text-gray-600">{`${exp.startDate} - ${exp.endDate}`}</p>
            </div>
            <p className="text-gray-700 mt-2">{exp.description}</p>
          </div>
        ))}

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-bold text-gray-800">{edu.school}</h3>
            <p className="text-gray-600">{`${edu.degree} in ${edu.fieldOfStudy}`}</p>
            <p className="text-gray-600">Graduated {edu.graduationDate}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
        <div className="space-y-2">
          {data.skills.map((skill, index) => (
            <div key={index} className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MinimalPreview = ({ data }: { data: PreviewData }) => (
  <div className="bg-white p-8 text-left max-w-3xl mx-auto">
    <h1 className="text-3xl font-light text-gray-900 mb-2">{`${data.personalInfo.firstName} ${data.personalInfo.lastName}`}</h1>
    <div className="text-gray-600 text-sm mb-6">
      <span>{data.personalInfo.email}</span> • 
      <span>{data.personalInfo.phone}</span> • 
      <span>{data.personalInfo.location}</span>
    </div>

    <div className="mb-8">
      <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
    </div>

    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Experience</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-6">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-medium text-gray-800">{exp.position}</h3>
            <span className="text-gray-600 text-sm">{`${exp.startDate} - ${exp.endDate}`}</span>
          </div>
          <p className="text-gray-600 text-sm mb-2">{exp.company}</p>
          <p className="text-gray-700 text-sm">{exp.description}</p>
        </div>
      ))}
    </div>

    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Education</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-medium text-gray-800">{edu.school}</h3>
          <p className="text-gray-600 text-sm">{`${edu.degree} in ${edu.fieldOfStudy}, ${edu.graduationDate}`}</p>
        </div>
      ))}
    </div>

    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider">Skills</h2>
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
  <div className="bg-white p-8 text-left">
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-1 bg-gray-900 text-white p-6 rounded-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{`${data.personalInfo.firstName} ${data.personalInfo.lastName}`}</h1>
          <div className="space-y-1 text-gray-300 text-sm">
            <p>{data.personalInfo.email}</p>
            <p>{data.personalInfo.phone}</p>
            <p>{data.personalInfo.location}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-300">Skills</h2>
          <div className="space-y-2">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-gray-800 px-3 py-1 rounded text-sm">
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-300">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium">{edu.school}</h3>
              <p className="text-sm text-gray-300">{`${edu.degree} in ${edu.fieldOfStudy}`}</p>
              <p className="text-sm text-gray-300">{edu.graduationDate}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2">
        <div className="mb-8">
          <p className="text-xl text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <p className="text-gray-600">{`${exp.startDate} - ${exp.endDate}`}</p>
              </div>
              <p className="text-gray-700">{exp.description}</p>
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