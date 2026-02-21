import { Request } from 'express';
import { LLMRequest, LLMResponse } from '@core/llm/LLMAdapter';
import { AnthropicAdapter } from '@core/llm/adapters/AnthropicAdapter';
import { OpenAIAdapter } from '@core/llm/adapters/OpenAIAdapter';
import { SeedanceAdapter } from '@core/llm/adapters/SeedanceAdapter';
import { logger } from '@utils/logger';

export interface LLMResponseData {
  id: string;
  model: string;
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  finishReason: string | null;
}

export class RequestHandler {
  private adapters: Map<string, any> = new Map();

  registerAdapter(provider: string, adapter: any): void {
    this.adapters.set(provider, adapter);
    logger.info('Registered LLM adapter', { provider });
  }

  async handle(req: Request): Promise<LLMResponseData> {
    const { provider, model, messages, temperature, maxTokens } = req.body;

    if (!provider || !model || !messages) {
      throw new Error('Missing required fields: provider, model, messages');
    }

    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    const request: LLMRequest = {
      model,
      messages,
      temperature,
      maxTokens,
    };

    logger.info('Forwarding LLM request', { provider, model });

    const response: LLMResponse = await adapter.forwardRequest(request);

    return {
      id: response.id,
      model: response.model,
      content: response.content,
      usage: response.usage,
      finishReason: response.finishReason,
    };
  }
}
