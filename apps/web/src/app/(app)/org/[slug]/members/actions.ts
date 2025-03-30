'use server'

import { getCurrentOrg } from "@/auth/auth"
import { createInvite } from "@/http/create-invite"
import { removeMember } from "@/http/remove-member"
import { revokeInvite } from "@/http/revoke-invite"
import { updateMember } from "@/http/update-member"
import { Role, roleSchema } from "@saas/auth"
import { HTTPError } from "ky"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const inviteSchema = z.object({
    email: z.string().email({ message: 'Invalid e-mail.'}),
    role: roleSchema 
})

export async function createInviteAction(data: FormData){

    const result = inviteSchema.safeParse(Object.fromEntries(data))

    if(!result.success){
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }

    const { email, role } = result.data
    const org = await getCurrentOrg()

    try{
        await createInvite({
            org: org!,
            email,
            role
        })

        revalidateTag(`${org}/invites`)

    } catch(error){
        if(error instanceof HTTPError){
            const { message } = await error.response.json()

            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Erro inesperado', errors: null }
    }

    return { success: true, message: 'Successfully send invite.', errors: null }
}

export async function removeMemberAction(memberId: string){
    const currentOrg = await getCurrentOrg()

    await removeMember({
        org: currentOrg!,
        memberId
    })

    revalidateTag(`${currentOrg}/members`)

}

export async function updateMemberAction(memberId: string, role: Role){
    const currentOrg = await getCurrentOrg()

    await updateMember({
        org: currentOrg!,
        memberId,
        role
    })

    revalidateTag(`${currentOrg}/members`)

}

export async function revokeInviteAction(inviteId: string){
    const currentOrg = await getCurrentOrg()

    await revokeInvite({
        org: currentOrg!,
        inviteId
    })

    revalidateTag(`${currentOrg}/invites`)

}