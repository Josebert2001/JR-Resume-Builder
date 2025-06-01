
import { BaseMemory } from "@langchain/core/memory";
import { InputValues, MemoryVariables, OutputValues } from "@langchain/core/memory";
import { ChatMessageHistory } from "langchain/memory";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export interface ConversationMemoryParams {
  returnMessages?: boolean;
  inputKey?: string;
  outputKey?: string;
  memoryKey?: string;
  maxTokenLimit?: number;
}

export class ConversationMemory extends BaseMemory {
  chatHistory: ChatMessageHistory;
  returnMessages: boolean;
  inputKey: string;
  outputKey: string;
  memoryKey: string;
  maxTokenLimit?: number;

  constructor(params: ConversationMemoryParams = {}) {
    super();
    this.chatHistory = new ChatMessageHistory();
    this.returnMessages = params.returnMessages ?? false;
    this.inputKey = params.inputKey ?? "input";
    this.outputKey = params.outputKey ?? "output";
    this.memoryKey = params.memoryKey ?? "history";
    this.maxTokenLimit = params.maxTokenLimit;
  }

  get memoryKeys(): string[] {
    return [this.memoryKey];
  }

  async loadMemoryVariables(values: InputValues): Promise<MemoryVariables> {
    const messages = await this.chatHistory.getMessages();
    
    if (this.returnMessages) {
      return { [this.memoryKey]: messages };
    }
    
    return {
      [this.memoryKey]: this.getBufferString(messages)
    };
  }

  async saveContext(inputValues: InputValues, outputValues: OutputValues): Promise<void> {
    try {
      const input = inputValues[this.inputKey];
      const output = outputValues[this.outputKey];

      // Ensure we have valid input and output
      if (!input || !output) {
        console.warn('Missing input or output for conversation memory');
        return;
      }

      // Create messages with proper structure
      const humanMessage = new HumanMessage({
        content: String(input),
        additional_kwargs: {}
      });

      const aiMessage = new AIMessage({
        content: String(output),
        additional_kwargs: {}
      });

      await this.chatHistory.addMessage(humanMessage);
      await this.chatHistory.addMessage(aiMessage);
      
      // Trim memory if it exceeds token limit
      if (this.maxTokenLimit) {
        await this.trimMemory();
      }
    } catch (error) {
      console.error('Error saving conversation context:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.chatHistory.clear();
    } catch (error) {
      console.error('Error clearing conversation memory:', error);
    }
  }

  private getBufferString(messages: BaseMessage[]): string {
    return messages
      .map((message) => {
        if (message instanceof HumanMessage) {
          return `Human: ${message.content}`;
        } else if (message instanceof AIMessage) {
          return `AI: ${message.content}`;
        }
        return `${message._getType()}: ${message.content}`;
      })
      .join("\n");
  }

  private async trimMemory(): Promise<void> {
    if (!this.maxTokenLimit) return;
    
    try {
      const messages = await this.chatHistory.getMessages();
      let totalTokens = this.estimateTokens(messages);
      
      // Remove oldest messages if we exceed the limit
      while (totalTokens > this.maxTokenLimit && messages.length > 2) {
        messages.shift(); // Remove oldest message
        totalTokens = this.estimateTokens(messages);
      }
      
      // Update chat history with trimmed messages
      await this.chatHistory.clear();
      for (const message of messages) {
        await this.chatHistory.addMessage(message);
      }
    } catch (error) {
      console.error('Error trimming conversation memory:', error);
    }
  }

  private estimateTokens(messages: BaseMessage[]): number {
    // Rough estimate: 1 token ≈ 4 characters
    return messages.reduce((total, message) => {
      return total + Math.ceil((message.content as string).length / 4);
    }, 0);
  }
}
