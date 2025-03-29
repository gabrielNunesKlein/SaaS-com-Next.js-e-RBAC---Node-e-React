import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { BadRequestError } from "../_error/bad-request-error";
import { UnauthorizedError } from "../_error/unauthorized-error";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organizationSchema } from "@saas/auth";

export async function updateOrganization(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organization/:slug', {
        schema: {
            tags: ['Organization'],
            summary: 'Update organization by slug',
            security: [{ bearerAuth: []}],
            body: z.object({
                name: z.string(),
                domain: z.string(),
                shouldAttachUsersByDomain: z.boolean().optional()
            }),
            params: z.object({
                slug: z.string()
            }),
            response: {
                204: z.null()
            }
        }
    }, async (request, reply) => {
        const { slug } = request.params

        const userId = await request.getCurrentUserId()
        const { memberShip, organization } = await request.getUserMemberShid(slug)

        const { name, domain, shouldAttachUsersByDomain } = request.body
        const authOrganization = organizationSchema.parse(organization)

        console.log('authOrganization ', authOrganization)

        const { cannot } = getUserPermissions(userId, memberShip.role)
 
         if (cannot('update', authOrganization)) {
           throw new UnauthorizedError(
             `You're not allowed to update this organization.`,
           )
         }

        if(domain){
            const organizationByDomain = await prisma.organization.findFirst({
                where: { 
                    domain, 
                    slug: {
                        not: organization.id
                    }
                }
            })

            if(!organizationByDomain){
                throw new BadRequestError('Another organization with some not exists.')
            }
        }

        await prisma.organization.update({
            where: {
                id: organization.id
            },
            data: {
                name,
                domain,
                shouldAttachUsersByDomain,
            }
        })

        return reply.status(204).send()

    })
}