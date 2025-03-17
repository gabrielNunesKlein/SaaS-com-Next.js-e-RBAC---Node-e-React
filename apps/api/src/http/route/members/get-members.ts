import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_error/unauthorized-error";
import { roleSchema } from "@saas/auth/src/roles";

export async function getMembers(app: FastifyInstance){

    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .get(
        '/organization/:slug/members',
        {
          schema: {
            tags: ['Members'],
            summary: 'Get members.',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
            }),
            response: {
            200: z.object({
               members: z.array(
                 z.object({
                   id: z.string().uuid(),
                   userId: z.string().uuid(),
                   role: roleSchema,
                   name: z.string().nullable(),
                   email: z.string().email(),
                   avatarUrl: z.string().url().nullable(),
                 }),
               ),
             }),
            },
          },
        },
        async (request, reply) => {
          const { slug } = request.params
          const userId = await request.getCurrentUserId()

          const { organization, memberShip } =
            await request.getUserMemberShid(slug)
          const { cannot } = getUserPermissions(userId, memberShip.role)

          if (cannot('get', 'User')) {
            throw new UnauthorizedError(
              `You're not allowed to see organization members.`
            )
          }

          const members = await prisma.member.findMany({
            select: {
                id: true,
                role: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            },
            where: {
                organizationId: organization.id
            },
            orderBy: {
                role: 'asc'
            }
          })

          const membersWithRoles = members.map(({ user: { id: userId, ...user }, ...member }) => {
            return {
                ...user,
                ...member,
                userId
            }
          })

          return reply.status(200).send({ members: membersWithRoles })
        }
      )
}