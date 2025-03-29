'use server'
import { HTTPError } from "ky"
import { z } from "zod"
import { createProject } from "@/http/create-project"
import { getCurrentOrg } from "@/auth/auth"

const organizationSchema = z.object({
    name: z.string().min(4, { message: 'Please include at last 4 characters.'}),
    description: z
       .string()
})

export async function createProjectAction(data: FormData){

    const result = organizationSchema.safeParse(Object.fromEntries(data))
    if(!result.success){
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }

    const { name, description } = result.data
    const org = await getCurrentOrg()

    try{
        await createProject({
            name,
            description,
            org
        })

    } catch(error){
        if(error instanceof HTTPError){
            const { message } = await error.response.json()

            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Erro inesperado', errors: null }
    }

    return { success: true, message: 'Successfully saved the project.', errors: null }
}