import { StatutReservation } from '../enums/statut-reservation.enum';

/**
 * Entité domaine Reservation
 * Représente une réservation de colis effectuée par un client
 */
export class Reservation {
  constructor(
    public readonly id: number | undefined,
    public readonly clientId: number,
    public readonly voyageId: number,
    public readonly poidsKg: number,
    public readonly description: string | undefined,
    public readonly adresseEnlevement: string | undefined,
    public readonly adresseLivraison: string | undefined,
    public readonly nomDestinataire: string,
    public readonly telephoneDestinataire: string,
    public readonly statut: StatutReservation = StatutReservation.EN_ATTENTE,
    public readonly montantTotal?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    this.validerReservation();
  }

  /**
   * Valide les règles métier de la réservation
   */
  private validerReservation(): void {
    if (this.poidsKg <= 0) {
      throw new Error('Le poids doit être supérieur à 0 kg');
    }

    if (this.poidsKg > 1000) {
      throw new Error('Le poids ne peut pas dépasser 1000 kg');
    }

    if (!this.nomDestinataire || this.nomDestinataire.trim().length === 0) {
      throw new Error('Le nom du destinataire est obligatoire');
    }

    if (!this.telephoneDestinataire || this.telephoneDestinataire.trim().length === 0) {
      throw new Error('Le téléphone du destinataire est obligatoire');
    }

    if (this.montantTotal !== undefined && this.montantTotal < 0) {
      throw new Error('Le montant total ne peut pas être négatif');
    }
  }

  /**
   * Vérifie si la réservation peut être annulée
   */
  peutEtreAnnulee(): boolean {
    return (
      this.statut === StatutReservation.EN_ATTENTE ||
      this.statut === StatutReservation.CONFIRMEE
    );
  }

  /**
   * Annule la réservation
   */
  annuler(): Reservation {
    if (!this.peutEtreAnnulee()) {
      throw new Error(
        'La réservation ne peut pas être annulée dans son état actuel',
      );
    }

    return new Reservation(
      this.id,
      this.clientId,
      this.voyageId,
      this.poidsKg,
      this.description,
      this.adresseEnlevement,
      this.adresseLivraison,
      this.nomDestinataire,
      this.telephoneDestinataire,
      StatutReservation.ANNULEE,
      this.montantTotal,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Confirme la réservation
   */
  confirmer(): Reservation {
    if (this.statut !== StatutReservation.EN_ATTENTE) {
      throw new Error('Seules les réservations en attente peuvent être confirmées');
    }

    return new Reservation(
      this.id,
      this.clientId,
      this.voyageId,
      this.poidsKg,
      this.description,
      this.adresseEnlevement,
      this.adresseLivraison,
      this.nomDestinataire,
      this.telephoneDestinataire,
      StatutReservation.CONFIRMEE,
      this.montantTotal,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Marque la réservation comme en transit
   */
  mettreEnTransit(): Reservation {
    if (this.statut !== StatutReservation.CONFIRMEE) {
      throw new Error(
        'Seules les réservations confirmées peuvent être mises en transit',
      );
    }

    return new Reservation(
      this.id,
      this.clientId,
      this.voyageId,
      this.poidsKg,
      this.description,
      this.adresseEnlevement,
      this.adresseLivraison,
      this.nomDestinataire,
      this.telephoneDestinataire,
      StatutReservation.EN_TRANSIT,
      this.montantTotal,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Marque la réservation comme livrée
   */
  marquerCommeLivree(): Reservation {
    if (this.statut !== StatutReservation.EN_TRANSIT) {
      throw new Error(
        'Seules les réservations en transit peuvent être marquées comme livrées',
      );
    }

    return new Reservation(
      this.id,
      this.clientId,
      this.voyageId,
      this.poidsKg,
      this.description,
      this.adresseEnlevement,
      this.adresseLivraison,
      this.nomDestinataire,
      this.telephoneDestinataire,
      StatutReservation.LIVREE,
      this.montantTotal,
      this.createdAt,
      new Date(),
    );
  }
}
