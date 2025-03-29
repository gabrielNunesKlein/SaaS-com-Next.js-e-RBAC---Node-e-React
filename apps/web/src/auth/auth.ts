'use server'
import { getMemberShip } from "@/http/get-membership";
import { getProfile } from "@/http/get-profile";
import { defineAbilityFor } from "@saas/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isAutenticated() {
    const cookiesStore = await cookies()
    return cookiesStore.get('token')?.value
}

export async function getCurrentOrg(){
    const cookiesStore = await cookies()
    return cookiesStore.get('org')?.value ?? null
}

export async function getCurrentMembership(){
    const org = await getCurrentOrg()

    if(!org){
        return null
    }

    const { memberShip } = await getMemberShip(org)

    return memberShip
    
}

export async function ability(){

    const memberShip = await getCurrentMembership()

    if(!memberShip){
        return null
    }

    const ability = defineAbilityFor({
        id: memberShip.userId,
        role: memberShip.role
    })

    return ability
}

export async function auth(){
    const cookiesStore = await cookies()
    const token = cookiesStore.get('token')?.value

    if(!token){
        redirect('/auth/sign-in')
    }

    try {

        const { user } = await getProfile()

        return { user }
    } catch (error) {
    }

    redirect('/api/auth/sign-out')
}