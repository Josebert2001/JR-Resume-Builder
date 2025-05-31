
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
    
    this.groq = new Groq({
      apiKey: fields.apiKey || import.meta.env.VITE_GROQ_API_KEY || '',
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
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: this.model,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        stop: options?.stop,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error calling Groq LLM:', error);
      throw error;
    }
  }
}
