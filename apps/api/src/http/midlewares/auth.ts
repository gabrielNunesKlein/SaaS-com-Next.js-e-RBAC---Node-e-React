import { FastifyInstance } from "fastify";
import { UnauthorizedError } from "../route/_error/unauthorized-error";
import fastifyPlugin from "fastify-plugin";

export const auth = fastifyPlugin(async (app: FastifyInstance) => {

    app.addHook('preHandler', async (request) => {

        request.getCurrentUserId = async () => {
            try {
                const { sub } = await request.jwtVerify<{ sub: string}>()
                return sub
            } catch {
                throw new UnauthorizedError('Invalid auth token.')
            }
        }

    })

})