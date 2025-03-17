import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_error/unauthorized-error";
import { BadRequestError } from "../_error/bad-request-error";
import { projectSchema } from "@saas/auth";

export async function updateProject(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organization/:slug/project/:projectId', {
        schema: {
            tags: ['Project'],
            summary: 'Update project.',
            security: [{ bearerAuth: []}],
            body: z.object({
                name: z.string(),
                description: z.string()
            }),
            params: z.object({
                slug: z.string(),
                projectId: z.string().uuid()
            }),
            response: {
                204: z.null()
            }
        }
    }, async (request, reply) => {

        const { slug, projectId } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, memberShip } = await request.getUserMemberShid(slug)

        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
                organizationId: organization.id
            }
        })

        if(!project){
            throw new BadRequestError('Project not found.')
        }

        const { cannot } = getUserPermissions(userId, memberShip.role)
        const authProject = projectSchema.parse(project)

        if(cannot('update', authProject)){
            throw new UnauthorizedError(
                `You're not allowed to update this projects.`,
            )
        }

        const { name, description } = request.body

        console.log('TESTE >>> ', project)

        await prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                name: name,
                description: description
            }
        })

        return reply.status(204).send()

    })
}