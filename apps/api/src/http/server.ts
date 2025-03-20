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
import { requestPasswordRecover } from './route/auth/request-password-recover'
import { resetPassword } from './route/auth/reset-password'
import { autenticationWithGithub } from './route/auth/autenticated-with-github'
import { env } from '@saas/env'
import { createOrganization } from './route/orgs/create-org'
import { getMemberShip } from './route/orgs/get-membership'
import { getOrganization } from './route/orgs/get-organization'
import { getOrganizations } from './route/orgs/get-organizations'
import { updateOrganization } from './route/orgs/update-organization'
import { shutdownOrganization } from './route/orgs/shutdown-organization'
import { tranferOrganization } from './route/orgs/tranfer-organization'
import { createProject } from './route/projects/create-project'
import { deleteProject } from './route/projects/delete-project'
import { getProject } from './route/projects/get-project'
import { getProjects } from './route/projects/get-projects'
import { updateProject } from './route/projects/update-project'
import { getMembers } from './route/members/get-members'
import { updateMember } from './route/members/update-member'
import { removeMember } from './route/members/remove-member'
import { createInvite } from './route/invites/create-invite'
import { getInvite } from './route/invites/get-invite'
import { getInvites } from './route/invites/get-invites'
import { acceptInvite } from './route/invites/accept-invite'
import { rejectInvite } from './route/invites/reject-invite'
import { revokeInvite } from './route/invites/revoke-invite'
import { getPendingInvites } from './route/invites/get-pending-invites'
import { getOrganizationBilling } from './route/billing/get-organization-billing'

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(createAccount)
app.register(autenticationWithPassword)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(autenticationWithGithub)
app.register(createOrganization)
app.register(getMemberShip)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(tranferOrganization)

app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)

app.register(getMembers)
app.register(updateMember)
app.register(removeMember)

app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

app.register(getOrganizationBilling)

app.listen({port: 3333}).then(() => {
    console.log('HTTP server runing!')
})