import type { FastifyInstance } from 'fastify'
//import { ZodError } from 'zod'

import { BadRequestError } from "./route/_error/bad-request-error";
import { UnauthorizedError } from "./route/_error/unauthorized-error";

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {

    if (error.validation) {
        reply.status(400).send({
          message: 'Validation error, algum campo não foi preenchido.',
          //errors: error.flatten().fieldErrors,
        })
    }

    if(error instanceof BadRequestError) {
        reply.status(400).send({
            message: error.message,
        })
    }

    if(error instanceof UnauthorizedError) {
        reply.status(401).send({
            message: error.message,
        })
    }

    console.log(error)
    reply.status(500).send({message: 'Internal server error.'})
}