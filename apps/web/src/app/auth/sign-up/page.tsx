import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'
import { Github } from 'lucide-react'

export default function SignUpPage() {
    return (
        <form className='space-y-4'>

            <div className='space-y-1'>
                <Label htmlFor="name">Name</Label>
                <Input name='name' type='text' id='name' />
            </div>

            <div className='space-y-1'>
                <Label htmlFor="email">E-mail</Label>
                <Input name='email' type='email' id='email' />
            </div>

            <div className='space-y-1'>
                <Label htmlFor="password">Password</Label>
                <Input name='password' type='password' id='password' />
            </div>

            <div className='space-y-1'>
                <Label htmlFor="confirmPassword">Confirm Your Password</Label>
                <Input name='confirmPassword' type='password' id='confirmPassword' />
            </div>

            <Button className='w-full' type='submit'>
                Create Account
            </Button>

            <Button className='w-full' variant={'link'} size={'sm'} asChild>
                <Link href='/auth/sign-in'>
                    Already registered? Sign In
                </Link>
            </Button>

            <Separator />

            <Button className='w-full' type='submit' variant={'outline'}>
                <Github className='size-4 mr-2' />
                Sign in with GitHub
            </Button>
        </form>
    )
}
