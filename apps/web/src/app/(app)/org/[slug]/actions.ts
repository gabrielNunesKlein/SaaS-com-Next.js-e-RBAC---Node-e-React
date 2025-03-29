'use server'
import { HTTPError } from "ky"
import { z } from "zod"
import { createOrganization } from "@/http/create-organization"
import { updateOrganization } from "@/http/update-organization"
import { getCurrentOrg } from "@/auth/auth"
import { revalidateTag } from "next/cache"

const organizationSchema = z.object({
    name: z.string().min(4, { message: 'Please include at last 4 characters.'}),
    domain: z
       .string()
       .nullable()
       .refine(
         (value) => {
           if (value) {
             const domainRegex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/
 
             return domainRegex.test(value)
           }
 
           return true
         },
         {
           message: 'Please, enter a valid domain.',
         },
       ),
    shouldAttachUsersByDomain: z
        .union([z.literal('on'), z.literal('off'), z.boolean()])
        .transform((value) => value === true || value === 'on')
        .default(false),
}).refine(data => {
    if(data.shouldAttachUsersByDomain == true && !data.domain){
        return false
    }

    return true
} , {
    message: 'Domain is required when auto-join is enabled.',
    path: ['domain'],
})

export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(data: FormData){
    console.log('Create')

    const result = organizationSchema.safeParse(Object.fromEntries(data))

    if(!result.success){
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }

    const { name, domain, shouldAttachUsersByDomain } = result.data

    try{
        await createOrganization({
            name,
            domain,
            shouldAttachUsersByDomain
        })

        revalidateTag('organizations')

    } catch(error){
        if(error instanceof HTTPError){
            const { message } = await error.response.json()

            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Erro inesperado', errors: null }
    }

    return { success: true, message: 'Successfully saved the organization.', errors: null }
}

export async function updateOrganizationAction(data: FormData){
    console.log('Update')
    const currentOrg = await getCurrentOrg()

    const result = organizationSchema.safeParse(Object.fromEntries(data))

    if(!result.success){
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }

    const { name, domain, shouldAttachUsersByDomain } = result.data

    try{
        await updateOrganization({
            org: currentOrg!,
            name,
            domain,
            shouldAttachUsersByDomain
        })

        revalidateTag('organizations')

    } catch(error){
        if(error instanceof HTTPError){
            const { message } = await error.response.json()

            return { success: false, message, errors: null }
        }

        return { success: false, message: 'Erro inesperado', errors: null }
    }

    return { success: true, message: 'Successfully update the organization.', errors: null }
}