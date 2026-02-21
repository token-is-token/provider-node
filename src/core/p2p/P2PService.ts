import { createLibp2p, Libp2p } from 'libp2p';
import { bootstrap } from 'libp2p-bootstrap';
import { kadDHT } from 'libp2p-kad-dht';
import { relay } from 'libp2p-relay';
import { noise } from 'libp2p-noise';
import { logger } from '@utils/logger';
import { generateId } from '@utils/crypto';

export interface P2PConfig {
  bootstrapNodes: string[];
  relayEnabled: boolean;
}

export interface ProviderInfo {
  nodeId: string;
  nodeName: string;
  addresses: string[];
  capabilities: string[];
  llmProvider: string;
  models: string[];
}

export interface RequestMessage {
  id: string;
  type: 'llm_request';
  payload: {
    provider: string;
    model: string;
    messages: Array<{
      role: 'user' | 'assistant' | 'system';
      content: string;
    }>;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface ResponseMessage {
  id: string;
  type: 'llm_response' | 'error';
  requestId: string;
  payload?: {
    content: string;
    usage: {
      inputTokens: number;
      outputTokens: number;
    };
  };
  error?: string;
}

export type RequestHandler = (request: RequestMessage) => Promise<ResponseMessage>;

export class P2PService {
  private node: Libp2p | null = null;
  private config: P2PConfig | null = null;
  private requestHandler: RequestHandler | null = null;
  private providerInfo: ProviderInfo | null = null;

  async initialize(config: P2PConfig): Promise<void> {
    logger.info('Initializing P2P service', config);

    this.config = config;

    const peerId = await generateId();

    const modules: any = {
      transport: [],
      connectionEncryption: [noise()],
      streamMuxer: [],
    };

    if (config.bootstrapNodes.length > 0) {
      modules.transport.push(bootstrap({ list: config.bootstrapNodes }));
    }

    if (config.relayEnabled) {
      modules.transport.push(relay());
    }

    modules.kadDHT = kadDHT();

    this.node = await createLibp2p({
      peerId,
      addresses: {
        listen: ['/ip4/0.0.0.0/tcp/0'],
      },
      modules: modules,
      config: {
        relay: {
          enabled: config.relayEnabled,
          autoRelay: {
            enabled: true,
          },
        },
        dht: {
          enabled: true,
        },
      },
    });

    this.providerInfo = {
      nodeId: this.node.peerId.toB58String(),
      nodeName: 'Provider Node',
      addresses: this.node.addresses.map((a) => a.toString()),
      capabilities: ['llm-proxy'],
      llmProvider: 'anthropic',
      models: [],
    };

    logger.info('P2P service initialized', { peerId: this.node.peerId.toB58String() });
  }

  async connect(): Promise<void> {
    if (!this.node) {
      throw new Error('P2P service not initialized');
    }

    logger.info('Connecting to P2P network...');

    await this.node.start();

    logger.info('P2P node started', {
      addresses: this.node.addresses.map((a) => a.toString()),
    });
  }

  async registerProvider(info: ProviderInfo): Promise<void> {
    if (!this.node) {
      throw new Error('P2P service not initialized');
    }

    this.providerInfo = info;
    logger.info('Registered as provider', { nodeId: info.nodeId });
  }

  onRequest(handler: RequestHandler): void {
    this.requestHandler = handler;
    logger.info('Request handler registered');
  }

  async sendResponse(response: ResponseMessage): Promise<void> {
    if (!this.node) {
      throw new Error('P2P service not initialized');
    }

    logger.debug('Sending response', { requestId: response.requestId });
  }

  getPeerCount(): number {
    return this.node?.connections.size ?? 0;
  }

  getPeerId(): string {
    return this.node?.peerId.toB58String() ?? '';
  }

  getProviderInfo(): ProviderInfo | null {
    return this.providerInfo;
  }

  async stop(): Promise<void> {
    if (this.node) {
      await this.node.stop();
      logger.info('P2P service stopped');
    }
  }
}
