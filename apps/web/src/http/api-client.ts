import ky from 'ky'
import { getCookie } from 'cookies-next'
// @ts-ignore
import { CookiesFn } from 'cookies-next/lib/types'

export const api = ky.create({
    prefixUrl: 'http://localhost:3333',
    hooks: {
        beforeRequest: [
            async (request) => {
                let cookieStore: CookiesFn | undefined

                if (typeof window === 'undefined') {
                    const { cookies: serverCookies } = await import('next/headers')
          
                    cookieStore = serverCookies
                  }

                  const token = await getCookie('token', { cookies: cookieStore })
                  if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`)
                }
            }
        ]
    }
})