import { logger } from '@utils/logger';

export interface RequestUsage {
  requestId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  provider: string;
  model: string;
  status: 'pending' | 'completed' | 'error';
  error?: string;
}

export class UsageTracker {
  private activeRequests: Map<string, RequestUsage> = new Map();
  private completedRequests: RequestUsage[] = [];
  private maxHistorySize = 1000;

  startTracking(requestId: string): RequestUsage {
    const usage: RequestUsage = {
      requestId,
      startTime: Date.now(),
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      provider: '',
      model: '',
      status: 'pending',
    };

    this.activeRequests.set(requestId, usage);
    logger.debug('Started tracking request', { requestId });

    return usage;
  }

  stopTracking(
    requestId: string,
    data?: {
      inputTokens?: number;
      outputTokens?: number;
      totalTokens?: number;
      provider?: string;
      model?: string;
      error?: string;
    }
  ): void {
    const usage = this.activeRequests.get(requestId);

    if (!usage) {
      logger.warn('No active request found', { requestId });
      return;
    }

    usage.endTime = Date.now();
    usage.duration = usage.endTime - usage.startTime;
    usage.status = data?.error ? 'error' : 'completed';

    if (data) {
      usage.inputTokens = data.inputTokens ?? 0;
      usage.outputTokens = data.outputTokens ?? 0;
      usage.totalTokens = data.totalTokens ?? 0;
      usage.provider = data.provider ?? '';
      usage.model = data.model ?? '';
      usage.error = data.error;
    }

    this.activeRequests.delete(requestId);
    this.completedRequests.push(usage);

    if (this.completedRequests.length > this.maxHistorySize) {
      this.completedRequests.shift();
    }

    logger.debug('Stopped tracking request', { requestId, duration: usage.duration });
  }

  getUsage(): Map<string, RequestUsage> {
    return new Map(this.activeRequests);
  }

  getHistory(): RequestUsage[] {
    return [...this.completedRequests];
  }

  getTotalUsage(): {
    totalRequests: number;
    totalTokens: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    totalDuration: number;
  } {
    const stats = {
      totalRequests: this.completedRequests.length,
      totalTokens: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalDuration: 0,
    };

    for (const usage of this.completedRequests) {
      stats.totalTokens += usage.totalTokens;
      stats.totalInputTokens += usage.inputTokens;
      stats.totalOutputTokens += usage.outputTokens;
      stats.totalDuration += usage.duration ?? 0;
    }

    return stats;
  }

  clearHistory(): void {
    this.completedRequests = [];
    logger.info('Usage history cleared');
  }
}
