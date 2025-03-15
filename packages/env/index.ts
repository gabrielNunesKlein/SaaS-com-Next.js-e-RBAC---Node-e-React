import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        DATABASE_URL:  z.string().url(),
        JWT_SECRET: z.string(),
        GITHUB_OATH_CLIENT_ID: z.string(),
        GITHUB_OATH_SECRET: z.string(),
        GITHUB_OATH_CLIENT_REDIRECT_URI: z.string().url()
    },
    client: {},
    shared: {},
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        GITHUB_OATH_CLIENT_ID: process.env.GITHUB_OATH_CLIENT_ID,
        GITHUB_OATH_SECRET: process.env.GITHUB_OATH_SECRET,
        GITHUB_OATH_CLIENT_REDIRECT_URI: process.env.GITHUB_OATH_CLIENT_REDIRECT_URI
    },
    emptyStringAsUndefined: true
})