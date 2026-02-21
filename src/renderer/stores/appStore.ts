import { create } from 'zustand';
import { NodeConfig, defaultConfig } from '@main/config/schema';

export type NodeStatusType = 'stopped' | 'starting' | 'running' | 'error';

export interface NodeStatus {
  status: NodeStatusType;
  uptime: number;
  peers: number;
  requestsProcessed: number;
  totalTokens: number;
  earnings: string;
  lastError?: string;
  startedAt?: Date;
}

export interface Stats {
  totalRequests: number;
  totalTokens: number;
  totalEarnings: string;
}

interface AppState {
  nodeStatus: NodeStatus;
  stats: Stats;
  config: NodeConfig;
  isLoading: boolean;

  setNodeStatus: (status: Partial<NodeStatus>) => void;
  setStats: (stats: Partial<Stats>) => void;
  setConfig: (config: Partial<NodeConfig>) => void;
  setIsLoading: (loading: boolean) => void;

  startNode: () => Promise<void>;
  stopNode: () => Promise<void>;
  updateConfig: (config: Partial<NodeConfig>) => Promise<void>;
}

const initialNodeStatus: NodeStatus = {
  status: 'stopped',
  uptime: 0,
  peers: 0,
  requestsProcessed: 0,
  totalTokens: 0,
  earnings: '0',
};

const initialStats: Stats = {
  totalRequests: 0,
  totalTokens: 0,
  totalEarnings: '0',
};

export const useAppStore = create<AppState>((set, get) => ({
  nodeStatus: initialNodeStatus,
  stats: initialStats,
  config: defaultConfig,
  isLoading: false,

  setNodeStatus: (status) =>
    set((state) => ({
      nodeStatus: { ...state.nodeStatus, ...status },
    })),

  setStats: (stats) =>
    set((state) => ({
      stats: { ...state.stats, ...stats },
    })),

  setConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),

  setIsLoading: (loading) => set({ isLoading: loading }),

  startNode: async () => {
    const { setNodeStatus, setIsLoading } = get();

    setIsLoading(true);
    setNodeStatus({ status: 'starting' });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setNodeStatus({
      status: 'running',
      uptime: 0,
      peers: 5,
      startedAt: new Date(),
    });
    setIsLoading(false);
  },

  stopNode: async () => {
    const { setNodeStatus, setIsLoading } = get();

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setNodeStatus({
      status: 'stopped',
      uptime: 0,
      peers: 0,
      startedAt: undefined,
    });
    setIsLoading(false);
  },

  updateConfig: async (config) => {
    const { setConfig } = get();
    setConfig(config);
  },
}));
