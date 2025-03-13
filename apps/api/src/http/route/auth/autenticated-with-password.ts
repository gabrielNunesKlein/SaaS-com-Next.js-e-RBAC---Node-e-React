import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_error/bad-request-error";

export async function autenticationWithPassword(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/sessions/password',
        {
            schema: {
                tags: ['Auth'],
                summary: 'Autenticated with e-mail & password',
                body: z.object({
                    email: z.string().email(),
                    password: z.string()
                }),
                response: {
                    201: z.object({
                        token: z.string()
                    }),
                    400: z.object({
                        message: z.string()
                    })
                }
            }
        },
        async (request, reply) => {
            const { email, password } = request.body
            
            const userFromEmail = await prisma.user.findUnique({
                where: { email }
            })

            if(!userFromEmail){
                throw new BadRequestError('Invalid credentials !')
            }

            if(userFromEmail.passwordHash === null){
                throw new BadRequestError('User does not have a password, use social login.')
            }

            const isPassword = await compare(password, userFromEmail.passwordHash)

            if(!isPassword){
                throw new BadRequestError('Invalid credentials !')
            }

            const token = await reply.jwtSign({
                sub: userFromEmail.id
            }, {
                sign: {
                    expiresIn: '7d'
                }
            })

            return reply.status(201).send({ token })

        }
    )
}