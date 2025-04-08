
// This is a mock service that simulates AI API calls
// In a real app, this would make actual API calls to your backend

export type GenerationRequest = {
  name: string;
  email: string;
  phone: string;
  course: string;
  school: string;
  interests: string;
};

export type GenerationResponse = {
  summary: string;
  skills: string[];
};

// Mock function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateResumeContent = async (data: GenerationRequest): Promise<GenerationResponse> => {
  // Simulate API call delay
  await delay(2000);
  
  // Mock AI-generated content
  const summaries = [
    `A motivated and dedicated ${data.course} graduate from ${data.school} with a passion for ${data.interests}. Seeking to leverage my academic knowledge and enthusiasm to contribute to a progressive organization where I can utilize my skills and gain valuable industry experience while driving organizational success.`,
    `Result-oriented ${data.course} professional with a strong educational foundation from ${data.school}. Passionate about ${data.interests} and committed to applying theoretical knowledge in practical settings. Looking to secure a challenging position in a reputable organization to expand my learning, knowledge, and skills.`,
    `A dynamic and diligent ${data.course} graduate from ${data.school} with interest in ${data.interests}. Eager to contribute my academic qualifications and enthusiasm to a forward-thinking organization that offers opportunities for professional growth and skill enhancement.`
  ];
  
  const skillSets = {
    "Computer Science": ["Programming (Java, Python, JavaScript)", "Database Management", "Software Development", "Data Structures & Algorithms", "Web Development"],
    "Engineering": ["Technical Drawing", "CAD Software", "Project Management", "Problem Solving", "Quality Assurance"],
    "Business Administration": ["Financial Analysis", "Marketing Strategy", "Human Resource Management", "Business Communication", "Strategic Planning"],
    "Medicine": ["Patient Care", "Medical Documentation", "Clinical Assessment", "Healthcare Management", "Medical Ethics"],
    "Arts": ["Creative Writing", "Design Principles", "Critical Analysis", "Research Methodology", "Digital Media"],
    "Default": ["Communication Skills", "Team Collaboration", "Critical Thinking", "Problem Solving", "Microsoft Office Suite"]
  };
  
  // Select random summary
  const summary = summaries[Math.floor(Math.random() * summaries.length)];
  
  // Select skills based on course or default
  const skills = skillSets[data.course as keyof typeof skillSets] || skillSets.Default;
  
  return {
    summary,
    skills
  };
};
