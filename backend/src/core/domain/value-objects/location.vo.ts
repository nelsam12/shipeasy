/**
 * Location Value Object
 * Represents a geographic location with city, country, and flag
 */
export class Location {
  private constructor(
    public readonly city: string,
    public readonly country: string,
    public readonly flag: string,
  ) {}

  /**
   * Creates a new Location instance
   */
  static create(city: string, country: string, flag: string): Location {
    if (!city || city.trim().length === 0) {
      throw new Error('City cannot be empty');
    }

    if (!country || country.trim().length === 0) {
      throw new Error('Country cannot be empty');
    }

    if (!flag || flag.trim().length === 0) {
      throw new Error('Flag cannot be empty');
    }

    return new Location(city.trim(), country.trim(), flag.trim());
  }

  /**
   * Returns the full location as a string
   */
  toString(): string {
    return `${this.city}, ${this.country} ${this.flag}`;
  }

  /**
   * Checks if two locations are equal
   */
  equals(other: Location): boolean {
    return (
      this.city === other.city &&
      this.country === other.country &&
      this.flag === other.flag
    );
  }
}
