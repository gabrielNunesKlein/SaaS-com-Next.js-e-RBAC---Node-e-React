import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React from 'react'

export default function ForgotPassword() {
    return (
        <form className='space-y-4'>

            <div className='space-y-1'>
                <Label htmlFor="email">E-mail</Label>
                <Input name='email' type='email' id='email' />
            </div>

            <Button className='w-full' type='submit'>
                Recover password
            </Button>

            <Button className='w-full' variant={'link'} size={'sm'} asChild>
                <Link href='/auth/sign-in'>
                    Sign in instead
                </Link>
            </Button>

        </form>
    )
}
