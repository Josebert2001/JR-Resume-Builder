
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

export type ResponsibilityGenerationRequest = {
  position: string;
  company: string;
  industry?: string;
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

export const generateJobResponsibilities = async (data: ResponsibilityGenerationRequest): Promise<string> => {
  // Simulate API call delay
  await delay(1500);
  
  // Generate mock responsibilities based on job title
  const responsibilitiesMap: Record<string, string[]> = {
    "Software Engineer": [
      "• Developed and maintained web applications using React.js, Node.js, and TypeScript",
      "• Collaborated with cross-functional teams to define, design, and ship new features",
      "• Implemented responsive design and ensured cross-browser compatibility",
      "• Participated in code reviews and provided constructive feedback to other developers"
    ],
    "Project Manager": [
      "• Led project planning sessions and created detailed project schedules",
      "• Managed project resources, budget, and timeline to ensure on-time delivery",
      "• Conducted regular status meetings with stakeholders to communicate progress",
      "• Identified and mitigated project risks to ensure successful completion"
    ],
    "Marketing Specialist": [
      "• Created and executed marketing campaigns across multiple channels",
      "• Analyzed campaign performance and provided data-driven recommendations",
      "• Managed social media accounts and increased follower engagement by 40%",
      "• Collaborated with design team to develop marketing materials and brand assets"
    ],
    "Data Analyst": [
      "• Collected, processed, and analyzed large datasets using SQL and Python",
      "• Created visualizations and dashboards to communicate insights to stakeholders",
      "• Developed automated reporting solutions to streamline data analysis processes",
      "• Identified trends and patterns in data to support business decision-making"
    ],
    "Customer Support": [
      "• Resolved customer inquiries and issues through phone, email, and chat support",
      "• Maintained a high customer satisfaction rate of 95% consistently",
      "• Documented customer feedback and escalated recurring issues to appropriate teams",
      "• Trained new team members on support processes and best practices"
    ]
  };
  
  // Default responsibilities if the job title doesn't match any in our map
  const defaultResponsibilities = [
    "• Collaborated effectively with team members to achieve department goals",
    "• Implemented process improvements resulting in increased efficiency",
    "• Managed multiple priorities simultaneously in a fast-paced environment",
    "• Delivered high-quality work consistently while meeting all deadlines"
  ];
  
  // Find matching responsibilities or use default
  const matchedResponsibilities = Object.entries(responsibilitiesMap).find(
    ([key]) => data.position.toLowerCase().includes(key.toLowerCase())
  );
  
  // Join the responsibilities into a single string with line breaks
  return (matchedResponsibilities ? matchedResponsibilities[1] : defaultResponsibilities).join('\n');
};
