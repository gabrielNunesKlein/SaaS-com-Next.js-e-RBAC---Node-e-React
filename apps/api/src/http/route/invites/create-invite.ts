import { auth } from "@/http/midlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_error/unauthorized-error";
import { BadRequestError } from "../_error/bad-request-error";
import { roleSchema } from "@saas/auth/src/roles";

export async function createInvite(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organization/:slug/invite', {
        schema: {
            tags: ['Invite'],
            summary: 'Create a new invite',
            security: [{ bearerAuth: []}],
            body: z.object({
                email: z.string().email(),
                role: roleSchema
            }),
            params: z.object({
                slug: z.string()
            }),
            response: {
                201: z.object({
                    inviteId: z.string().uuid()
                })
            }
        }
    }, async (request, reply) => {

        const { slug } = request.params
        const userId = await request.getCurrentUserId()

        const { organization, memberShip } = await request.getUserMemberShid(slug)
        const { cannot } = getUserPermissions(userId, memberShip.role)

        if(cannot('create', 'Invite')){
            throw new UnauthorizedError(
                `You're not allowed to create invite.`,
            )
        }

        const { email, role } = request.body

        const [, domain] = email.split('@')

        console.log('organization >>> ', organization, domain !== organization.domain)

        if(organization.shouldAttachUsersByDomain && domain !== organization.domain){
            throw new BadRequestError( `Users with '${domain}' domain will join your organization automatically on login.`)
        }

        const inviteWithSameEmail = await prisma.invite.findUnique({
            where: {
                email_organizationId: {
                    email,
                    organizationId: organization.id
                }
            }
        })

        if(inviteWithSameEmail){
            throw new BadRequestError('Another invite with same e-mail already exists.')
        }

        const memberWithSameEmail = await prisma.member.findFirst({
            where: {
                organizationId: organization.id,
                user: {
                    email
                }
            }
        })

        if(memberWithSameEmail){
            throw new BadRequestError('A member with this e-mail already belongs to your organization.')
        }

        const invite = await prisma.invite.create({
            data: {
                organizationId: organization.id,
                email,
                role,
                authorId: userId
            }
        })

        return reply.status(201).send({ inviteId: invite.id})

    })
}