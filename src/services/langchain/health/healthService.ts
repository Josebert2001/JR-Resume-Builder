
import { GroqLLM } from '../groqLLM';
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { createGroqChat, isApiKeyValid } from '../core/llmCore';

export const checkLangchainHealth = async (): Promise<{ isHealthy: boolean; errors: string[]; details: Record<string, any> }> => {
  try {
    const hasApiKey = await isApiKeyValid();
    const errors: string[] = [];
    
    if (!hasApiKey) {
      errors.push('Groq API key is not configured or invalid');
    }

    let chainTest = 'failed';
    let memoryTest = 'failed';

    if (hasApiKey) {
      try {
        const chat = await createGroqChat();
        const testResponse = await chat.invoke([
          { role: "user", content: "Say 'OK' if you can read this." }
        ]);
        
        if (testResponse.content && typeof testResponse.content === 'string') {
          chainTest = 'success';
        }
      } catch (error) {
        errors.push(`Chain test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      try {
        // Test memory functionality
        const testMemory = new BufferMemory({
          chatHistory: new ChatMessageHistory(),
          memoryKey: "test_history"
        });
        await testMemory.saveContext({ input: "test" }, { output: "test" });
        memoryTest = 'success';
      } catch (error) {
        errors.push(`Memory test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      isHealthy: errors.length === 0,
      errors,
      details: {
        hasApiKey,
        chainTest,
        memoryTest,
        model: 'mixtral-8x7b-32768',
        provider: 'Groq'
      }
    };
  } catch (error) {
    return {
      isHealthy: false,
      errors: ['Health check failed'],
      details: {
        hasApiKey: false,
        chainTest: 'failed',
        memoryTest: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};
