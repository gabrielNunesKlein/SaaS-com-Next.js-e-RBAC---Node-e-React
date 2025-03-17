import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_error/unauthorized-error";
import { BadRequestError } from "../_error/bad-request-error";

export async function getProject(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:orgSlug/project/:projectSlug', {
        schema: {
            tags: ['Project'],
            summary: 'Get project details.',
            security: [{ bearerAuth: []}],
            params: z.object({
                orgSlug: z.string(),
                projectSlug: z.string()
            }),
            response: {
                200: z.object({
                    project: z.object({
                      id: z.string().uuid(),
                      description: z.string(),
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
                    }),
                })
            }
        }
    }, async (request, reply) => {

        const { orgSlug, projectSlug } = request.params
        const userId = await request.getCurrentUserId()

        const { organization, memberShip } = await request.getUserMemberShid(orgSlug)
        const { cannot } = getUserPermissions(userId, memberShip.role)

        if(cannot('get', 'Project')){
            throw new UnauthorizedError(
                `You're not allowed to see this projects.`,
            )
        }

        const project = await prisma.project.findUnique({
            where: {
                slug: projectSlug,
                organizationId: organization.id
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                ownerId: true,
                avatarUrl: true,
                organizationId: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            }
        })

        if(!project){
            throw new BadRequestError('Project not found.')
        }

        return reply.status(200).send({ project })

    })
}