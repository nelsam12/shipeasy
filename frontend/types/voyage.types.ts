import { Location } from "./trip.types";

export enum StatutVoyage {
  BROUILLON = "BROUILLON",
  PUBLIE = "PUBLIE",
  AFFECTE = "AFFECTE",
  ANNULE = "ANNULE",
  TERMINE = "TERMINE",
}

export interface Voyage {
  id: number;
  gpCreateurId: number;
  gpCourantId: number | null;
  departureLocation: Location;
  arrivalLocation: Location;
  departureDate: string;
  availableKilos: number;
  pricePerKg?: number;
  description?: string;
  statut: StatutVoyage;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoyageDto {
  departureLocation: Location;
  arrivalLocation: Location;
  departureDate: string;
  availableKilos: number;
  pricePerKg?: number;
  description?: string;
}

export interface AffectationVoyage {
  id: number;
  voyageId: number;
  gpId: number;
  note?: string;
  createdAt: string;
}

export interface ChangeStatutVoyageDto {
  statut: StatutVoyage;
}

export interface AffecterVoyageDto {
  gpId: number;
  note?: string;
}

export interface SearchVoyagesQuery {
  departureCity?: string;
  arrivalCity?: string;
  departureDate?: string;
  statut?: StatutVoyage;
  gpCreateurId?: number;
  gpCourantId?: number;
}
