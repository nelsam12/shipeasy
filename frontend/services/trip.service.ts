import type {
    Trip,
    CreateTripDto,
    SearchTripsQuery,
    ApiResponse,
} from "@/types";
import { API_ENDPOINTS, BodyType } from "@/lib/constants";
import {http} from "@/services/http.service";

/**
 * Create a new trips (GP only)
 */
export function createTrip(payload: CreateTripDto) {
    return http<ApiResponse<Trip>, CreateTripDto>(API_ENDPOINTS.TRIPS.BASE, {
        method: "POST",
        body: payload,
        bodyType: BodyType.JSON,
    });
}

/**
 * Get all trips
 */
export function getAllTrips() {
    return http<ApiResponse<Trip[]>, undefined>(API_ENDPOINTS.TRIPS.BASE, {
        method: "GET",
    });
}

/**
 * Get all active trips
 */
export function getActiveTrips() {
    return http<ApiResponse<Trip[]>, undefined>(API_ENDPOINTS.TRIPS. ACTIVE, {
        method: "GET",
    });
}

/**
 * Search trips
 */
export function searchTrips(query: SearchTripsQuery) {
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

    const queryString = params.toString();
    const url = queryString
        ? `${API_ENDPOINTS.TRIPS.SEARCH}? ${queryString}`
        : API_ENDPOINTS.TRIPS. SEARCH;

    return http<ApiResponse<Trip[]>, undefined>(url, {
        method: "GET",
    });
}

/**
 * Get my trips (GP only)
 */
export function getMyTrips() {
    return http<ApiResponse<Trip[]>, undefined>(API_ENDPOINTS.TRIPS.MY_TRIPS, {
        method:  "GET",
    });
}

/**
 * Get a trips by ID
 */
export function getTripById(id: number) {
    return http<ApiResponse<Trip>, undefined>(API_ENDPOINTS.TRIPS.BY_ID(id), {
        method: "GET",
    });
}

/**
 * Assign a GP to a trip (GESTIONNAIRE/ADMIN only)
 */
export function assignGpToTrip(tripId: number, gpId: number) {
    return http<ApiResponse<Trip>, { gpId: number }>(
        API_ENDPOINTS.TRIPS.ASSIGN_GP(tripId),
        {
            method: "PATCH",
            body: { gpId },
            bodyType: BodyType.JSON,
        }
    );
}

/**
 * Unassign a GP from a trip (GESTIONNAIRE/ADMIN only)
 */
export function unassignGpFromTrip(tripId: number) {
    return http<ApiResponse<Trip>, undefined>(
        API_ENDPOINTS.TRIPS.UNASSIGN_GP(tripId),
        {
            method: "PATCH",
        }
    );
}