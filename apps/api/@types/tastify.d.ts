import 'fastify'
import { Organization, Member } from '@prisma/client'

declare module 'fastify' {
    export interface FastifyRequest {
        getCurrentUserId(): Promise<string>
        getUserMemberShid(slug: string): Promise<{ organization: Organization, memberShip: Member}>
    }
}