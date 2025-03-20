import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_error/unauthorized-error";
import { roleSchema } from "@saas/auth/src/roles";
import { BadRequestError } from "../_error/bad-request-error";

export async function getPendingInvites(app: FastifyInstance){

    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .get(
        '/pending-invites',
        {
          schema: {
            tags: ['Invite'],
            summary: 'Get invites.',
            security: [{ bearerAuth: [] }],
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

          const userId = await request.getCurrentUserId()

          const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
          })

          if(!user){
            throw new BadRequestError('User not found')
          }

          const invites = await prisma.invite.findMany({
            where: {
              email: user.email
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