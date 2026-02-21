export type NodeStatusType = 'stopped' | 'starting' | 'running' | 'error';

export interface NodeStatus {
  status: NodeStatusType;
  uptime?: number;
  peers: number;
  requestsProcessed: number;
  totalTokens: number;
  earnings: string;
  lastError?: string;
  startedAt?: Date;
}

export function createInitialStatus(): NodeStatus {
  return {
    status: 'stopped',
    uptime: 0,
    peers: 0,
    requestsProcessed: 0,
    totalTokens: 0,
    earnings: '0',
  };
}

export function calculateUptime(startedAt: Date): number {
  return Math.floor((Date.now() - startedAt.getTime()) / 1000);
}
