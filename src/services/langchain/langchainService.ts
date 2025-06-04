import { OpenAI } from "langchain/llms/openai";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { loadQARefineChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from 'fs';
import { Document } from "langchain/document";
import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";

const apiKey = process.env.GROQ_API_KEY;

const llm = new OpenAI({
  apiKey: apiKey,
  temperature: 0.7,
  modelName: 'mixtral-8x7b-32768',
  cache: true,
  maxTokens: 1024,
});

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
    // Replace single quotes with double quotes, and ensure property names are double-quoted
    const cleanedJsonString = jsonString.replace(/'/g, "\"").replace(/(\w+):/g, '"$1":');
    return JSON.parse(cleanedJsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return defaultReturn;
  }
}

const getResumeAnalysisPrompt = (resumeText: string) => {
  return `
    Analyze the following resume text and provide feedback:
    ${resumeText}

    Provide a score (0-100), matched keywords, missed keywords, and suggestions for improvement.
    Ensure the response is valid JSON matching the ResumeAnalysisResponse interface.
  `;
};

const getJobTargetedAnalysisPrompt = (resumeText: string, jobDescription: string) => {
  return `
    Analyze the following resume text in relation to the job description provided.
    Resume Text: ${resumeText}
    Job Description: ${jobDescription}

    Provide a score (0-100), list of matched keywords, list of missed keywords, and suggestions for improvement to better align the resume with the job description.
    Ensure the response is valid JSON matching the ResumeAnalysisResponse interface.
  `;
};

export const analyzeResume = async (resumeText: string, jobDescription?: string): Promise<ResumeAnalysisResponse> => {
  try {
    if (!isApiKeyValid()) {
      throw new Error('API key is not configured. Please set your Groq API key in the settings.');
    }

    const prompt = jobDescription 
      ? getJobTargetedAnalysisPrompt(resumeText, jobDescription)
      : getResumeAnalysisPrompt(resumeText);

    const response = await llm.invoke(prompt);
    
    // Parse the response and ensure it matches our interface
    const parsed = safeJsonParse<ResumeAnalysisResponse>(response, {
      score: 0,
      matchedKeywords: [],
      missedKeywords: [],
      suggestions: []
    });

    // Validate and return with required properties
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

// Function to set the API key
export const setApiKey = (newApiKey: string): void => {
  process.env.GROQ_API_KEY = newApiKey;
};

// Resume Conversation Chain
let resumeConversationMemory: BufferMemory | null = null;

export const initializeResumeConversation = () => {
  resumeConversationMemory = new BufferMemory({
    chatHistory: new ChatMessageHistory([
      new AIChatMessage("Hello! I am your resume assistant. How can I help you with your resume today?"),
    ]),
    memoryKey: "chat_history",
    inputKey: "input",
    outputKey: "response",
    llm: chat,
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
      new AIChatMessage("Hello! I am your skills development assistant. How can I help you with your skills today?"),
    ]),
    memoryKey: "chat_history",
    inputKey: "input",
    outputKey: "response",
    llm: chat,
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
      new AIChatMessage("Hello! I am your career guidance assistant. How can I help you with your career today?"),
    ]),
    memoryKey: "chat_history",
    inputKey: "input",
    outputKey: "response",
    llm: chat,
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
