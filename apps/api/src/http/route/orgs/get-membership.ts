import { auth } from "@/http/midlewares/auth";
import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { roleSchema } from "../../../../../../packages/auth/src/roles";

export async function getMemberShip(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:slug/membership', {
        schema: {
            tags: ['Organization'],
            summary: 'Get user membership on organization',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string()
            }),
            response: {
                201: z.object({
                    memberShip: z.object({
                        id: z.string().uuid(),
                        role: roleSchema,
                        organizationId: z.string().uuid()
                    })
                })
            }
        }
    }, async (request, reply) => {

        const { slug } = request.params
        const { memberShip } = await request.getUserMemberShid(slug)

        return { 
            memberShip: {
                id: memberShip.id,
                organizationId: memberShip.organizationId,
                role: roleSchema.parse(memberShip.role)
            }
        }
    })
}