import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { BadRequestError } from "../_error/bad-request-error";
import { auth } from "@/http/midlewares/auth";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_error/unauthorized-error";

export async function revokeInvite(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().register(auth).post(
      '/organizations/:slug/invites/:inviteId',
      {
        schema: {
          tags: ['Invite'],
          summary: 'Reject an invite',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null()
          },
        },
      },
      async (request, reply) => {

        const userId = await request.getCurrentUserId()
        const { slug, inviteId } = request.params


        const { organization, memberShip } = await request.getUserMemberShid(slug)

        const { cannot } = getUserPermissions(userId, memberShip.role)

        if (cannot('delete', 'Invite')) {
            throw new UnauthorizedError(`You're not allowed to delete an invite.`)
        }

        const invite = await prisma.invite.findUnique({
            where: {
                id: inviteId,
                organizationId: organization.id
            }
        })

        if(!invite){
            throw new BadRequestError('Invite not found or expired')
        }

        await prisma.invite.delete({
            where: {
                id: invite.id
            }
        })

        return reply.code(204).send()
      }
    )
}