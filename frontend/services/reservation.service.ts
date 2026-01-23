import type {
  Reservation,
  CreerReservationDto,
  ApiResponse,
} from "@/types";
import { API_ENDPOINTS, BodyType } from "@/lib/constants";
import { http } from "@/services/http.service";

/**
 * Créer une nouvelle réservation (CLIENT uniquement)
 */
export function creerReservation(payload: CreerReservationDto) {
  return http<ApiResponse<Reservation>, CreerReservationDto>(
    API_ENDPOINTS.RESERVATIONS.BASE,
    {
      method: "POST",
      body: payload,
      bodyType: BodyType.JSON,
    }
  );
}

/**
 * Lister mes réservations (CLIENT uniquement)
 */
export function getMesReservations() {
  return http<ApiResponse<Reservation[]>, undefined>(
    API_ENDPOINTS.RESERVATIONS.MES_RESERVATIONS,
    {
      method: "GET",
    }
  );
}

/**
 * Annuler une réservation (CLIENT uniquement)
 */
export function annulerReservation(reservationId: number) {
  return http<ApiResponse<{ id: number; statut: string; updatedAt: string }>, undefined>(
    API_ENDPOINTS.RESERVATIONS.ANNULER(reservationId),
    {
      method: "PATCH",
    }
  );
}
