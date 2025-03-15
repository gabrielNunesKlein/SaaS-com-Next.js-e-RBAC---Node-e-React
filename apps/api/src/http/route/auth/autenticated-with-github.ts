import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_error/bad-request-error";

export async function autenticationWithGithub(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/sessions/github',
        {
            schema: {
                tags: ['Auth'],
                summary: 'Autenticated with github',
                body: z.object({
                    code: z.string()
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
            const { code } = request.body

            const githubUrl = new URL(
                `https://github.com/login/oauth/access_token`
            )

            githubUrl.searchParams.set('client_id', 'Ov23lizDfbuG5qSbJyGy')
            githubUrl.searchParams.set('client_secret', 'ce65bf34684e18b7a2f92c1bfeada5edffa1b420')
            githubUrl.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/callback')
            githubUrl.searchParams.set('code', code)

            const githubAccessToken = await fetch(githubUrl, {
                method: 'POST',
                headers: {
                    Accept: "application/json"
                }
            })

            const githubAccessData = await githubAccessToken.json()
            console.log('githubAccessData >>> ', githubAccessData)

            const { access_token: gitHibAccessToken } = z.object({
                access_token: z.string(),
                token_type: z.literal('bearer'),
                scope: z.string()
            }).parse(githubAccessData)

            const githubDataResponse = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${gitHibAccessToken}`
                }
            })

            const githubUserData = await githubDataResponse.json()
            
            const { id: githubId, name, email, avatar_url } = z.object({
                id: z.number().int().transform(String),
                avatar_url: z.string(),
                name: z.string().nullable(),
                email: z.string().nullable()
            }).parse(githubUserData)

            if(email === null){
                throw new BadRequestError(
                    'Your gitthub account dont have an email in autenticate.'
                )
            }

            let user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if(!user){
                user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        avatarUrl: avatar_url
                    }
                })
            }

            let account = await prisma.account.findUnique({
                where: {
                    provider_userId: {
                        provider: 'GITHUB',
                        userId: user.id
                    }
                }
            })

            if(!account){
                account = await prisma.account.create({
                    data: {
                        provider: 'GITHUB',
                        providerAccountId: githubId,
                        userId: user.id
                    }
                })
            }

            const token = await reply.jwtSign({
                sub: user.id
            }, {
                sign: {
                    expiresIn: '7d'
                }
            })

            return reply.status(201).send({ token })

        }
    )
}