import { LLMChain } from "langchain/chains";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatGroq } from "@langchain/groq";
import {
  resumeContentPrompt,
  workDescriptionPrompt,
  educationDescriptionPrompt,
  resumeAnalysisPrompt,
  skillsSuggestionPrompt
} from "../prompts/resumePrompts";

// Get API key from localStorage or environment
const getApiKey = () => {
  return import.meta.env.VITE_GROQ_API_KEY || '';
};

// Initialize the ChatGroq LLM instance
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

// JSON output parser for structured responses
const jsonParser = new JsonOutputParser();

// Resume content generation chain
export const resumeContentChain = new LLMChain({
  llm: createGroqLLM(),
  prompt: resumeContentPrompt,
  outputParser: jsonParser,
});

// Work description generation chain
export const workDescriptionChain = new LLMChain({
  llm: createGroqLLM(),
  prompt: workDescriptionPrompt,
});

// Education description generation chain
export const educationDescriptionChain = new LLMChain({
  llm: createGroqLLM(),
  prompt: educationDescriptionPrompt,
});

// Resume analysis chain
export const resumeAnalysisChain = new LLMChain({
  llm: createGroqLLM(),
  prompt: resumeAnalysisPrompt,
  outputParser: jsonParser,
});

// Skills suggestion chain
export const skillsSuggestionChain = new LLMChain({
  llm: createGroqLLM(),
  prompt: skillsSuggestionPrompt,
  outputParser: jsonParser,
});