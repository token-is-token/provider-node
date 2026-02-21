import { NodeConfig, nodeConfigSchema, defaultConfig } from './schema';
import { logger } from '@utils/logger';
import { encrypt, decrypt } from '@utils/crypto';

const CONFIG_FILE = 'config.json';
const ENCRYPTION_KEY = 'provider-node-secret';

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: NodeConfig | null = null;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async load(): Promise<NodeConfig> {
    try {
      const stored = localStorage.getItem(CONFIG_FILE);
      if (stored) {
        const decrypted = await decrypt(stored, ENCRYPTION_KEY);
        const parsed = JSON.parse(decrypted);
        const validated = nodeConfigSchema.validate(parsed);
        
        if (!validated.error) {
          this.config = validated.value;
          logger.info('Config loaded from storage');
          return this.config;
        }
      }
    } catch (error) {
      logger.warn('Failed to load config, using defaults', error);
    }

    this.config = { ...defaultConfig };
    return this.config;
  }

  async save(config: NodeConfig): Promise<void> {
    const validated = nodeConfigSchema.validate(config);
    
    if (validated.error) {
      const errors = validated.error.details.map((d) => d.message);
      throw new Error(`Invalid config: ${errors.join(', ')}`);
    }

    const encrypted = await encrypt(JSON.stringify(validated.value), ENCRYPTION_KEY);
    localStorage.setItem(CONFIG_FILE, encrypted);
    
    this.config = validated.value;
    logger.info('Config saved');
  }

  validate(config: Partial<NodeConfig>): ValidationResult {
    const result = nodeConfigSchema.validate(config, { abortEarly: false });
    
    if (!result.error) {
      return { valid: true };
    }

    return {
      valid: false,
      errors: result.error.details.map((d) => d.message),
    };
  }

  async encryptData(data: string): Promise<string> {
    return encrypt(data, ENCRYPTION_KEY);
  }

  async decryptData(data: string): Promise<string> {
    return decrypt(data, ENCRYPTION_KEY);
  }

  getConfig(): NodeConfig {
    return this.config ?? { ...defaultConfig };
  }

  reset(): void {
    localStorage.removeItem(CONFIG_FILE);
    this.config = { ...defaultConfig };
    logger.info('Config reset to defaults');
  }
}
