import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { BadRequestError } from "../_error/bad-request-error";
import { UnauthorizedError } from "../_error/unauthorized-error";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organizationSchema } from "@saas/auth";

export async function tranferOrganization(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().register(auth).patch('/organization/:slug/owner', {
        schema: {
            tags: ['Organization'],
            summary: 'Tranfer organization by slug',
            security: [{ bearerAuth: []}],
            body: z.object({
                transferToUserId: z.string().uuid(),
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
        const { transferToUserId } = request.body

        const userId = await request.getCurrentUserId()
        const { memberShip, organization } = await request.getUserMemberShid(slug)

        const authOrganization = organizationSchema.parse(organization)
        const { cannot } = getUserPermissions(userId, memberShip.role)
 
        if (cannot('transfer_ownership', authOrganization)) {
           throw new UnauthorizedError(
             `You're not allowed to tranfer this organization.`,
           )
        }

        const tranferManberShip = await prisma.member.findUnique({
            where: {
                organizationId_userId: {
                    organizationId: organization.id,
                    userId: transferToUserId
                }
            }
        })

        if(!tranferManberShip){
            throw new BadRequestError('Target user is not a member of this organization.')
        }

        await prisma.$transaction([
            prisma.member.update({
                where: {
                    organizationId_userId: {
                        organizationId: organization.id,
                        userId: transferToUserId
                    }
                },
                data: {
                    role: 'ADMIN'
                }
            }),

            prisma.organization.update({
                where: {
                    id: organization.id
                },
                data: {
                    ownerId: transferToUserId
                }
            })
        ])



        return reply.status(204).send()

    })
}