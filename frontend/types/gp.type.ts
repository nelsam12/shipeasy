export interface GP {
    id: number;
    fullName: string;
    email: string;
    phone:  string;
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    createdAt: string;
    companyName?:  string;
    address?: string;
    description?: string;
    totalTrips?: number;
    activeTrips?: number;
}

export interface GPsStats {
    total: number;
    active: number;
    inactive: number;
    pending: number;
}

export interface GetGPsQuery {
    search?: string;
    status?: "ACTIVE" | "INACTIVE" | "PENDING";
}