import { Contract, ethers } from 'ethers';
import { logger } from '@utils/logger';

export interface ContractConfig {
  address: string;
  abi: any[];
}

export class ContractInteraction {
  private contract: Contract | null = null;
  private config: ContractConfig | null = null;

  initialize(config: ContractConfig, signer: any): void {
    logger.info('Initializing contract interaction', { address: config.address });
    this.config = config;
    this.contract = new Contract(config.address, config.abi, signer);
  }

  async call(method: string, ...args: any[]): Promise<any> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    logger.debug('Contract call', { method, args });

    try {
      const result = await this.contract[method](...args);
      return result;
    } catch (error) {
      logger.error('Contract call failed', { method, error });
      throw error;
    }
  }

  async estimateGas(method: string, ...args: any[]): Promise<bigint> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const estimate = await this.contract.estimateGas[method](...args);
      return estimate;
    } catch (error) {
      logger.error('Gas estimate failed', { method, error });
      throw error;
    }
  }

  getContract(): Contract | null {
    return this.contract;
  }
}
