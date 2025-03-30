import { api } from "./api-client";

interface GetBellingResponse {
    billing: {
        projects: {
            amount: number;
            unit: number;
            price: number;
        };
        seats: {
            amount: number;
            unit: number;
            price: number;
        };
        total: number;
    }
}

export async function getBelling(org: string) {
    
    const result = await api.get(`organizations/${org}/billing`).json<GetBellingResponse>()

    return result
}