import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_error/unauthorized-error";
import { roleSchema } from "@saas/auth/src/roles";

export async function updateMember(app: FastifyInstance){

    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .put(
        '/organization/:slug/members/:memberId',
        {
          schema: {
            tags: ['Members'],
            summary: 'Update a member.',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
                memberId: z.string().uuid()
            }),
            body: z.object({
                role: roleSchema
            }),
            response: {
                204: z.null()
            },
          },
        },
        async (request, reply) => {
          const { slug, memberId } = request.params
          const userId = await request.getCurrentUserId()

          const { organization, memberShip } =
            await request.getUserMemberShid(slug)
          const { cannot } = getUserPermissions(userId, memberShip.role)

          if (cannot('update', 'User')) {
            throw new UnauthorizedError(
              `You're not allowed to update this member.`
            )
          }

          const { role } = request.body

          await prisma.member.update({
            where: {
                id: memberId,
                organizationId: organization.id
            },
            data: {
                role
            }
          })

          return reply.status(204).send()

        }
      )
}