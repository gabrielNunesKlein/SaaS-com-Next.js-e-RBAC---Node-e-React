import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "src/lib/prisma";
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { BadRequestError } from "../_error/bad-request-error";

export async function createAccount(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/users', {
        schema: {
            tags: ['Auth'],
            summary: 'Create a new account',
            body: z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string().min(6)
            })
        }
    }, async (request, reply) => {
        const { name, email, password } = request.body
        const userWithEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(userWithEmail){
            throw new BadRequestError('User with same e-mail already existe.')
        }

        const [, domain] = email.split('@')

        const autoJoinDomain = await prisma.organization.findFirst({
            where: {
                domain,
                shouldAttachUsersByDomain: true
            }
        })

        const passwordHash = await hash(password, 6)

        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                member_on: autoJoinDomain ? 
                    {
                        create: {
                            organizationId: autoJoinDomain.id
                        }
                    } : undefined
            }
        })

        return reply.status(201).send()
    })
}