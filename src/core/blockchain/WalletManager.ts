import { ethers, providers, Wallet } from 'ethers';
import { logger } from '@utils/logger';
import { generateId } from '@utils/crypto';

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
}

export class WalletManager {
  private wallet: Wallet | null = null;
  private provider: providers.JsonRpcProvider | null = null;

  async createWallet(): Promise<WalletInfo> {
    const newWallet = Wallet.createRandom();
    this.wallet = newWallet;

    logger.info('New wallet created', { address: newWallet.address });

    return {
      address: newWallet.address,
      balance: '0',
      network: 'unknown',
    };
  }

  async importWallet(privateKey: string): Promise<WalletInfo> {
    this.wallet = new Wallet(privateKey);

    logger.info('Wallet imported', { address: this.wallet.address });

    return {
      address: this.wallet.address,
      balance: '0',
      network: 'unknown',
    };
  }

  async connect(provider: providers.JsonRpcProvider): Promise<WalletInfo> {
    if (!this.wallet) {
      throw new Error('No wallet available');
    }

    this.provider = provider;
    const balance = await this.provider.getBalance(this.wallet.address);

    return {
      address: this.wallet.address,
      balance: ethers.formatEther(balance),
      network: (await this.provider.getNetwork()).chainId.toString(),
    };
  }

  getAddress(): string | null {
    return this.wallet?.address ?? null;
  }

  signMessage(message: string): Promise<string> {
    if (!this.wallet) {
      throw new Error('No wallet available');
    }
    return this.wallet.signMessage(message);
  }

  async disconnect(): Promise<void> {
    this.wallet = null;
    this.provider = null;
    logger.info('Wallet disconnected');
  }
}
