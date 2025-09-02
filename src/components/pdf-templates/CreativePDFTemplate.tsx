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
    backgroundColor: '#f59e0b',
    marginHorizontal: -35,
    marginTop: -35,
    paddingVertical: 30,
    paddingHorizontal: 35,
    marginBottom: 25,
    position: 'relative',
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 150,
    height: '100%',
    backgroundColor: '#d97706',
    transform: 'skewX(-15deg)',
    transformOrigin: 'top right',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    zIndex: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 11,
    color: '#fef3c7',
    gap: 15,
    zIndex: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 10,
    position: 'relative',
  },
  sectionAccent: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#fbbf24',
    borderRadius: 2,
  },
  experienceItem: {
    marginBottom: 16,
    paddingLeft: 15,
    borderLeft: '3 solid #fbbf24',
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
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '5 10',
    borderRadius: 15,
    fontSize: 9,
    fontWeight: 'bold',
    border: '1 solid #f59e0b',
  },
  educationItem: {
    marginBottom: 12,
    paddingLeft: 10,
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
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    borderLeft: '4 solid #f59e0b',
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 3,
  },
  links: {
    marginTop: 25,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 20,
    fontSize: 10,
    color: '#f59e0b',
  },
  highlight: {
    backgroundColor: '#fef3c7',
    padding: 2,
    borderRadius: 2,
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

export const CreativePDFTemplate: React.FC<{ data: TemplateData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
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
          <Text style={styles.sectionTitle}>
            Creative Profile
            <View style={styles.sectionAccent} />
          </Text>
          <Text style={styles.description}>{data.personalInfo.summary}</Text>
        </View>
      )}

      {/* Professional Experience */}
      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Experience Journey
            <View style={styles.sectionAccent} />
          </Text>
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
          <Text style={styles.sectionTitle}>
            Creative Projects
            <View style={styles.sectionAccent} />
          </Text>
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
          <Text style={styles.sectionTitle}>
            Learning Path
            <View style={styles.sectionAccent} />
          </Text>
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
          <Text style={styles.sectionTitle}>
            Creative Toolkit
            <View style={styles.sectionAccent} />
          </Text>
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
          <Text style={styles.sectionTitle}>
            Achievements
            <View style={styles.sectionAccent} />
          </Text>
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