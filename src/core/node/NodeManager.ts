import { logger } from '@utils/logger';
import { NodeStatus, createInitialStatus, calculateUptime } from './NodeStatus';
import { NodeConfigOptions } from './NodeConfig';
import { P2PService } from '@core/p2p/P2PService';
import { BlockchainService } from '@core/blockchain/BlockchainService';
import { ProxyServer } from '@core/proxy/ProxyServer';

export class NodeManager {
  private static instance: NodeManager;
  private status: NodeStatus;
  private config: NodeConfigOptions | null = null;
  private p2pService: P2PService | null = null;
  private blockchainService: BlockchainService | null = null;
  private proxyServer: ProxyServer | null = null;
  private startedAt: Date | null = null;
  private statusUpdateCallbacks: Set<(status: NodeStatus) => void>;

  private constructor() {
    this.status = createInitialStatus();
    this.statusUpdateCallbacks = new Set();
  }

  static getInstance(): NodeManager {
    if (!NodeManager.instance) {
      NodeManager.instance = new NodeManager();
    }
    return NodeManager.instance;
  }

  async initialize(config: NodeConfigOptions): Promise<void> {
    logger.info('Initializing NodeManager', { nodeName: config.nodeName });
    this.config = config;
    this.updateStatus({ status: 'stopped' });
    logger.info('NodeManager initialized');
  }

  async start(): Promise<void> {
    if (!this.config) {
      throw new Error('Node not initialized');
    }

    if (this.status.status === 'running') {
      logger.warn('Node already running');
      return;
    }

    logger.info('Starting node...');
    this.updateStatus({ status: 'starting' });

    try {
      this.p2pService = new P2PService();
      await this.p2pService.initialize({
        bootstrapNodes: this.config.p2p.bootstrapNodes,
        relayEnabled: this.config.p2p.relayEnabled,
      });
      await this.p2pService.connect();

      this.blockchainService = new BlockchainService();
      await this.blockchainService.initialize(this.config.blockchain);

      if (this.config.proxy.enabled) {
        this.proxyServer = new ProxyServer();
        await this.proxyServer.start(this.config.proxy.port);
      }

      this.startedAt = new Date();
      this.updateStatus({
        status: 'running',
        startedAt: this.startedAt,
        peers: 0,
      });

      this.startStatusMonitor();
      logger.info('Node started successfully');
    } catch (error) {
      logger.error('Failed to start node', error);
      this.updateStatus({
        status: 'error',
        lastError: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async stop(): Promise<void> {
    logger.info('Stopping node...');

    try {
      if (this.proxyServer) {
        await this.proxyServer.stop();
        this.proxyServer = null;
      }

      if (this.p2pService) {
        await this.p2pService.stop();
        this.p2pService = null;
      }

      this.blockchainService = null;
      this.startedAt = null;

      this.updateStatus({ status: 'stopped' });
      logger.info('Node stopped successfully');
    } catch (error) {
      logger.error('Error stopping node', error);
      throw error;
    }
  }

  getStatus(): NodeStatus {
    return { ...this.status };
  }

  async updateConfig(config: Partial<NodeConfigOptions>): Promise<void> {
    if (!this.config) {
      throw new Error('Node not initialized');
    }

    logger.info('Updating node config', { changes: Object.keys(config) });
    this.config = { ...this.config, ...config };

    if (this.status.status === 'running') {
      if (config.proxy?.enabled !== undefined || config.proxy?.port !== undefined) {
        if (this.proxyServer) {
          await this.proxyServer.stop();
        }
        if (this.config.proxy.enabled) {
          this.proxyServer = new ProxyServer();
          await this.proxyServer.start(this.config.proxy.port);
        }
      }
    }

    logger.info('Node config updated');
  }

  onStatusUpdate(callback: (status: NodeStatus) => void): () => void {
    this.statusUpdateCallbacks.add(callback);
    return () => this.statusUpdateCallbacks.delete(callback);
  }

  private updateStatus(partial: Partial<NodeStatus>): void {
    this.status = { ...this.status, ...partial };
    this.notifyStatusUpdate();
  }

  private notifyStatusUpdate(): void {
    const currentStatus = this.getStatus();
    this.statusUpdateCallbacks.forEach((callback) => callback(currentStatus));
  }

  private startStatusMonitor(): void {
    setInterval(() => {
      if (this.status.status === 'running' && this.startedAt) {
        this.updateStatus({
          uptime: calculateUptime(this.startedAt),
          peers: this.p2pService?.getPeerCount() ?? 0,
        });
      }
    }, 5000);
  }
}
