import { BadRequestException } from '@nestjs/common';

/**
 * Password Value Object
 * Ensures password strength and immutability
 */
export class Password {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a Password value object with validation
   * @param value - The password string to validate
   * @throws BadRequestException if password is invalid
   */
  static create(value: string): Password {
    if (!this.isValid(value)) {
      throw new BadRequestException(
        'Le mot de passe doit faire au moins 6 caractères',
      );
    }
    return new Password(value);
  }

  /**
   * Creates a Password from an already hashed value (for loading from DB)
   */
  static fromHashed(hashedValue: string): Password {
    return new Password(hashedValue);
  }

  /**
   * Validates password strength
   */
  private static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }
    return value.length >= 6;
  }

  /**
   * Returns the password value
   */
  get value(): string {
    return this._value;
  }
}
