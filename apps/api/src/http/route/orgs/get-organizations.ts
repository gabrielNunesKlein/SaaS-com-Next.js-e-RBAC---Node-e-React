
import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { roleSchema } from "../../../../../../packages/auth/src/roles";

export async function getOrganizations(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations', {
        schema: {
            tags: ['Organization'],
            summary: 'Get all organizations where user member.',
            security: [{ bearerAuth: [] }],
            response: {
                201: z.object({
                    organizations: z.array(z.object({
                        id: z.string().uuid(),
                        name: z.string(),
                        slug: z.string(),
                        avatarUrl: z.string().url().nullable(),
                        role: roleSchema
                    }))
                })
            }
        }
    }, async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const organizations = await prisma.organization.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                avatarUrl: true,
                members: {
                    select: {
                        role: true
                    },
                    where: {
                        userId
                    }
                }
            },
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            }
        })

        const organizationWithUserRole = organizations.map(({members, ...org }) => {
            return {
                ...org,
                role: members[0].role
            }
        })

        return {
            organizations: organizationWithUserRole
        }
    })
}