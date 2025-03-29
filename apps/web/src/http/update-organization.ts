import { api } from "./api-client";

interface UpdateOrganizationRequest {
    org: string;
    name: string;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
}

type UpdateOrganizationResponse = void

export async function updateOrganization({
    org,
    name,
    domain,
    shouldAttachUsersByDomain
}: UpdateOrganizationRequest) {
    
    await api.put(`organization/${org}`, {
        json: {
            name,
            domain,
            shouldAttachUsersByDomain
        }
    }).json<UpdateOrganizationResponse>()
}