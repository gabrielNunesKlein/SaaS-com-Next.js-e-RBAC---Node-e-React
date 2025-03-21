import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'
import { Github } from 'lucide-react'
import { signInWithEmailAndPassword } from './actions'

export default function SignInPage() {
    return (
        <form action={signInWithEmailAndPassword} className='space-y-4'>
            <div className='space-y-1'>
                <Label htmlFor="email">E-mail</Label>
                <Input name='email' type='email' id='email' />
            </div>
            <div className='space-y-1'>
                <Label htmlFor="password">Password</Label>
                <Input name='password' type='password' id='password' />

                <Link 
                    href="/auth/forgot-password" 
                    className='text-sm font-medium text-foreground hover:underline'>
                Forgot Your password</Link>
            </div>

            <Button className='w-full' type='submit'>
                Sign in with e-mail
            </Button>

            <Button className='w-full' variant={'link'} size={'sm'} asChild>
                <Link href='/auth/sign-up'>
                    Create a new Account
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
