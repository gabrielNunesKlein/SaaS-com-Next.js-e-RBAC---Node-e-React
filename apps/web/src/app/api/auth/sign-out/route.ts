import { cookies } from "next/dist/server/request/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){

    const cookiesStore = await cookies()
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/sign-in';
    cookiesStore.delete('token')
    return NextResponse.redirect(redirectUrl.toString());
}