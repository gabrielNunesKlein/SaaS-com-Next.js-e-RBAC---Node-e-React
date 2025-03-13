import { fastify } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider
} from 'fastify-type-provider-zod'
import { createAccount } from './route/auth/create-account'
import { autenticationWithPassword } from './route/auth/autenticated-with-password'
import { getProfile } from './route/auth/get-profile'
import { errorHandler } from './erro-handler'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
})

app.register(fastifyCors)

app.register(createAccount)
app.register(autenticationWithPassword)
app.register(getProfile)

app.listen({port: 3333}).then(() => {
    console.log('HTTP server runing!')
})