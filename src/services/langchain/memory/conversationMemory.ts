
import { BaseMemory } from "@langchain/core/memory";
import { InputValues, MemoryVariables, OutputValues } from "@langchain/core/memory";
import { BaseChatMessageHistory } from "@langchain/core/chat_history";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export interface ConversationMemoryParams {
  returnMessages?: boolean;
  inputKey?: string;
  outputKey?: string;
  memoryKey?: string;
  maxTokenLimit?: number;
}

export class ConversationMemory extends BaseMemory {
  chatHistory: BaseChatMessageHistory;
  returnMessages: boolean;
  inputKey: string;
  outputKey: string;
  memoryKey: string;
  maxTokenLimit?: number;

  constructor(params: ConversationMemoryParams = {}) {
    super();
    this.chatHistory = new BaseChatMessageHistory();
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
    const input = inputValues[this.inputKey];
    const output = outputValues[this.outputKey];

    await this.chatHistory.addUserMessage(input);
    await this.chatHistory.addAIMessage(output);
    
    // Trim memory if it exceeds token limit
    if (this.maxTokenLimit) {
      await this.trimMemory();
    }
  }

  async clear(): Promise<void> {
    await this.chatHistory.clear();
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
      if (message instanceof HumanMessage) {
        await this.chatHistory.addUserMessage(message.content as string);
      } else if (message instanceof AIMessage) {
        await this.chatHistory.addAIMessage(message.content as string);
      }
    }
  }

  private estimateTokens(messages: BaseMessage[]): number {
    // Rough estimate: 1 token ≈ 4 characters
    return messages.reduce((total, message) => {
      return total + Math.ceil((message.content as string).length / 4);
    }, 0);
  }
}
