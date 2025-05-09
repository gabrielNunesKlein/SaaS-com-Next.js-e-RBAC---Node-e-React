import { api } from "./api-client";

interface SignInGithubRequest {
    code: string;
}

interface SignInGithubResponse {
    token: string;
}

export async function signInWithGithub({
    code
}: SignInGithubRequest) {
    
    const result = await api.post('sessions/github', {
        json: {
            code
        }
    }).json<SignInGithubResponse>()

    return result
}