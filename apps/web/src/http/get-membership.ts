import { Role } from '@saas/auth'
import { api } from "./api-client";

interface GetMemberShipResponse {
    memberShip: {
        id: string;
        role: Role;
        organizationId: string;
        userId: string;
    }
}

export async function getMemberShip(org: string) {
    
    const result = await api.get(`organization/${org}/membership`).json<GetMemberShipResponse>()

    return result
}