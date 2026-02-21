import axios, { AxiosInstance } from 'axios';
import { LLMAdapterInterface, LLMRequest, LLMResponse, UsageStats } from '../LLMAdapter';
import { logger } from '@utils/logger';

export class SeedanceAdapter implements LLMAdapterInterface {
  readonly name = 'seedance';
  readonly supportedModels = [
    'seedance-large',
    'seedance-medium',
    'seedance-small',
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
      baseURL: 'https://api.seedance.io/v1',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await this.client.get('/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        validateStatus: () => true,
      });
      return response.status === 200;
    } catch (error) {
      logger.error('Failed to validate Seedance API key', error);
      return false;
    }
  }

  async forwardRequest(request: LLMRequest): Promise<LLMResponse> {
    try {
      const response = await this.client.post('/chat/completions', {
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        stream: false,
      });

      const data = response.data;
      const choice = data.choices[0];
      this.updateUsage(data.usage);

      return {
        id: data.id,
        model: data.model,
        content: choice?.message?.content ?? '',
        usage: {
          inputTokens: data.usage?.prompt_tokens ?? 0,
          outputTokens: data.usage?.completion_tokens ?? 0,
          totalTokens: data.usage?.total_tokens ?? 0,
        },
        finishReason: choice?.finish_reason ?? null,
      };
    } catch (error) {
      logger.error('Seedance API request failed', error);
      throw error;
    }
  }

  async getUsage(): Promise<UsageStats> {
    return { ...this.usage };
  }

  private updateUsage(usage: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  }): void {
    this.usage.totalRequests++;
    this.usage.totalInputTokens += usage.prompt_tokens ?? 0;
    this.usage.totalOutputTokens += usage.completion_tokens ?? 0;
    this.usage.totalTokens += usage.total_tokens ?? 0;
  }
}
