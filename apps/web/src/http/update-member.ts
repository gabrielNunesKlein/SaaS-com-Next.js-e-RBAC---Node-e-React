import { Role } from "@saas/auth";
import { api } from "./api-client";

interface UpdateMemberRequest {
    org: string;
    memberId: string;
    role: Role
}

type UpdateMemberResponse = void

export async function updateMember({
    org,
    memberId,
    role
}: UpdateMemberRequest) {
    await api.put(`organization/${org}/members/${memberId}`, {
        json: {
            role
        }
    }).json<UpdateMemberResponse>()
}