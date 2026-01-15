import { Role } from '../enums/role.enum';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { Phone } from '../value-objects/phone.vo';

/**
 * User Domain Entity (Pure business logic, no ORM decorators)
 * Represents a user in the business domain
 */
export class User {
  constructor(
    public readonly id: number | undefined,
    public readonly email: Email,
    public readonly fullName: string,
    public readonly role: Role,
    private _password?: Password,
    public readonly phone?: Phone,
    public readonly companyName?: string,
    public readonly address?: string,
    public readonly description?: string,
    public readonly isApproved: boolean = false,
  ) {}

  /**
   * Sets the user's password (hashed)
   */
  setPassword(hashedPassword: string): void {
    this._password = Password.fromHashed(hashedPassword);
  }

  /**
   * Gets the password value (for authentication)
   */
  getPasswordValue(): string | undefined {
    return this._password?.value;
  }

  /**
   * Checks if user has a specific role
   */
  hasRole(role: Role): boolean {
    return this.role === role;
  }

  /**
   * Checks if user is approved
   */
  isUserApproved(): boolean {
    return this.isApproved;
  }

  /**
   * Checks if user is a GP (Gestionnaire de Point)
   */
  isGP(): boolean {
    return this.role === Role.GP;
  }

  /**
   * Checks if user is an admin
   */
  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }
}
