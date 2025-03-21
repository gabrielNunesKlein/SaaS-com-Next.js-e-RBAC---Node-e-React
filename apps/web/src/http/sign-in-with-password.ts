import { api } from "./api-client";

interface SignInWithPasswordRequest {
    email: string;
    password: string;
}

interface SignInPasswordResponse {
    token: string;
}

export async function signWithPassword({
    email,
    password
}: SignInWithPasswordRequest) {
    
    const result = await api.post('sessions/password', {
        json: {
            email,
            password
        }
    }).json<SignInPasswordResponse>()

    return result
}