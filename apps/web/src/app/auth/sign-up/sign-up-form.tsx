'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'
import { AlertTriangle, Github, Loader2 } from 'lucide-react'
import { useFormState } from '@/hooks/use-form-state'
import { signUpAction } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { signInWithGithub } from '../actions'

export default function SignUpForm() {
    
    const [{success, errors, message}, handleSubmit, isPading] = useFormState(signUpAction)

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                {success === false && (
                    <Alert variant={'destructive'}>
                        <AlertTriangle className="size-4" />
                        <AlertTitle>Sign Up falied</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" type="text" id="name" />

                    {errors?.name && (
                        <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.name[0]}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="email">E-mail</Label>
                    <Input name="email" type="email" id="email" />

                    {errors?.email && (
                        <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.email[0]}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" id="password" />
                    {errors?.password && (
                        <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.password[0]}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirm Your Password</Label>
                    <Input name="confirmPassword" type="password" id="confirmPassword" />
                    {errors?.confirmPassword && (
                        <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.confirmPassword[0]}</p>
                    )}
                </div>

                <Button className="w-full" type="submit">
                    {isPading ? <Loader2 className='size-4 animate-spin' /> : "Create Account" }
                </Button>

                <Button className="w-full" variant={'link'} size={'sm'} asChild>
                    <Link href="/auth/sign-in">Already registered? Sign In</Link>
                </Button>
            </form>

            <Separator />

            <form className="space-y-4" onSubmit={signInWithGithub}>
                <Button className="w-full" type="submit" variant={'outline'}>
                    <Github className="mr-2 size-4" />
                    Sign in with GitHub
                </Button>
            </form>
        </div>

    )
}
