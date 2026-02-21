import Joi from 'joi';

export const apiKeySchema = Joi.string()
  .min(10)
  .pattern(/^[a-zA-Z0-9-_]+$/)
  .messages({
    'string.pattern.base': 'API key contains invalid characters',
  });

export const addressSchema = Joi.string()
  .pattern(/^0x[a-fA-F0-9]{40}$/)
  .messages({
    'string.pattern.base': 'Invalid Ethereum address format',
  });

export const portSchema = Joi.number()
  .min(1024)
  .max(65535)
  .messages({
    'number.min': 'Port must be at least 1024',
    'number.max': 'Port must be at most 65535',
  });

export const urlSchema = Joi.string()
  .uri({ scheme: ['http', 'https'] })
  .messages({
    'string.uri': 'Invalid URL format',
  });

export function validateApiKey(apiKey: string): boolean {
  const result = apiKeySchema.validate(apiKey);
  return !result.error;
}

export function validateAddress(address: string): boolean {
  const result = addressSchema.validate(address);
  return !result.error;
}

export function validatePort(port: number): boolean {
  const result = portSchema.validate(port);
  return !result.error;
}

export function validateUrl(url: string): boolean {
  const result = urlSchema.validate(url);
  return !result.error;
}
