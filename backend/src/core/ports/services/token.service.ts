/**
 * Token Service Interface (Port)
 * Defines contract for JWT token operations
 */
export interface ITokenService {
  /**
   * Generates a JWT token for a user
   */
  generate(payload: { userId: number; role?: string }): string;

  /**
   * Verifies and decodes a JWT token
   */
  verify(token: string): Promise<{ userId: number; role?: string }>;
}

// Injection token for DI
export const TOKEN_SERVICE = Symbol('ITokenService');
