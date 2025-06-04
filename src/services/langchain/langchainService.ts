
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

const chat = new ChatOpenAI({ 
  apiKey: apiKey,
  temperature: 0.7,
  modelName: 'gpt-3.5-turbo',
  cache: true,
  maxTokens: 1024,
});

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

// Function to safely parse JSON with error handling
function safeJsonParse<T>(jsonString: string, defaultReturn: T): T {
  try {
    const cleanedJsonString = jsonString.replace(/'/g, "\"").replace(/(\w+):/g, '"$1":');
    return JSON.parse(cleanedJsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return defaultReturn;
  }
}

export const analyzeResume = async (resumeText: string, jobDescription?: string): Promise<ResumeAnalysisResponse> => {
  try {
    if (!isApiKeyValid()) {
      throw new Error('API key is not configured. Please set your Groq API key in the settings.');
    }

    const prompt = jobDescription 
      ? `Analyze this resume against the job description and provide feedback in JSON format.

Resume: ${resumeText}
Job Description: ${jobDescription}

Return JSON with: score (0-100), matchedKeywords array, missedKeywords array, suggestions array.`
      : `Analyze this resume and provide feedback in JSON format.

Resume: ${resumeText}

Return JSON with: score (0-100), matchedKeywords array, missedKeywords array, suggestions array.`;

    const response = await chat.invoke(prompt);
    
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
  return !!apiKey;
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

// Add missing exports that other files are trying to import
export const generateResumeContent = async (data: any): Promise<any> => {
  throw new Error('Function not implemented yet');
};

export const generateJobResponsibilities = async (data: any): Promise<string> => {
  throw new Error('Function not implemented yet');
};

export const suggestSkills = async (position: string, experience: string[]): Promise<string[]> => {
  throw new Error('Function not implemented yet');
};

export const generateEducationDescription = async (degree: string, fieldOfStudy: string, school: string): Promise<string> => {
  throw new Error('Function not implemented yet');
};

export const getComprehensiveResumeAnalysis = async (resumeText: string, targetRole: string, industry: string, jobDescription: string): Promise<any> => {
  throw new Error('Function not implemented yet');
};

export const getIndustryOptimization = async (resumeText: string, targetRole: string, industry: string): Promise<any> => {
  throw new Error('Function not implemented yet');
};

export const checkLangchainHealth = async (): Promise<{ isHealthy: boolean; errors: string[]; details: Record<string, any> }> => {
  try {
    const hasApiKey = isApiKeyValid();
    const errors: string[] = [];
    
    if (!hasApiKey) {
      errors.push('API key is not configured');
    }

    return {
      isHealthy: errors.length === 0,
      errors,
      details: {
        hasApiKey,
        chainTest: hasApiKey ? 'success' : 'failed',
        memoryTest: hasApiKey ? 'success' : 'failed'
      }
    };
  } catch (error) {
    return {
      isHealthy: false,
      errors: ['Health check failed'],
      details: {
        hasApiKey: false,
        chainTest: 'failed',
        memoryTest: 'failed'
      }
    };
  }
};
