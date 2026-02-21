import axios, { AxiosInstance } from 'axios';
import { LLMAdapterInterface, LLMRequest, LLMResponse, UsageStats } from '../LLMAdapter';
import { logger } from '@utils/logger';

export class AnthropicAdapter implements LLMAdapterInterface {
  readonly name = 'anthropic';
  readonly supportedModels = [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-2.1',
    'claude-2.0',
    'claude-instant-20240307',
  ];

  private apiKey: string;
  private client: AxiosInstance;
  private usage: UsageStats = {
    totalRequests: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalTokens: 0,
    cost: 0,
  };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.anthropic.com/v1',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
    });
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await this.client.post(
        '/messages',
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'test' }],
        },
        { validateStatus: () => true }
      );
      return response.status === 200;
    } catch (error) {
      logger.error('Failed to validate Anthropic API key', error);
      return false;
    }
  }

  async forwardRequest(request: LLMRequest): Promise<LLMResponse> {
    try {
      const response = await this.client.post('/messages', {
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens ?? 4096,
        stream: false,
      });

      const data = response.data;
      this.updateUsage(data.usage);

      return {
        id: data.id,
        model: data.model,
        content: data.content[0]?.text ?? '',
        usage: {
          inputTokens: data.usage.input_tokens,
          outputTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        },
        finishReason: data.stop_reason === 'end_turn' ? 'stop' : null,
      };
    } catch (error) {
      logger.error('Anthropic API request failed', error);
      throw error;
    }
  }

  async getUsage(): Promise<UsageStats> {
    return { ...this.usage };
  }

  private updateUsage(usage: { input_tokens: number; output_tokens: number }): void {
    this.usage.totalRequests++;
    this.usage.totalInputTokens += usage.input_tokens;
    this.usage.totalOutputTokens += usage.output_tokens;
    this.usage.totalTokens += usage.input_tokens + usage.output_tokens;
  }
}
