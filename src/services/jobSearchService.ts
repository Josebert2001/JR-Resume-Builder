
// This is a mock service that simulates job search API calls
// In a real app, this would make actual API calls to job search services

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  jobType?: string; // Full-time, Part-time, Contract, etc.
  datePosted?: string;
  industry?: string;
};

// Mock function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced mock job listings with more categories and locations
const mockJobListings: Record<string, JobListing[]> = {
  "Computer Science": [
    {
      id: "cs-001",
      title: "Software Developer",
      company: "TechHub Nigeria",
      location: "Lagos, Nigeria",
      description: "We're looking for a skilled software developer to join our team. Experience with modern JavaScript frameworks required.",
      url: "#software-developer",
      salary: "₦250,000 - ₦400,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-01",
      industry: "Technology"
    },
    {
      id: "cs-002",
      title: "Frontend Engineer",
      company: "Fintech Solutions",
      location: "Abuja, Nigeria",
      description: "Join our growing team to build responsive web applications with React, TypeScript, and modern frontend tools.",
      url: "#frontend-engineer",
      salary: "₦300,000 - ₦450,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-03",
      industry: "Financial Technology"
    },
    {
      id: "cs-003",
      title: "Full Stack Developer",
      company: "Global Systems Ltd",
      location: "Port Harcourt, Nigeria",
      description: "Develop and maintain web applications using Node.js, React, and MongoDB in an agile environment.",
      url: "#fullstack-developer",
      salary: "₦350,000 - ₦500,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-03-28",
      industry: "Information Technology"
    },
    {
      id: "cs-004",
      title: "Mobile App Developer",
      company: "Digital Innovations",
      location: "Ibadan, Nigeria",
      description: "Develop cutting-edge mobile applications for Android and iOS platforms using Flutter and React Native.",
      url: "#mobile-developer",
      salary: "₦280,000 - ₦420,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-05",
      industry: "Technology"
    },
    {
      id: "cs-005",
      title: "DevOps Engineer",
      company: "Cloud Nigeria",
      location: "Lagos, Nigeria",
      description: "Manage our cloud infrastructure and implement CI/CD pipelines for our software products.",
      url: "#devops-engineer",
      salary: "₦400,000 - ₦600,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-03-25",
      industry: "Cloud Computing"
    }
  ],
  
  "Engineering": [
    {
      id: "eng-001",
      title: "Mechanical Engineer",
      company: "Nigerian Engineering Corp",
      location: "Lagos, Nigeria",
      description: "Design and develop mechanical components and systems using CAD software.",
      url: "#mechanical-engineer",
      salary: "₦280,000 - ₦420,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-02",
      industry: "Manufacturing"
    },
    {
      id: "eng-002",
      title: "Civil Engineer",
      company: "BuildRight Construction",
      location: "Kano, Nigeria",
      description: "Oversee construction projects from planning to completion, ensuring compliance with regulations.",
      url: "#civil-engineer",
      salary: "₦300,000 - ₦450,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-03-30",
      industry: "Construction"
    },
    {
      id: "eng-003",
      title: "Electrical Engineer",
      company: "Power Solutions Nigeria",
      location: "Enugu, Nigeria",
      description: "Design and implement electrical systems for commercial and residential buildings.",
      url: "#electrical-engineer",
      salary: "₦320,000 - ₦480,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-04",
      industry: "Energy"
    },
    {
      id: "eng-004",
      title: "Petroleum Engineer",
      company: "Nigerian Oil & Gas",
      location: "Port Harcourt, Nigeria",
      description: "Develop and implement methods for extracting oil and gas from the earth, and design equipment for processing.",
      url: "#petroleum-engineer",
      salary: "₦500,000 - ₦800,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-03-27",
      industry: "Oil & Gas"
    },
    {
      id: "eng-005",
      title: "Agricultural Engineer",
      company: "AgriTech Nigeria",
      location: "Ibadan, Nigeria",
      description: "Design agricultural machinery and develop methods to improve farming efficiency and sustainability.",
      url: "#agricultural-engineer",
      salary: "₦250,000 - ₦380,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-01",
      industry: "Agriculture"
    }
  ],
  
  "Business Administration": [
    {
      id: "ba-001",
      title: "Business Analyst",
      company: "Consulting Partners",
      location: "Lagos, Nigeria",
      description: "Analyze business processes and recommend improvements to increase efficiency and profitability.",
      url: "#business-analyst",
      salary: "₦280,000 - ₦420,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-03",
      industry: "Consulting"
    },
    {
      id: "ba-002",
      title: "Project Manager",
      company: "African Developments Ltd",
      location: "Abuja, Nigeria",
      description: "Lead project teams to deliver business solutions on time and within budget.",
      url: "#project-manager",
      salary: "₦350,000 - ₦500,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-03-29",
      industry: "Project Management"
    },
    {
      id: "ba-003",
      title: "Marketing Coordinator",
      company: "Brand Nigeria",
      location: "Lagos, Nigeria",
      description: "Develop and implement marketing strategies to promote products and services.",
      url: "#marketing-coordinator",
      salary: "₦220,000 - ₦350,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-02",
      industry: "Marketing"
    },
    {
      id: "ba-004",
      title: "Human Resources Manager",
      company: "Talent Hub Nigeria",
      location: "Kaduna, Nigeria",
      description: "Oversee recruitment, employee relations, and implement HR policies and programs.",
      url: "#hr-manager",
      salary: "₦320,000 - ₦450,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-03-31",
      industry: "Human Resources"
    },
    {
      id: "ba-005",
      title: "Financial Analyst",
      company: "Nigerian Investment Bank",
      location: "Lagos, Nigeria",
      description: "Analyze financial data, prepare reports, and make recommendations for investment decisions.",
      url: "#financial-analyst",
      salary: "₦300,000 - ₦480,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-05",
      industry: "Banking & Finance"
    }
  ],
  
  "Medicine": [
    {
      id: "med-001",
      title: "Medical Officer",
      company: "Nigerian General Hospital",
      location: "Lagos, Nigeria",
      description: "Provide medical care to patients, diagnose illnesses, and prescribe treatments.",
      url: "#medical-officer",
      salary: "₦350,000 - ₦500,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-01",
      industry: "Healthcare"
    },
    {
      id: "med-002",
      title: "Pharmacist",
      company: "HealthPlus Pharmacy",
      location: "Abuja, Nigeria",
      description: "Dispense medications, provide information on drug interactions, and ensure patient safety.",
      url: "#pharmacist",
      salary: "₦300,000 - ₦450,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-03-28",
      industry: "Pharmaceutical"
    },
    {
      id: "med-003",
      title: "Registered Nurse",
      company: "Evercare Hospital",
      location: "Port Harcourt, Nigeria",
      description: "Provide patient care, administer medications, and assist doctors with medical procedures.",
      url: "#registered-nurse",
      salary: "₦220,000 - ₦350,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-03",
      industry: "Healthcare"
    }
  ],
  
  "Education": [
    {
      id: "edu-001",
      title: "Secondary School Teacher",
      company: "National College",
      location: "Lagos, Nigeria",
      description: "Teach subjects to secondary school students, prepare lesson plans, and assess student progress.",
      url: "#secondary-teacher",
      salary: "₦150,000 - ₦250,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-02",
      industry: "Education"
    },
    {
      id: "edu-002",
      title: "University Lecturer",
      company: "University of Nigeria",
      location: "Nsukka, Nigeria",
      description: "Teach undergraduate and postgraduate courses, conduct research, and publish academic papers.",
      url: "#university-lecturer",
      salary: "₦280,000 - ₦450,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-03-30",
      industry: "Higher Education"
    },
    {
      id: "edu-003",
      title: "Educational Consultant",
      company: "Learning Solutions",
      location: "Abuja, Nigeria",
      description: "Develop educational programs, train teachers, and provide guidance on curriculum development.",
      url: "#educational-consultant",
      salary: "₦250,000 - ₦400,000 monthly",
      jobType: "Full-time",
      datePosted: "2025-04-04",
      industry: "Education"
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
      job.company.toLowerCase().includes(queryLower) ||
      (job.industry && job.industry.toLowerCase().includes(queryLower))
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

// Function to get all available locations from job listings
export const getAvailableLocations = (): string[] => {
  const allJobs = Object.values(mockJobListings).flat();
  const locations = allJobs.map(job => job.location);
  return [...new Set(locations)]; // Remove duplicates
};

// Function to get all available job categories
export const getAvailableCategories = (): string[] => {
  return Object.keys(mockJobListings);
};

