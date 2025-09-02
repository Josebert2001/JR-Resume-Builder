import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 11,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#6366f1',
    marginHorizontal: -35,
    marginTop: -35,
    paddingVertical: 25,
    paddingHorizontal: 35,
    marginBottom: 25,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 11,
    color: '#e0e7ff',
    gap: 15,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 10,
    paddingBottom: 3,
    borderBottom: '2 solid #e0e7ff',
  },
  experienceItem: {
    marginBottom: 14,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillItem: {
    backgroundColor: '#e0e7ff',
    color: '#6366f1',
    padding: '5 10',
    borderRadius: 12,
    fontSize: 9,
    fontWeight: 'bold',
  },
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  school: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 3,
  },
  projectItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 3,
  },
  links: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '1 solid #e5e7eb',
    flexDirection: 'row',
    gap: 20,
    fontSize: 10,
    color: '#6366f1',
  },
});

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
    degree: string;
    school: string;
    graduationDate?: string;
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
    name: string;
    description: string;
    technologies?: string[];
    link?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date?: string;
  }>;
  linkedIn: string;
  githubUrl: string;
}

export const ModernPDFTemplate: React.FC<{ data: TemplateData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </Text>
        <View style={styles.contactInfo}>
          <Text>{data.personalInfo.email}</Text>
          <Text>{data.personalInfo.phone}</Text>
          <Text>{data.personalInfo.location}</Text>
        </View>
      </View>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.description}>{data.personalInfo.summary}</Text>
        </View>
      )}

      {/* Professional Experience */}
      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{exp.position}</Text>
              <View style={styles.companyInfo}>
                <Text>{exp.company} • {exp.location}</Text>
                <Text>{exp.startDate} - {exp.endDate}</Text>
              </View>
              <Text style={styles.description}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Projects</Text>
          {data.projects.map((project, index) => (
            <View key={index} style={styles.projectItem}>
              <Text style={styles.projectTitle}>{project.name}</Text>
              <Text style={styles.description}>{project.description}</Text>
              {project.technologies && (
                <View style={styles.skillsContainer}>
                  {project.technologies.map((tech, techIndex) => (
                    <Text key={techIndex} style={styles.skillItem}>{tech}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.educationItem}>
              <Text style={styles.degree}>{edu.degree}</Text>
              <Text style={styles.school}>{edu.school}</Text>
              {edu.graduationDate && (
                <Text style={styles.school}>Graduated: {edu.graduationDate}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {data.skills.map((skill, index) => (
              <Text key={index} style={styles.skillItem}>{skill}</Text>
            ))}
          </View>
        </View>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {data.certifications.map((cert, index) => (
            <View key={index} style={styles.educationItem}>
              <Text style={styles.degree}>{cert.name}</Text>
              <Text style={styles.school}>{cert.issuer}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Links */}
      {(data.linkedIn || data.githubUrl) && (
        <View style={styles.links}>
          {data.linkedIn && <Text>LinkedIn: {data.linkedIn}</Text>}
          {data.githubUrl && <Text>GitHub: {data.githubUrl}</Text>}
        </View>
      )}
    </Page>
  </Document>
);