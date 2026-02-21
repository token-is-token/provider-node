import Joi from 'joi';

export const nodeConfigSchema = Joi.object({
  nodeName: Joi.string().min(3).max(50).required(),
  llm: Joi.object({
    provider: Joi.string().valid('anthropic', 'openai', 'seedance').required(),
    apiKey: Joi.string().min(10).required(),
    models: Joi.array().items(Joi.string()).min(1).required(),
    maxQuota: Joi.number().min(0).max(1000000).default(10000),
  }).required(),
  p2p: Joi.object({
    bootstrapNodes: Joi.array().items(Joi.string()).default([]),
    relayEnabled: Joi.boolean().default(true),
  }).required(),
  blockchain: Joi.object({
    network: Joi.string().valid('mainnet', 'testnet').default('testnet'),
    privateKey: Joi.string().allow('', null),
  }).required(),
  proxy: Joi.object({
    enabled: Joi.boolean().default(true),
    port: Joi.number().min(1024).max(65535).default(8080),
  }).required(),
});

export type NodeConfig = Joi.InferType<typeof nodeConfigSchema>;

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export const defaultConfig: NodeConfig = {
  nodeName: 'Provider Node',
  llm: {
    provider: 'anthropic',
    apiKey: '',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229'],
    maxQuota: 10000,
  },
  p2p: {
    bootstrapNodes: [],
    relayEnabled: true,
  },
  blockchain: {
    network: 'testnet',
    privateKey: undefined,
  },
  proxy: {
    enabled: true,
    port: 8080,
  },
};
