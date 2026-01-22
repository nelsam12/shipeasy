import type {
  Voyage,
  CreateVoyageDto,
  SearchVoyagesQuery,
  AffectationVoyage,
  ChangeStatutVoyageDto,
  AffecterVoyageDto,
  ApiResponse,
} from "@/types";
import { API_ENDPOINTS, BodyType } from "@/lib/constants";
import { http } from "@/services/http.service";

/**
 * Create a new voyage (GP only)
 */
export function createVoyage(payload: CreateVoyageDto) {
  return http<ApiResponse<Voyage>, CreateVoyageDto>(API_ENDPOINTS.VOYAGES.BASE, {
    method: "POST",
    body: payload,
    bodyType: BodyType.JSON,
  });
}

/**
 * Get all voyages with filters (auth required)
 */
export function getAllVoyages(filters?: SearchVoyagesQuery) {
  const params = new URLSearchParams();

  if (filters?.departureCity) {
    params.append("departureCity", filters.departureCity);
  }
  if (filters?.arrivalCity) {
    params.append("arrivalCity", filters.arrivalCity);
  }
  if (filters?.departureDate) {
    params.append("departureDate", filters.departureDate);
  }
  if (filters?.statut) {
    params.append("statut", filters.statut);
  }
  if (filters?.gpCreateurId) {
    params.append("gpCreateurId", filters.gpCreateurId.toString());
  }
  if (filters?.gpCourantId) {
    params.append("gpCourantId", filters.gpCourantId.toString());
  }

  const queryString = params.toString();
  const url = queryString
    ? `${API_ENDPOINTS.VOYAGES.BASE}?${queryString}`
    : API_ENDPOINTS.VOYAGES.BASE;

  return http<ApiResponse<Voyage[]>, undefined>(url, {
    method: "GET",
  });
}

/**
 * Get a voyage by ID
 */
export function getVoyageById(id: number) {
  return http<ApiResponse<Voyage>, undefined>(API_ENDPOINTS.VOYAGES.BY_ID(id), {
    method: "GET",
  });
}

/**
 * Get voyages created by me (GP only)
 */
export function getMesVoyages() {
  return http<ApiResponse<Voyage[]>, undefined>(API_ENDPOINTS.VOYAGES.MES_VOYAGES, {
    method: "GET",
  });
}

/**
 * Get voyages assigned to me (GP only)
 */
export function getVoyagesQuiMeSontAffectes() {
  return http<ApiResponse<Voyage[]>, undefined>(
    API_ENDPOINTS.VOYAGES.QUI_ME_SONT_AFFECTES,
    {
      method: "GET",
    }
  );
}

/**
 * Search voyages
 */
export function searchVoyages(query: SearchVoyagesQuery) {
  const params = new URLSearchParams();

  if (query.departureCity) {
    params.append("departureCity", query.departureCity);
  }
  if (query.arrivalCity) {
    params.append("arrivalCity", query.arrivalCity);
  }
  if (query.departureDate) {
    params.append("departureDate", query.departureDate);
  }
  if (query.statut) {
    params.append("statut", query.statut);
  }

  const queryString = params.toString();
  const url = queryString
    ? `${API_ENDPOINTS.VOYAGES.SEARCH}?${queryString}`
    : API_ENDPOINTS.VOYAGES.SEARCH;

  return http<ApiResponse<Voyage[]>, undefined>(url, {
    method: "GET",
  });
}

/**
 * Change voyage status (GESTIONNAIRE/ADMIN only)
 */
export function changeStatutVoyage(
  voyageId: number,
  payload: ChangeStatutVoyageDto
) {
  return http<ApiResponse<Voyage>, ChangeStatutVoyageDto>(
    API_ENDPOINTS.VOYAGES.CHANGE_STATUT(voyageId),
    {
      method: "PATCH",
      body: payload,
      bodyType: BodyType.JSON,
    }
  );
}

/**
 * Assign GP to voyage (GESTIONNAIRE/ADMIN only)
 */
export function affecterGpAVoyage(
  voyageId: number,
  payload: AffecterVoyageDto
) {
  return http<ApiResponse<AffectationVoyage>, AffecterVoyageDto>(
    API_ENDPOINTS.VOYAGES.AFFECTATIONS(voyageId),
    {
      method: "POST",
      body: payload,
      bodyType: BodyType.JSON,
    }
  );
}

/**
 * Get assignment history for a voyage
 */
export function getAffectationsVoyage(voyageId: number) {
  return http<ApiResponse<AffectationVoyage[]>, undefined>(
    API_ENDPOINTS.VOYAGES.AFFECTATIONS(voyageId),
    {
      method: "GET",
    }
  );
}
