/**
 * Hash Service Interface (Port)
 * Defines contract for password hashing operations
 */
export interface IHashService {
  /**
   * Hashes a plain text password
   */
  hash(plainText: string): Promise<string>;

  /**
   * Compares a plain text password with a hash
   */
  compare(plainText: string, hash: string): Promise<boolean>;
}

// Injection token for DI
export const HASH_SERVICE = Symbol('IHashService');
