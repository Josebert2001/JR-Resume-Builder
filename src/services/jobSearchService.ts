
// This is a mock service that simulates job search API calls
// In a real app, this would make actual API calls to job search services

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
};

// Mock function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock job listings based on different categories
const mockJobListings: Record<string, JobListing[]> = {
  "Computer Science": [
    {
      id: "cs-001",
      title: "Software Developer",
      company: "TechHub Nigeria",
      location: "Lagos, Nigeria",
      description: "We're looking for a skilled software developer to join our team. Experience with modern JavaScript frameworks required.",
      url: "#software-developer"
    },
    {
      id: "cs-002",
      title: "Frontend Engineer",
      company: "Fintech Solutions",
      location: "Abuja, Nigeria",
      description: "Join our growing team to build responsive web applications with React, TypeScript, and modern frontend tools.",
      url: "#frontend-engineer"
    },
    {
      id: "cs-003",
      title: "Full Stack Developer",
      company: "Global Systems Ltd",
      location: "Port Harcourt, Nigeria",
      description: "Develop and maintain web applications using Node.js, React, and MongoDB in an agile environment.",
      url: "#fullstack-developer"
    }
  ],
  
  "Engineering": [
    {
      id: "eng-001",
      title: "Mechanical Engineer",
      company: "Nigerian Engineering Corp",
      location: "Lagos, Nigeria",
      description: "Design and develop mechanical components and systems using CAD software.",
      url: "#mechanical-engineer"
    },
    {
      id: "eng-002",
      title: "Civil Engineer",
      company: "BuildRight Construction",
      location: "Kano, Nigeria",
      description: "Oversee construction projects from planning to completion, ensuring compliance with regulations.",
      url: "#civil-engineer"
    },
    {
      id: "eng-003",
      title: "Electrical Engineer",
      company: "Power Solutions Nigeria",
      location: "Enugu, Nigeria",
      description: "Design and implement electrical systems for commercial and residential buildings.",
      url: "#electrical-engineer"
    }
  ],
  
  "Business Administration": [
    {
      id: "ba-001",
      title: "Business Analyst",
      company: "Consulting Partners",
      location: "Lagos, Nigeria",
      description: "Analyze business processes and recommend improvements to increase efficiency and profitability.",
      url: "#business-analyst"
    },
    {
      id: "ba-002",
      title: "Project Manager",
      company: "African Developments Ltd",
      location: "Abuja, Nigeria",
      description: "Lead project teams to deliver business solutions on time and within budget.",
      url: "#project-manager"
    },
    {
      id: "ba-003",
      title: "Marketing Coordinator",
      company: "Brand Nigeria",
      location: "Lagos, Nigeria",
      description: "Develop and implement marketing strategies to promote products and services.",
      url: "#marketing-coordinator"
    }
  ]
};

export const searchJobs = async (query: string, location: string) => {
  // Simulate API call delay
  await delay(1500);
  
  // Convert query to lowercase for case-insensitive matching
  const queryLower = query.toLowerCase();
  
  // Determine which job category to show based on the query
  let categoryResults: JobListing[] = [];
  
  for (const [category, jobs] of Object.entries(mockJobListings)) {
    if (queryLower.includes(category.toLowerCase())) {
      categoryResults = [...categoryResults, ...jobs];
    }
  }
  
  // If no specific category matched, search across all jobs
  if (categoryResults.length === 0) {
    const allJobs = Object.values(mockJobListings).flat();
    categoryResults = allJobs.filter(job => 
      job.title.toLowerCase().includes(queryLower) || 
      job.description.toLowerCase().includes(queryLower) ||
      job.company.toLowerCase().includes(queryLower)
    );
  }
  
  // Filter by location if provided
  if (location && location.trim() !== '') {
    const locationLower = location.toLowerCase();
    categoryResults = categoryResults.filter(job => 
      job.location.toLowerCase().includes(locationLower)
    );
  }
  
  return categoryResults as JobListing[];
};
