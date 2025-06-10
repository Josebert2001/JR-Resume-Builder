import { ConversationChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { ConversationMemory } from "../memory/conversationMemory";

// Get API key from localStorage or environment
const getApiKey = () => {
  return localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || '';
};

// Initialize ChatGroq LLM
const createGroqLLM = () => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('Groq API key is not configured. Please set your API key in the settings.');
  }

  return new ChatGroq({
    apiKey: apiKey,
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
    maxTokens: 1024,
  });
};

// Resume conversation memory with token limit
export const resumeConversationMemory = new ConversationMemory({
  maxTokenLimit: 2000,
  memoryKey: "chat_history"
});

// Contextual resume assistance prompt
const resumeConversationPrompt = PromptTemplate.fromTemplate(`
You are a professional resume writing assistant with extensive experience in career development.

Previous conversation:
{chat_history}

Current request: {input}

Guidelines:
- Provide specific, actionable advice
- Consider the conversation context
- Be concise but thorough
- Focus on professional presentation
- Tailor advice to the user's industry and experience level

Response:
`);

// Main conversation chain for resume assistance
export const resumeConversationChain = new ConversationChain({
  llm: createGroqLLM(),
  prompt: resumeConversationPrompt,
  memory: resumeConversationMemory,
  verbose: false
});

// Skills improvement conversation memory
export const skillsConversationMemory = new ConversationMemory({
  maxTokenLimit: 1500,
  memoryKey: "skills_history"
});

// Skills conversation prompt
const skillsConversationPrompt = PromptTemplate.fromTemplate(`
You are a career development specialist focused on skill assessment and improvement.

Previous discussion:
{skills_history}

Current question: {input}

Provide advice on:
- Skill development strategies
- Industry-relevant competencies
- Learning resources and pathways
- How to showcase skills effectively

Response:
`);

// Skills conversation chain
export const skillsConversationChain = new ConversationChain({
  llm: createGroqLLM(),
  prompt: skillsConversationPrompt,
  memory: skillsConversationMemory,
  verbose: false
});

// Career advice conversation memory
export const careerConversationMemory = new ConversationMemory({
  maxTokenLimit: 2000,
  memoryKey: "career_history"
});

// Career advice prompt
const careerConversationPrompt = PromptTemplate.fromTemplate(`
You are a senior career counselor with deep knowledge of various industries and career paths.

Conversation context:
{career_history}

User's question: {input}

Provide guidance on:
- Career progression strategies
- Industry insights and trends
- Job search tactics
- Professional networking
- Work-life balance considerations

Response:
`);

// Career conversation chain
export const careerConversationChain = new ConversationChain({
  llm: createGroqLLM(),
  prompt: careerConversationPrompt,
  memory: careerConversationMemory,
  verbose: false
});