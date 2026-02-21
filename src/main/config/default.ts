import { NodeConfig, defaultConfig } from './schema';

export function getDefaultConfig(): NodeConfig {
  return { ...defaultConfig };
}
