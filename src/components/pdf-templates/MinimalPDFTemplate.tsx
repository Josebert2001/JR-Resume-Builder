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
    paddingTop: 40,
    paddingBottom: 65,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  header: {
    marginBottom: 25,
    textAlign: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
    letterSpacing: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 10,
    color: '#718096',
    gap: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  divider: {
    borderBottom: '0.5 solid #e2e8f0',
    marginBottom: 12,
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 2,
  },
  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#718096',
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    color: '#4a5568',
    lineHeight: 1.5,
  },
  skillsList: {
    fontSize: 10,
    color: '#4a5568',
    lineHeight: 1.4,
  },
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  school: {
    fontSize: 10,
    color: '#718096',
    marginBottom: 2,
  },
  projectItem: {
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 2,
  },
  links: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '0.5 solid #e2e8f0',
    textAlign: 'center',
    fontSize: 9,
    color: '#718096',
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

export const MinimalPDFTemplate: React.FC<{ data: TemplateData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </Text>
        <View style={styles.contactInfo}>
          <Text>{data.personalInfo.email}</Text>
          <Text>•</Text>
          <Text>{data.personalInfo.phone}</Text>
          <Text>•</Text>
          <Text>{data.personalInfo.location}</Text>
        </View>
      </View>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>{data.personalInfo.summary}</Text>
        </View>
      )}

      {/* Professional Experience */}
      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <View style={styles.divider} />
          {data.experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{exp.position}</Text>
              <View style={styles.companyInfo}>
                <Text>{exp.company}, {exp.location}</Text>
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
          <Text style={styles.sectionTitle}>Projects</Text>
          <View style={styles.divider} />
          {data.projects.map((project, index) => (
            <View key={index} style={styles.projectItem}>
              <Text style={styles.projectTitle}>{project.name}</Text>
              <Text style={styles.description}>{project.description}</Text>
              {project.technologies && (
                <Text style={styles.skillsList}>
                  Technologies: {project.technologies.join(', ')}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.divider} />
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
          <View style={styles.divider} />
          <Text style={styles.skillsList}>{data.skills.join(' • ')}</Text>
        </View>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.divider} />
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
          <Text>
            {data.linkedIn && `LinkedIn: ${data.linkedIn}`}
            {data.linkedIn && data.githubUrl && ' | '}
            {data.githubUrl && `GitHub: ${data.githubUrl}`}
          </Text>
        </View>
      )}
    </Page>
  </Document>
);