import { BadRequestException } from '@nestjs/common';

/**
 * Email Value Object
 * Ensures email validity and immutability
 */
export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an Email value object with validation
   * @param value - The email string to validate
   * @throws BadRequestException if email is invalid
   */
  static create(value: string): Email {
    if (!this.isValid(value)) {
      throw new BadRequestException('Email invalide');
    }
    return new Email(value.toLowerCase().trim());
  }

  /**
   * Validates email format
   */
  private static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  /**
   * Returns the email value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another Email
   */
  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
