'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { signInWithEmailAndPassword } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, Github, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFormState } from '@/hooks/use-form-state'

export default function SignInForm() {
    // const [{ success, message, errors }, formAction, isPading] = useActionState(
    //     signInWithEmailAndPassword,
    //     { success: true, message: null, errors: null }
    // )
    
    const [{success, errors, message}, handleSubmit, isPading] = useFormState(signInWithEmailAndPassword)

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            {success === false && (
                <Alert variant={'destructive'}>
                    <AlertTriangle className='size-4' />
                    <AlertTitle>Sign In falied</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}
            <div className='space-y-1'>
                <Label htmlFor="email">E-mail</Label>
                <Input name='email' type='email' id='email' />

                {errors?.email && (
                    <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.email[0]}</p>
                )}
            </div>
            <div className='space-y-1'>
                <Label htmlFor="password">Password</Label>
                <Input name='password' type='password' id='password' />

                {errors?.password && (
                    <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.password[0]}</p>
                )}

                <Link 
                    href="/auth/forgot-password" 
                    className='text-sm font-medium text-foreground hover:underline'>
                Forgot Your password</Link>
            </div>

            <Button className='w-full' type='submit' disabled={isPading}>
                {isPading ? <Loader2 className='size-4 animate-spin' /> : "Sign in with e-mail" }
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
