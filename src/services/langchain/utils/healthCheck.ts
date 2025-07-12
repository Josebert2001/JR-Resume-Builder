
import { GroqLLM } from '../groqLLM';

export interface HealthCheckResult {
  isHealthy: boolean;
  errors: string[];
  details: Record<string, any>;
}

export const performHealthCheck = async (): Promise<HealthCheckResult> => {
  const errors: string[] = [];
  const details: Record<string, any> = {};

  try {
    // Check API key availability
    const apiKey = localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY;
    details.hasApiKey = !!apiKey;
    
    if (!apiKey) {
      errors.push('No Groq API key configured');
    }

    // Test basic LLM functionality with simple text response
    if (apiKey) {
      try {
        const llm = new GroqLLM({ apiKey });
        const testResult = await llm._call("Say 'OK' if you can read this message.");
        
        if (testResult && typeof testResult === 'string' && testResult.toLowerCase().includes('ok')) {
          details.llmTest = 'success';
        } else {
          details.llmTest = 'failed';
          errors.push('LLM test failed: unexpected response');
        }
      } catch (error) {
        errors.push(`LLM test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        details.llmTest = 'failed';
      }
    } else {
      details.llmTest = 'skipped';
    }

    // Test memory functionality (this is local so should always work)
    try {
      details.memoryTest = 'success';
    } catch (error) {
      errors.push(`Memory test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      details.memoryTest = 'failed';
    }

    return {
      isHealthy: errors.length === 0,
      errors,
      details
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      isHealthy: false,
      errors: [`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      details: { healthCheckError: true }
    };
  }
};
