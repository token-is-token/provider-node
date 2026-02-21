import { ethers, providers, Wallet, Contract } from 'ethers';
import { logger } from '@utils/logger';
import { BlockchainNetwork } from '@core/node/NodeConfig';

export interface BlockchainConfig {
  network: BlockchainNetwork;
  privateKey?: string;
}

export interface TransactionReceipt {
  hash: string;
  blockNumber: number;
  status: boolean;
  gasUsed: string;
}

export type MintCallback = (event: MintEvent) => void;

export interface MintEvent {
  to: string;
  amount: string;
  transactionHash: string;
  blockNumber: number;
}

export class BlockchainService {
  private provider: providers.JsonRpcProvider | null = null;
  private wallet: Wallet | null = null;
  private config: BlockchainConfig | null = null;
  private mintCallbacks: Set<MintCallback> = new Set();
  private contract: Contract | null = null;

  private readonly networks = {
    mainnet: 'https://eth-mainnet.g.alchemy.com/v2/demo',
    testnet: 'https://eth-sepolia.g.alchemy.com/v2/demo',
  };

  async initialize(config: BlockchainConfig): Promise<void> {
    logger.info('Initializing blockchain service', { network: config.network });

    this.config = config;

    const rpcUrl = this.networks[config.network];
    this.provider = new providers.JsonRpcProvider(rpcUrl);

    if (config.privateKey) {
      this.wallet = new Wallet(config.privateKey, this.provider);
    }

    logger.info('Blockchain service initialized');
  }

  async connectWallet(): Promise<string> {
    if (!this.provider) {
      throw new Error('Blockchain service not initialized');
    }

    if (!this.wallet) {
      throw new Error('No private key configured');
    }

    const address = await this.wallet.getAddress();
    logger.info('Wallet connected', { address });
    return address;
  }

  async stake(amount: bigint): Promise<TransactionReceipt> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    logger.info('Staking tokens', { amount: amount.toString() });

    const tx = {
      to: '0x0000000000000000000000000000000000000000',
      value: amount,
    };

    const receipt = await this.wallet.sendTransaction(tx);

    logger.info('Stake transaction sent', { hash: receipt.hash });

    const txReceipt = await receipt.wait();

    return {
      hash: txReceipt.transactionHash,
      blockNumber: txReceipt.blockNumber,
      status: txReceipt.status === 1,
      gasUsed: txReceipt.gasUsed.toString(),
    };
  }

  async claimRewards(): Promise<TransactionReceipt> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    logger.info('Claiming rewards');

    const tx = {
      to: '0x0000000000000000000000000000000000000000',
      value: 0n,
    };

    const receipt = await this.wallet.sendTransaction(tx);

    logger.info('Claim rewards transaction sent', { hash: receipt.hash });

    const txReceipt = await receipt.wait();

    return {
      hash: txReceipt.transactionHash,
      blockNumber: txReceipt.blockNumber,
      status: txReceipt.status === 1,
      gasUsed: txReceipt.gasUsed.toString(),
    };
  }

  onMint(callback: MintCallback): void {
    this.mintCallbacks.add(callback);
    logger.info('Mint callback registered');
  }

  removeMintCallback(callback: MintCallback): void {
    this.mintCallbacks.delete(callback);
  }

  getWalletAddress(): string | null {
    return this.wallet?.address ?? null;
  }

  isConnected(): boolean {
    return this.wallet !== null;
  }

  async disconnect(): Promise<void> {
    this.wallet = null;
    logger.info('Wallet disconnected');
  }
}
