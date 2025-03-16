import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { createSlug } from "@/utils/create-slug";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_error/unauthorized-error";

export async function createProject(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organization/:slug/project', {
        schema: {
            tags: ['Project'],
            summary: 'Create a new project',
            security: [{ bearerAuth: []}],
            body: z.object({
                name: z.string(),
                description: z.string()
            }),
            params: z.object({
                slug: z.string()
            }),
            response: {
                201: z.object({
                    projectId: z.string().uuid()
                })
            }
        }
    }, async (request, reply) => {

        const { slug } = request.params
        const userId = await request.getCurrentUserId()

        const { organization, memberShip } = await request.getUserMemberShid(slug)
        const { cannot } = getUserPermissions(userId, memberShip.role)

        if(cannot('create', 'Project')){
            throw new UnauthorizedError(
                `You're not allowed to create new projects.`,
            )
        }

        const { name, description } = request.body

        const project = await prisma.project.create({
            data: {
                name,
                description,
                slug: createSlug(name),
                organizationId: organization.id,
                ownerId: userId
            }
        })

        return reply.status(201).send({ projectId: project.id })

    })
}