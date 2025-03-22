import { getProfile } from "@/http/get-profile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isAutenticated() {
    const cookiesStore = await cookies()
    return cookiesStore.get('token')?.value
}

export async function auth(){
    const cookiesStore = await cookies()
    const token = cookiesStore.get('token')?.value
    console.log('token >>> ', token)

    if(!token){
        redirect('/auth/sign-in')
    }

    try {

        const { user } = await getProfile()
        console.log('user >>> ', user)

        return { user }
    } catch (error) {
    }

    redirect('/api/auth/sign-out')
}