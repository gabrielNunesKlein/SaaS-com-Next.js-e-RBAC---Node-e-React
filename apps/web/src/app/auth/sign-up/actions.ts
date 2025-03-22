'use server'

import { signUp } from "@/http/sign-up"
import { HTTPError } from "ky"
import { z } from "zod"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const signInSchema = z.object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
        message: 'Please, provider your name and last name'
    }),
    email: z.string().email({ message: 'Prease , provide a valid e-mail'}),
    password: z.string().min(1, { message: 'Please, provider your password'}).min(6, { message: 'Password must be at least 6 characters'}),
    confirmPassword: z.string().min(1, { message: 'Please, provider your password'})
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

export async function signUpAction(data: FormData){

    const result = signInSchema.safeParse(Object.fromEntries(data))

    if(!result.success){
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }

    const { email, password, name } = result.data

    try{
        await signUp({
            name: String(name),
            email: String(email),
            password: String(password)
        })

    } catch(error){
        if(error instanceof HTTPError){
            const { message } = await error.response.json()

            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Erro inesperado', errors: null }
    }

    redirect('/')
}