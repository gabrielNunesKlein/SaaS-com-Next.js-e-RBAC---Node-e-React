import { acceptInvite } from "@/http/accept-invite";
import { signInWithGithub } from "@/http/sign-in-with-github";
import { cookies } from "next/dist/server/request/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if(!code){
        return NextResponse.json({error: 'Github OAuth code was not found.'}, {status: 400});
    }

    const { token } = await signInWithGithub({ code });
    
    const cookiesStore = await cookies()
    cookiesStore.set('token', token, { path: '/',  maxAge: 60 * 60 * 24 * 7 })

    const inviteId = cookiesStore.get('inviteId')?.value
    if(inviteId){
        try {
            await acceptInvite(inviteId)
            cookiesStore.delete('inviteId')
        }catch(err) {
            //
        }
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl.toString());
}