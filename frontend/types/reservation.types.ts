export enum StatutReservation {
  EN_ATTENTE = "EN_ATTENTE",
  CONFIRMEE = "CONFIRMEE",
  EN_TRANSIT = "EN_TRANSIT",
  LIVREE = "LIVREE",
  ANNULEE = "ANNULEE",
}

export interface Reservation {
  id: number;
  clientId: number;
  voyageId: number;
  poidsKg: number;
  description?: string;
  adresseEnlevement?: string;
  adresseLivraison?: string;
  nomDestinataire: string;
  telephoneDestinataire: string;
  statut: StatutReservation;
  montantTotal?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreerReservationDto {
  voyageId: number;
  poidsKg: number;
  description?: string;
  adresseEnlevement?: string;
  adresseLivraison?: string;
  nomDestinataire: string;
  telephoneDestinataire: string;
}
