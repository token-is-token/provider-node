import { describe, it, expect, beforeEach } from 'vitest';
import { validateApiKey, validateAddress, validatePort, validateUrl } from '../../src/utils/validators';

describe('Validators', () => {
  describe('validateApiKey', () => {
    it('should validate correct API keys', () => {
      expect(validateApiKey('sk-1234567890abcdef')).toBe(true);
    });

    it('should reject short API keys', () => {
      expect(validateApiKey('short')).toBe(false);
    });
  });

  describe('validateAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      expect(validateAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(validateAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44')).toBe(false);
    });
  });

  describe('validatePort', () => {
    it('should validate ports in range', () => {
      expect(validatePort(8080)).toBe(true);
    });

    it('should reject privileged ports', () => {
      expect(validatePort(80)).toBe(false);
    });
  });
});
