export interface LLMRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  id: string;
  model: string;
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter' | null;
}

export interface UsageStats {
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  cost: number;
}

export interface LLMAdapterInterface {
  readonly name: string;
  readonly supportedModels: string[];

  validateApiKey(apiKey: string): Promise<boolean>;
  forwardRequest(request: LLMRequest): Promise<LLMResponse>;
  getUsage(): Promise<UsageStats>;
}
