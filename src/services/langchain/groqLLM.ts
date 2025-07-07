
import { LLM, BaseLLMParams } from "@langchain/core/language_models/llms";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { Groq } from "groq-sdk";

export interface GroqLLMParams extends BaseLLMParams {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class GroqLLM extends LLM {
  private groq: Groq;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(fields: GroqLLMParams = {}) {
    super(fields);
    
    // Get API key from environment variable
    const apiKey = fields.apiKey || import.meta.env.VITE_GROQ_API_KEY || '';

    if (!apiKey) {
      console.warn('No Groq API key found in environment variables.');
    }
    
    this.groq = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    
    this.model = fields.model || "llama3-8b-8192";
    this.temperature = fields.temperature || 0.7;
    this.maxTokens = fields.maxTokens || 1024;
  }

  _llmType(): string {
    return "groq";
  }

  async _call(
    prompt: string,
    options?: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): Promise<string> {
    try {
      console.log('GroqLLM: Making API call with model:', this.model);
      
      // Check if API key is available from environment
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('Groq API key not configured in environment variables.');
      }

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: this.model,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        stop: options?.stop,
      });

      const response = completion.choices[0]?.message?.content || '';
      console.log('GroqLLM: Successfully received response');
      
      return response;
    } catch (error) {
      console.error('GroqLLM: Error calling Groq API:', error);
      
      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          throw new Error('Invalid Groq API key. Please check your API key configuration.');
        } else if (error.message.includes('429')) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
      }
      
      throw new Error(`Groq API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
