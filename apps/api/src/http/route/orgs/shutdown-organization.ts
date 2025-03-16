import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { UnauthorizedError } from "../_error/unauthorized-error";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organizationSchema } from "@saas/auth";

export async function shutdownOrganization(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organization/:slug', {
        schema: {
            tags: ['Organization'],
            summary: 'shutdown organization by slug',
            security: [{ bearerAuth: []}],
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

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, memberShip.role)
 
         if (cannot('delete', authOrganization)) {
           throw new UnauthorizedError(
             `You're not allowed shutdown this organization.`,
           )
        }

        await prisma.organization.delete({
            where: {
                id: organization.id
            }
        })

        return reply.status(204).send()

    })
}