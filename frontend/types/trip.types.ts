export interface Location {
    city: string;
    country: string;
    flag: string;
}

export enum TripStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface Trip {
    id: number;
    gpId: number;
    departureLocation: Location;
    arrivalLocation: Location;
    departureDate: string;
    availableKilos: number;
    pricePerKg?:  number;
    description?:  string;
    status: TripStatus;
    createdAt:  string;
    updatedAt:  string;
}

export interface CreateTripDto {
    departureLocation: Location;
    arrivalLocation: Location;
    departureDate: string;
    availableKilos: number;
    pricePerKg?: number;
    description?: string;
}

export interface SearchTripsQuery {
    departureCity?: string;
    arrivalCity?: string;
    departureDate?: string;
}