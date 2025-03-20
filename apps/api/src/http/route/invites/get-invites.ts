import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_error/unauthorized-error";
import { roleSchema } from "@saas/auth/src/roles";

export async function getInvites(app: FastifyInstance){

    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .get(
        '/organization/:slug/invites',
        {
          schema: {
            tags: ['Invite'],
            summary: 'Get invites.',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
            }),
            response: {
                200: z.object({
                  invites: z.array(
                    z.object({
                      id: z.string().uuid(),
                      role: roleSchema,
                      email: z.string().email(),
                      createdAt: z.date(),
                      author: z
                        .object({
                          id: z.string().uuid(),
                          name: z.string().nullable(),
                        })
                        .nullable(),
                    }),
                  ),
                }),
            }
          },
        },
        async (request, reply) => {
          const { slug } = request.params
          const userId = await request.getCurrentUserId()

          const { organization, memberShip } =
            await request.getUserMemberShid(slug)
          const { cannot } = getUserPermissions(userId, memberShip.role)

          if (cannot('get', 'Invite')) {
            throw new UnauthorizedError(
              `You're not allowed to see this invites.`
            )
          }

          const invites = await prisma.invite.findMany({
            where: {
              organizationId: organization.id,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
                organization: {
                  select: {
                    name: true,
                  },
                },
            },
            orderBy: {
              createdAt: 'desc',
            },
          })

          return reply.status(200).send({ invites })
        }
      )
}