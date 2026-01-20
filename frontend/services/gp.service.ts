import type { ApiResponse } from "@/types";
import {GetGPsQuery, GP, GPsStats} from "@/types/gp.type";

/**
 * MOCK DATA - Pour tester le front sans backend
 * On remplacera par de vraies requêtes HTTP après
 */
const MOCK_GPS: GP[] = [
    {
        id: 1,
        fullName: "Mamadou Diallo",
        email: "mamadou@example.com",
        phone: "+221 77 123 45 67",
        status: "ACTIVE",
        createdAt: "2025-01-10T10:00:00Z",
        companyName: "Diallo Transport",
        address: "Dakar, Sénégal",
        description: "Transport de colis vers l'Europe",
        totalTrips: 15,
        activeTrips: 3,
    },
    {
        id: 2,
        fullName: "Fatou Sow",
        email: "fatou@example.com",
        phone: "+221 76 987 65 43",
        status: "ACTIVE",
        createdAt: "2025-01-12T14:30:00Z",
        companyName: "Sow Logistics",
        address: "Thiès, Sénégal",
        description: "Spécialiste USA-Afrique",
        totalTrips:  8,
        activeTrips: 1,
    },
    {
        id: 3,
        fullName: "Ousmane Ba",
        email: "ousmane@example.com",
        phone: "+221 78 456 78 90",
        status: "PENDING",
        createdAt: "2025-01-15T09:15:00Z",
        companyName: "Ba Express",
        address: "Saint-Louis, Sénégal",
        description: "Nouveau GP en attente de validation",
        totalTrips:  0,
        activeTrips: 0,
    },
    {
        id: 4,
        fullName: "Aminata Ndiaye",
        email: "aminata@example.com",
        phone: "+221 77 234 56 78",
        status: "ACTIVE",
        createdAt: "2025-01-08T16:45:00Z",
        companyName: "Ndiaye Shipping",
        address: "Rufisque, Sénégal",
        description: "Transport maritime et aérien",
        totalTrips: 22,
        activeTrips: 5,
    },
    {
        id: 5,
        fullName: "Ibrahima Sarr",
        email: "ibrahima@example.com",
        phone: "+221 76 345 67 89",
        status: "INACTIVE",
        createdAt: "2024-12-20T11:20:00Z",
        companyName: "Sarr Cargo",
        address: "Kaolack, Sénégal",
        description: "Compte temporairement inactif",
        totalTrips: 12,
        activeTrips: 0,
    },
];

/**
 * Récupérer les GPs (MOCK)
 */
export async function getGPs(query?:  GetGPsQuery): Promise<ApiResponse<GP[]>> {
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = [... MOCK_GPS];

    // Filtrer par recherche
    if (query?.search) {
        const searchLower = query.search.toLowerCase();
        filtered = filtered.filter(
            (gp) =>
                gp.fullName.toLowerCase().includes(searchLower) ||
                gp.email.toLowerCase().includes(searchLower) ||
                gp.phone.includes(query.search!) ||
                gp.companyName?.toLowerCase().includes(searchLower)
        );
    }

    // Filtrer par statut
    if (query?.status) {
        filtered = filtered.filter((gp) => gp.status === query.status);
    }

    return {
        success: true,
        statusCode: 200,
        data: filtered,
    };
}

/**
 * Récupérer les stats des GPs (MOCK)
 */
export async function getGPsStats(): Promise<ApiResponse<GPsStats>> {
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 300));

    const stats: GPsStats = {
        total: MOCK_GPS. length,
        active: MOCK_GPS.filter((gp) => gp.status === "ACTIVE").length,
        inactive: MOCK_GPS. filter((gp) => gp.status === "INACTIVE").length,
        pending: MOCK_GPS.filter((gp) => gp.status === "PENDING").length,
    };

    return {
        success: true,
        statusCode: 200,
        data: stats,
    };
}