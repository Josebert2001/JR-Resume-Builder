import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

// Get API key from localStorage or environment
const getApiKey = () => {
  return localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || '';
};

// Initialize ChatGroq instead of ChatOpenAI
const createGroqChat = () => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('Groq API key is not configured. Please set your API key in the settings.');
  }

  return new ChatGroq({
    apiKey: apiKey,
    model: "mixtral-8x7b-32768", // Using Mixtral model for better performance
    temperature: 0.7,
    maxTokens: 1024,
  });
};

// Define Zod schema for resume analysis
const resumeAnalysisSchema = z.object({
  score: z.number().describe("A score indicating the overall quality of the resume."),
  matchedKeywords: z.array(z.string()).describe("Keywords from the job description that are present in the resume."),
  missedKeywords: z.array(z.string()).describe("Keywords from the job description that are missing from the resume."),
  suggestions: z.array(z.string()).describe("Specific suggestions for improving the resume."),
});

// Define types based on the Zod schema
type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;

interface ResumeAnalysisResponse extends ResumeAnalysis {
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
  suggestions: string[];
}

interface GenerationRequest {
  name: string;
  email: string;
  phone: string;
  course: string;
  school: string;
  interests: string;
}

interface GenerationResponse {
  summary: string;
  skills: string[];
}

interface ResponsibilityGenerationRequest {
  position: string;
  company: string;
  industry?: string;
}

// Function to safely parse JSON with error handling
function safeJsonParse<T>(jsonString: string, defaultReturn: T): T {
  try {
    // Clean the JSON string
    const cleanedJsonString = jsonString
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*Here\s+is\s+.*?:\s*/i, '')
      .trim();
    
    // Try to extract JSON from the response
    const jsonMatch = cleanedJsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    
    return JSON.parse(cleanedJsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error, 'Input:', jsonString);
    return defaultReturn;
  }
}

export const generateResumeContent = async (data: GenerationRequest): Promise<GenerationResponse> => {
  try {
    const chat = createGroqChat();
    
    if (!data.course || !data.school || !data.interests) {
      throw new Error('Missing required fields for resume content generation');
    }

    const prompt = `Create a professional resume summary and relevant skills list for:
Name: ${data.name}
Education: ${data.course} from ${data.school}
Interests: ${data.interests}

Generate:
1. A compelling career objective/professional summary (2-3 sentences) that:
   - Highlights educational background
   - Mentions career aspirations
   - Connects interests with professional goals
2. A list of 5-7 relevant technical and soft skills based on the course and interests

Return ONLY a JSON object with the following structure, nothing else:
{
  "summary": "career objective here",
  "skills": ["skill1", "skill2", ...]
}`;

    const response = await chat.invoke([
      { 
        role: "system", 
        content: "You are a professional resume writer. Return ONLY properly formatted JSON with a summary and skills array. Do not include any other text or explanations."
      },
      { 
        role: "user", 
        content: prompt 
      }
    ]);

    const defaultResponse: GenerationResponse = {
      summary: "Recent graduate seeking opportunities to apply academic knowledge and develop professional skills.",
      skills: ["Communication", "Problem Solving", "Teamwork", "Time Management", "Adaptability"]
    };

    const parsed = safeJsonParse<GenerationResponse>(response.content as string, defaultResponse);

    return {
      summary: parsed.summary || defaultResponse.summary,
      skills: Array.isArray(parsed.skills) ? parsed.skills : defaultResponse.skills
    };
  } catch (error) {
    console.error('Resume content generation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate resume content');
  }
};

export const generateJobResponsibilities = async (data: ResponsibilityGenerationRequest): Promise<string> => {
  try {
    const chat = createGroqChat();
    
    const prompt = `Generate 4-5 detailed bullet points describing key responsibilities for a ${data.position} role at ${data.company}${data.industry ? ` in the ${data.industry} industry` : ''}.
    Focus on specific, measurable achievements and key responsibilities.
    Format each bullet point starting with "• " and separate with newlines.`;

    const response = await chat.invoke([
      { role: "user", content: prompt }
    ]);

    return response.content as string || "Failed to generate responsibilities";
  } catch (error) {
    console.error('Error generating job responsibilities:', error);
    throw new Error('Failed to generate job responsibilities');
  }
};

export const generateEducationDescription = async (degree: string, fieldOfStudy: string, school: string): Promise<string> => {
  try {
    const chat = createGroqChat();
    
    const prompt = `Generate a concise, professional description for an education entry with:
Degree: ${degree}
Field of Study: ${fieldOfStudy}
School: ${school}

Focus on:
- Relevant coursework
- Key academic achievements
- Research or projects if applicable
- Skills developed

Keep it to 2-3 sentences maximum. Return only the description text.`;

    const response = await chat.invoke([
      { role: "user", content: prompt }
    ]);

    return response.content as string || '';
  } catch (error) {
    console.error('Error generating education description:', error);
    throw new Error('Failed to generate education description');
  }
};

export const suggestSkills = async (position: string, experience: string[]): Promise<string[]> => {
  try {
    const chat = createGroqChat();
    
    const prompt = `Suggest relevant professional skills for:
Position: ${position}
Experience: ${experience.join(', ')}

Include:
- Technical skills
- Soft skills
- Industry-specific skills
- Tools and technologies
- Certifications if applicable

Return only a JSON array of skills, nothing else.
Example: ["skill1", "skill2", "skill3", "skill4", "skill5"]`;

    const response = await chat.invoke([
      { 
        role: "system", 
        content: "Return ONLY a JSON array of skills. No additional text or explanations."
      },
      { 
        role: "user", 
        content: prompt 
      }
    ]);

    const content = response.content as string || '[]';
    const defaultSkills = ["Communication", "Problem Solving", "Teamwork", "Leadership", "Technical Skills"];
    
    try {
      const parsed = safeJsonParse<string[]>(content, defaultSkills);
      return Array.isArray(parsed) ? parsed : defaultSkills;
    } catch (error) {
      console.error('Error parsing skills:', error);
      return defaultSkills;
    }
  } catch (error) {
    console.error('Error suggesting skills:', error);
    throw new Error('Failed to suggest skills');
  }
};

export const analyzeResume = async (resumeText: string, jobDescription?: string): Promise<ResumeAnalysisResponse> => {
  try {
    if (!isApiKeyValid()) {
      throw new Error('API key is not configured. Please set your Groq API key in the settings.');
    }

    const chat = createGroqChat();

    const prompt = jobDescription 
      ? `Analyze this resume against the job description and provide feedback in JSON format.

Resume: ${resumeText}
Job Description: ${jobDescription}

Return JSON with: score (0-100), matchedKeywords array, missedKeywords array, suggestions array.

{
  "score": number,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missedKeywords": ["keyword3", "keyword4"],
  "suggestions": ["suggestion1", "suggestion2"]
}`
      : `Analyze this resume and provide feedback in JSON format.

Resume: ${resumeText}

Return JSON with: score (0-100), matchedKeywords array, missedKeywords array, suggestions array.

{
  "score": number,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missedKeywords": ["keyword3", "keyword4"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

    const response = await chat.invoke([
      { 
        role: "system", 
        content: "You are a resume analysis expert. Return ONLY properly formatted JSON with the requested structure."
      },
      { 
        role: "user", 
        content: prompt 
      }
    ]);
    
    const defaultResponse: ResumeAnalysisResponse = {
      score: 0,
      matchedKeywords: [],
      missedKeywords: [],
      suggestions: []
    };

    const parsed = safeJsonParse<ResumeAnalysisResponse>(response.content as string, defaultResponse);

    return {
      score: parsed.score ?? 0,
      matchedKeywords: parsed.matchedKeywords ?? [],
      missedKeywords: parsed.missedKeywords ?? [],
      suggestions: parsed.suggestions ?? []
    };
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw error;
  }
};

// Function to check if the API key is valid
export const isApiKeyValid = (): boolean => {
  const apiKey = getApiKey();
  return !!apiKey && apiKey.startsWith('gsk-');
};

// Resume Conversation Chain
let resumeConversationMemory: BufferMemory | null = null;

export const initializeResumeConversation = () => {
  resumeConversationMemory = new BufferMemory({
    chatHistory: new ChatMessageHistory([
      new AIMessage("Hello! I am your resume assistant. How can I help you with your resume today?"),
    ]),
    memoryKey: "chat_history",
    inputKey: "input",
    outputKey: "response",
  });
};

if (!resumeConversationMemory) {
  initializeResumeConversation();
}

export const getResumeConversationResponse = async (input: string): Promise<{ response: string }> => {
  if (!resumeConversationMemory) {
    initializeResumeConversation();
  }

  const chat = createGroqChat();

  const chain = new ConversationChain({
    memory: resumeConversationMemory,
    prompt: PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI resume assistant. The AI is helpful, creative, clever, and very friendly.

    Current conversation:
    {chat_history}
    
    Human: {input}
    AI:`),
    llm: chat,
  });

  try {
    const response = await chain.call({ input });
    return { response: response.response };
  } catch (error) {
    console.error('Resume conversation error:', error);
    throw error;
  }
};

export const clearResumeConversationMemory = async (): Promise<void> => {
  if (resumeConversationMemory) {
    await resumeConversationMemory.clear();
    initializeResumeConversation();
  }
};

// Skills Conversation Chain
let skillsConversationMemory: BufferMemory | null = null;

export const initializeSkillsConversation = () => {
  skillsConversationMemory = new BufferMemory({
    chatHistory: new ChatMessageHistory([
      new AIMessage("Hello! I am your skills development assistant. How can I help you with your skills today?"),
    ]),
    memoryKey: "chat_history",
    inputKey: "input",
    outputKey: "response",
  });
};

if (!skillsConversationMemory) {
  initializeSkillsConversation();
}

export const getSkillsConversationResponse = async (input: string): Promise<{ response: string }> => {
  if (!skillsConversationMemory) {
    initializeSkillsConversation();
  }

  const chat = createGroqChat();

  const chain = new ConversationChain({
    memory: skillsConversationMemory,
    prompt: PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI skills development assistant. The AI is helpful, creative, clever, and very friendly.

    Current conversation:
    {chat_history}
    
    Human: {input}
    AI:`),
    llm: chat,
  });

  try {
    const response = await chain.call({ input });
    return { response: response.response };
  } catch (error) {
    console.error('Skills conversation error:', error);
    throw error;
  }
};

export const clearSkillsConversationMemory = async (): Promise<void> => {
  if (skillsConversationMemory) {
    await skillsConversationMemory.clear();
    initializeSkillsConversation();
  }
};

// Career Conversation Chain
let careerConversationMemory: BufferMemory | null = null;

export const initializeCareerConversation = () => {
  careerConversationMemory = new BufferMemory({
    chatHistory: new ChatMessageHistory([
      new AIMessage("Hello! I am your career guidance assistant. How can I help you with your career today?"),
    ]),
    memoryKey: "chat_history",
    inputKey: "input",
    outputKey: "response",
  });
};

if (!careerConversationMemory) {
  initializeCareerConversation();
}

export const getCareerConversationResponse = async (input: string): Promise<{ response: string }> => {
  if (!careerConversationMemory) {
    initializeCareerConversation();
  }

  const chat = createGroqChat();

  const chain = new ConversationChain({
    memory: careerConversationMemory,
    prompt: PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI career guidance assistant. The AI is helpful, creative, clever, and very friendly.

    Current conversation:
    {chat_history}
    
    Human: {input}
    AI:`),
    llm: chat,
  });

  try {
    const response = await chain.call({ input });
    return { response: response.response };
  } catch (error) {
    console.error('Career conversation error:', error);
    throw error;
  }
};

export const clearCareerConversationMemory = async (): Promise<void> => {
  if (careerConversationMemory) {
    await careerConversationMemory.clear();
    initializeCareerConversation();
  }
};

// Advanced analysis functions
export const getComprehensiveResumeAnalysis = async (
  resumeText: string, 
  targetRole: string, 
  industry: string, 
  jobDescription: string
): Promise<any> => {
  try {
    const chat = createGroqChat();
    
    const prompt = `Perform a comprehensive analysis of this resume for a ${targetRole} position in the ${industry} industry.

Resume Content:
${resumeText}

Target Role: ${targetRole}
Industry: ${industry}
Job Description: ${jobDescription}

Provide a detailed analysis in JSON format with:
{
  "analysis": {
    "overallScore": number (0-100),
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "missingElements": ["element1", "element2"]
  },
  "improvements": {
    "priorityActions": ["action1", "action2"],
    "contentSuggestions": {
      "summary": "improved summary",
      "skills": ["skill1", "skill2"]
    },
    "formattingTips": ["tip1", "tip2"]
  },
  "atsOptimization": {
    "atsScore": number (0-100),
    "keywordMatches": ["keyword1", "keyword2"],
    "missingKeywords": ["keyword3", "keyword4"],
    "recommendations": ["rec1", "rec2"]
  }
}`;

    const response = await chat.invoke([
      { 
        role: "system", 
        content: "You are an expert resume analyst. Return ONLY properly formatted JSON."
      },
      { 
        role: "user", 
        content: prompt 
      }
    ]);

    const defaultResponse = {
      analysis: {
        overallScore: 0,
        strengths: [],
        weaknesses: [],
        missingElements: []
      },
      improvements: {
        priorityActions: [],
        contentSuggestions: {
          summary: "",
          skills: []
        },
        formattingTips: []
      },
      atsOptimization: {
        atsScore: 0,
        keywordMatches: [],
        missingKeywords: [],
        recommendations: []
      }
    };

    return safeJsonParse(response.content as string, defaultResponse);
  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    throw new Error('Failed to perform comprehensive analysis');
  }
};

export const getIndustryOptimization = async (
  resumeText: string, 
  targetRole: string, 
  industry: string
): Promise<any> => {
  try {
    const chat = createGroqChat();
    
    const prompt = `Optimize this resume for the ${industry} industry and ${targetRole} role.

Resume Content:
${resumeText}

Target Role: ${targetRole}
Industry: ${industry}

Provide industry-specific optimization in JSON format:
{
  "industryKeywords": ["keyword1", "keyword2"],
  "essentialSkills": ["skill1", "skill2"],
  "optimizedContent": {
    "summary": "industry-optimized summary",
    "skills": ["industry-relevant skill 1"]
  }
}`;

    const response = await chat.invoke([
      { 
        role: "system", 
        content: "You are an industry-specific career consultant. Return ONLY properly formatted JSON."
      },
      { 
        role: "user", 
        content: prompt 
      }
    ]);

    const defaultResponse = {
      industryKeywords: [],
      essentialSkills: [],
      optimizedContent: {
        summary: "",
        skills: []
      }
    };

    return safeJsonParse(response.content as string, defaultResponse);
  } catch (error) {
    console.error('Industry optimization error:', error);
    throw new Error('Failed to perform industry optimization');
  }
};

export const checkLangchainHealth = async (): Promise<{ isHealthy: boolean; errors: string[]; details: Record<string, any> }> => {
  try {
    const hasApiKey = isApiKeyValid();
    const errors: string[] = [];
    
    if (!hasApiKey) {
      errors.push('Groq API key is not configured or invalid');
    }

    let chainTest = 'failed';
    let memoryTest = 'failed';

    if (hasApiKey) {
      try {
        const chat = createGroqChat();
        const testResponse = await chat.invoke([
          { role: "user", content: "Say 'OK' if you can read this." }
        ]);
        
        if (testResponse.content && typeof testResponse.content === 'string') {
          chainTest = 'success';
        }
      } catch (error) {
        errors.push(`Chain test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      try {
        // Test memory functionality
        const testMemory = new BufferMemory({
          chatHistory: new ChatMessageHistory(),
          memoryKey: "test_history"
        });
        await testMemory.saveContext({ input: "test" }, { output: "test" });
        memoryTest = 'success';
      } catch (error) {
        errors.push(`Memory test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      isHealthy: errors.length === 0,
      errors,
      details: {
        hasApiKey,
        chainTest,
        memoryTest,
        model: 'mixtral-8x7b-32768',
        provider: 'Groq'
      }
    };
  } catch (error) {
    return {
      isHealthy: false,
      errors: ['Health check failed'],
      details: {
        hasApiKey: false,
        chainTest: 'failed',
        memoryTest: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};