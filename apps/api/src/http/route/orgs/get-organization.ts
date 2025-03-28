
import { auth } from "@/http/midlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function getOrganization(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:slug', {
        schema: {
            tags: ['Organization'],
            summary: 'Get organization from slug.',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string()
            }),
            response: {
                200: z.object({
                    organization: z.object({
                        id: z.string().uuid(),
                        name: z.string(),
                        slug: z.string(),
                        domain: z.string().nullable(),
                        shouldAttachUsersByDomain: z.boolean(),
                        avatarUrl: z.string().url().nullable(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                        ownerId: z.string().uuid(),
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { slug } = request.params
        const { organization } = await request.getUserMemberShid(slug)

        return {
            organization
        }
    })
}