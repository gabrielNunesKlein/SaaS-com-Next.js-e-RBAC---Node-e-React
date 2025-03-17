import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_error/unauthorized-error";

export async function getProjects(app: FastifyInstance){

    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .get(
        '/organization/:slug/projects',
        {
          schema: {
            tags: ['Project'],
            summary: 'Get projects.',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
            }),
            response: {
              200: z.object({
                projects: z.array(
                    z.object({
                        id: z.string().uuid(),
                        description: z.string(),
                        createdAt: z.date(),
                        name: z.string(),
                        slug: z.string(),
                        avatarUrl: z.string().nullable(),
                        organizationId: z.string().uuid(),
                        ownerId: z.string().uuid(),
                        owner: z.object({
                          id: z.string().uuid(),
                          name: z.string().nullable(),
                          avatarUrl: z.string().nullable(),
                        }),
                    })
                )
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

          if (cannot('get', 'Project')) {
            throw new UnauthorizedError(
              `You're not allowed to see this projects.`
            )
          }

          const projects = await prisma.project.findMany({
            where: {
              organizationId: organization.id,
            },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              ownerId: true,
              avatarUrl: true,
              organizationId: true,
              createdAt: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          })

          return reply.status(200).send({ projects })
        }
      )
}