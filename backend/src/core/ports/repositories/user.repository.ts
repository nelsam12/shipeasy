import { User } from '../../domain/entities/user.entity';

/**
 * User Repository Interface (Port)
 * Defines contract for user data access
 */
export interface IUserRepository {
  /**
   * Finds a user by ID
   */
  findById(id: number): Promise<User | null>;

  /**
   * Finds a user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Finds a user by email including password
   */
  findByEmailWithPassword(email: string): Promise<User | null>;

  /**
   * Finds all users
   */
  findAll(): Promise<User[]>;

  /**
   * Saves a user (create or update)
   */
  save(user: User): Promise<User>;

  /**
   * Deletes a user by ID
   */
  delete(id: number): Promise<void>;

  /**
   * Checks if a user exists by email
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Updates a user
   */
  update(id: number, data: Partial<User>): Promise<User>;
}

// Injection token for DI
export const USER_REPOSITORY = Symbol('IUserRepository');
