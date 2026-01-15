import { BadRequestException } from '@nestjs/common';

/**
 * Phone Value Object
 * Ensures phone number validity and immutability
 */
export class Phone {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a Phone value object with validation
   * @param value - The phone number string to validate
   * @throws BadRequestException if phone is invalid
   */
  static create(value: string): Phone {
    if (!this.isValid(value)) {
      throw new BadRequestException('Numéro de téléphone invalide');
    }
    return new Phone(value.trim());
  }

  /**
   * Validates phone number format (basic validation)
   */
  private static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }
    // Basic phone validation - at least 10 digits with optional + and spaces
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(value);
  }

  /**
   * Returns the phone value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another Phone
   */
  equals(other: Phone): boolean {
    return this._value === other._value;
  }
}
