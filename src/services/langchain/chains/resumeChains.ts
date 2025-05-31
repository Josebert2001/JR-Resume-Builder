
import { LLMChain } from "langchain/chains";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { GroqLLM } from "../groqLLM";
import {
  resumeContentPrompt,
  workDescriptionPrompt,
  educationDescriptionPrompt,
  resumeAnalysisPrompt,
  skillsSuggestionPrompt
} from "../prompts/resumePrompts";

// Initialize the LLM instance
const llm = new GroqLLM({
  temperature: 0.7,
  maxTokens: 1024
});

// JSON output parser for structured responses
const jsonParser = new JsonOutputParser();

// Resume content generation chain
export const resumeContentChain = new LLMChain({
  llm,
  prompt: resumeContentPrompt,
  outputParser: jsonParser,
});

// Work description generation chain
export const workDescriptionChain = new LLMChain({
  llm,
  prompt: workDescriptionPrompt,
});

// Education description generation chain
export const educationDescriptionChain = new LLMChain({
  llm,
  prompt: educationDescriptionPrompt,
});

// Resume analysis chain
export const resumeAnalysisChain = new LLMChain({
  llm,
  prompt: resumeAnalysisPrompt,
  outputParser: jsonParser,
});

// Skills suggestion chain
export const skillsSuggestionChain = new LLMChain({
  llm,
  prompt: skillsSuggestionPrompt,
  outputParser: jsonParser,
});
