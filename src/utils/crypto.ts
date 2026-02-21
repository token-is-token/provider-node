import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;

function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, KEY_LENGTH);
}

export function encrypt(text: string, password: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(password, salt);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  const combined = Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')]);
  return combined.toString('base64');
}

export function decrypt(encryptedData: string, password: string): string {
  const combined = Buffer.from(encryptedData, 'base64');

  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  const key = deriveKey(password, salt);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  return `${salt.toString('hex')}:${key.toString('hex')}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  const [saltHex, keyHex] = hash.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const key = Buffer.from(keyHex, 'hex');
  const derivedKey = scryptSync(password, salt, 64);
  return key.equals(derivedKey);
}

export function generateId(): string {
  return randomBytes(16).toString('hex');
}
