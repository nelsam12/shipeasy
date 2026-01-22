export interface GP {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    isApproved: boolean;
    companyName?: string;
    address?: string;
    description?: string;
}

export interface GetGPsQuery {
    search?: string;
    isApproved?: boolean;
}