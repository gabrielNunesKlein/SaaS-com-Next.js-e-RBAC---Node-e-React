'use server'

import { signWithPassword } from "@/http/sign-in-with-password"
import { HTTPError } from "ky"
import { z } from "zod"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { acceptInvite } from "@/http/accept-invite"

const signInSchema = z.object({
    email: z.string().email({ message: 'Prease , provide a valid e-mail'}),
    password: z.string().min(1, { message: 'Please, provider your password'})
})

export async function signInWithEmailAndPassword(data: FormData){

    const result = signInSchema.safeParse(Object.fromEntries(data))

    if(!result.success){
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }

    const { email, password } = result.data

    try{
        const { token } = await signWithPassword({
            email: String(email),
            password: String(password)
        })

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

    } catch(error){
        if(error instanceof HTTPError){
            const { message } = await error.response.json()

            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Erro inesperado', errors: null }
    }

    redirect('/')
}