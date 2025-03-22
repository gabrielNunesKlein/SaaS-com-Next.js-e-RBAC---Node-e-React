'use server'

import { redirect } from "next/navigation";

export async function signInWithGithub(){
    const githubSignInUrl = new URL('login/oauth/authorize', 'https://github.com');
    
    githubSignInUrl.searchParams.append('client_id', 'Ov23lizDfbuG5qSbJyGy');
    githubSignInUrl.searchParams.append('redirect_uri', 'http://localhost:3000/api/auth/callback');
    githubSignInUrl.searchParams.append('scope', 'user');

    redirect(githubSignInUrl.toString());
}