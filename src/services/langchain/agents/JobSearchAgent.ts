
import { ChatGroq } from "@langchain/groq";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export interface JobSearchParams {
  query: string;
  location: string;
  experienceLevel?: string;
  jobType?: string;
  salaryMin?: number;
  skills?: string[];
}

export interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  url: string;
  skills: string[];
  postedDate: string;
  matchScore?: number;
}

export class JobSearchAgent {
  private llm: ChatGroq;
  private agent: AgentExecutor;

  constructor(apiKey?: string) {
    this.llm = new ChatGroq({
      apiKey: apiKey || process.env.GROQ_API_KEY,
      model: "mixtral-8x7b-32768",
      temperature: 0.1,
    });

    this.setupAgent();
  }

  private setupAgent() {
    const tools = [
      new DynamicTool({
        name: "search_indeed_jobs",
        description: "Search for jobs on Indeed based on query and location",
        func: async (input: string) => {
          const params = JSON.parse(input) as JobSearchParams;
          return this.searchIndeedJobs(params);
        },
      }),
      new DynamicTool({
        name: "search_remote_jobs",
        description: "Search for remote job opportunities",
        func: async (input: string) => {
          const params = JSON.parse(input) as JobSearchParams;
          return this.searchRemoteJobs(params);
        },
      }),
      new DynamicTool({
        name: "analyze_job_market",
        description: "Analyze job market trends for a specific location and role",
        func: async (input: string) => {
          const params = JSON.parse(input) as JobSearchParams;
          return this.analyzeJobMarket(params);
        },
      }),
    ];

    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a specialized job search agent. Your goal is to find the most relevant job opportunities for users based on their skills, location, and preferences.

      Available tools: {tools}
      Tool names: {tool_names}

      When searching for jobs:
      1. Use the user's location to find local opportunities
      2. Match their skills to job requirements
      3. Consider their experience level and preferences
      4. Provide salary insights when available
      5. Rank results by relevance

      User request: {input}
      
      {agent_scratchpad}
    `);

    this.agent = createReactAgent({
      llm: this.llm,
      tools,
      prompt,
    });
  }

  private async searchIndeedJobs(params: JobSearchParams): Promise<string> {
    // Simulate Indeed API call - In production, use actual Indeed API
    console.log('Searching Indeed jobs with params:', params);
    
    const mockJobs: JobResult[] = [
      {
        id: `indeed_${Date.now()}_1`,
        title: `${params.query} - Senior Level`,
        company: "Tech Solutions Inc",
        location: params.location,
        salary: "$80,000 - $120,000",
        description: `We're looking for an experienced ${params.query} professional in ${params.location}. Requirements include strong technical skills and 3+ years of experience.`,
        url: `https://indeed.com/job/${Date.now()}`,
        skills: params.skills || ["JavaScript", "React", "Node.js"],
        postedDate: new Date().toISOString(),
        matchScore: 85
      },
      {
        id: `indeed_${Date.now()}_2`,
        title: `Junior ${params.query}`,
        company: "Startup Dynamics",
        location: params.location,
        salary: "$60,000 - $80,000",
        description: `Entry-level position for ${params.query} in ${params.location}. Great opportunity for career growth.`,
        url: `https://indeed.com/job/${Date.now()}`,
        skills: params.skills || ["Python", "SQL", "Git"],
        postedDate: new Date().toISOString(),
        matchScore: 75
      }
    ];

    return JSON.stringify(mockJobs);
  }

  private async searchRemoteJobs(params: JobSearchParams): Promise<string> {
    console.log('Searching remote jobs with params:', params);
    
    const mockRemoteJobs: JobResult[] = [
      {
        id: `remote_${Date.now()}_1`,
        title: `Remote ${params.query}`,
        company: "Global Tech Corp",
        location: "Remote",
        salary: "$90,000 - $130,000",
        description: `Fully remote ${params.query} position. Work from anywhere while building cutting-edge applications.`,
        url: `https://remotejobs.com/job/${Date.now()}`,
        skills: params.skills || ["React", "TypeScript", "AWS"],
        postedDate: new Date().toISOString(),
        matchScore: 90
      }
    ];

    return JSON.stringify(mockRemoteJobs);
  }

  private async analyzeJobMarket(params: JobSearchParams): Promise<string> {
    console.log('Analyzing job market for:', params);
    
    const marketAnalysis = {
      location: params.location,
      totalJobs: Math.floor(Math.random() * 1000) + 500,
      avgSalary: "$85,000 - $110,000",
      topSkills: params.skills || ["JavaScript", "React", "Python", "SQL"],
      marketTrend: "Growing +15% YoY",
      competitionLevel: "Moderate",
      recommendations: [
        `High demand for ${params.query} professionals in ${params.location}`,
        "Consider highlighting cloud technologies in your profile",
        "Remote opportunities are increasing by 25%"
      ]
    };

    return JSON.stringify(marketAnalysis);
  }

  async searchJobs(params: JobSearchParams): Promise<JobResult[]> {
    try {
      const executor = new AgentExecutor({
        agent: this.agent,
        tools: [
          new DynamicTool({
            name: "search_indeed_jobs",
            description: "Search for jobs on Indeed",
            func: this.searchIndeedJobs.bind(this),
          }),
          new DynamicTool({
            name: "search_remote_jobs", 
            description: "Search for remote jobs",
            func: this.searchRemoteJobs.bind(this),
          }),
        ],
      });

      const result = await executor.invoke({
        input: `Find ${params.query} jobs in ${params.location} for someone with skills: ${params.skills?.join(', ')}`,
      });

      // Parse the agent's response to extract job results
      const jobs = this.parseJobResults(result.output);
      return jobs;
    } catch (error) {
      console.error('Error in job search agent:', error);
      // Fallback to direct search
      const indeedResults = await this.searchIndeedJobs(params);
      const remoteResults = await this.searchRemoteJobs(params);
      
      return [
        ...JSON.parse(indeedResults),
        ...JSON.parse(remoteResults)
      ];
    }
  }

  private parseJobResults(agentOutput: string): JobResult[] {
    try {
      // Try to extract JSON from agent output
      const jsonMatch = agentOutput.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Error parsing job results:', error);
      return [];
    }
  }
}
