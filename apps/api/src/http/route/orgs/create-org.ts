import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { BadRequestError } from "../_error/bad-request-error";
import { createSlug } from "@/utils/create-slug";

export async function createOrganization(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organization', {
        schema: {
            tags: ['Organization'],
            summary: 'Create a new organization',
            security: [{ bearerAuth: []}],
            body: z.object({
                name: z.string(),
                domain: z.string(),
                shouldAttachUsersByDomain: z.boolean().optional()
            }),
            response: {
                201: z.object({
                    organizationId: z.string().uuid()
                })
            }
        }
    }, async (request, reply) => {

        const userId = await request.getCurrentUserId()

        const { name, domain, shouldAttachUsersByDomain } = request.body

        if(domain){
            const organizationByDomain = await prisma.organization.findUnique({
                where: { domain }
            })

            if(organizationByDomain){
                throw new BadRequestError('Another organization with some already exists.')
            }
        }

        const organization = await prisma.organization.create({
            data: {
                name,
                slug: createSlug(domain),
                shouldAttachUsersByDomain,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: 'ADMIN'
                    }
                }
            }
        })

        return reply.status(201).send({ organizationId: organization.id })

    })
}