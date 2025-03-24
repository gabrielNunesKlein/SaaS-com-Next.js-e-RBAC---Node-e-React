'use server'

import { redirect } from "next/navigation";
import { env } from '@saas/env'

export async function signInWithGithub(){
    const githubSignInUrl = new URL('login/oauth/authorize', 'https://github.com');
    
    githubSignInUrl.searchParams.append('client_id', env.GITHUB_OATH_CLIENT_ID);
    githubSignInUrl.searchParams.append('redirect_uri', env.GITHUB_OATH_CLIENT_REDIRECT_URI);
    githubSignInUrl.searchParams.append('scope', 'user');

    redirect(githubSignInUrl.toString());
}