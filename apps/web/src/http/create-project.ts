import { api } from "./api-client";

interface CreateProjectRequest {
    name: string;
    description: string;
    org: string | null;
}

interface CreateProjectResponse {
    projectId: string;
}

export async function createProject({
    name,
    description,
    org
}: CreateProjectRequest) {
    
    const result = await api.post(`organization/${org}/project`, {
        json: {
            name,
            description
        }
    }).json<CreateProjectResponse>()

    return result
}