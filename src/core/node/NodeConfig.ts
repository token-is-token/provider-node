import { NodeConfig } from '@main/config/schema';

export type LLMProvider = 'anthropic' | 'openai' | 'seedance';
export type BlockchainNetwork = 'mainnet' | 'testnet';

export interface NodeConfigOptions extends NodeConfig {
  nodeName: string;
  llm: {
    provider: LLMProvider;
    apiKey: string;
    models: string[];
    maxQuota: number;
  };
  p2p: {
    bootstrapNodes: string[];
    relayEnabled: boolean;
  };
  blockchain: {
    network: BlockchainNetwork;
    privateKey?: string;
  };
  proxy: {
    enabled: boolean;
    port: number;
  };
}
