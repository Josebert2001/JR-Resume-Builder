
import { PromptTemplate } from "@langchain/core/prompts";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { AIMessage } from "@langchain/core/messages";
import { createGroqChat } from '../core/llmCore';

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
