import { Role } from '@saas/auth';
import { api } from './api-client'

interface GetInviteResponse {
    invite: {
        id: string;
        createdAt: string;
        role: Role;
        email: string;
        author: {
            name: string | null;
            id: string;
            avatarUrl: string;
        } | null;
        organization: {
            name: string;
        }
    }
}

export async function getInvite(inviteId: string) {
  const result = await api
    .get(`invites/${inviteId}`)
    .json<GetInviteResponse>()

  return result
}
