import { Role } from "@saas/auth";
import { api } from "./api-client";

interface CreateInviteRequest {
    org: string;
    email: string;
    role: Role;
}

export async function createInvite({
    org,
    email,
    role
}: CreateInviteRequest) {
    
    await api.post(`organization/${org}/invite`, {
        json: {
            email,
            role
        }
    })
}