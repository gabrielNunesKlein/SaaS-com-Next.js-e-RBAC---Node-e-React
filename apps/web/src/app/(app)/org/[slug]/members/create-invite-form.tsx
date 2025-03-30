'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, Loader2, UserPlus } from 'lucide-react'
import React from 'react'
import { createInviteAction } from './actions'
import { useFormState } from '@/hooks/use-form-state'

export default function CreateInviteForm() {
    const [{success, errors, message}, handleSubmit, isPading] = useFormState(createInviteAction)
    
    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        {success === false && message && (
          <Alert variant={'destructive'}>
            <AlertTriangle className="size-4" />
            <AlertTitle>Invite Falied</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {success === true && message && (
          <Alert variant={'success'}>
            <AlertTriangle className="size-4" />
            <AlertTitle>Invite Save With Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className='flex items-center gap-2'>
            <div className="space-y-1 flex-1">
                <Input name="email" type="email" id="email" placeholder='joh@example.com' />

                {errors?.email && (
                    <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.email[0]}</p>
                )}
            </div>
            
            <Select name='role' defaultValue="MEMBER">
                <SelectTrigger className='w-32'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='ADMIN'>
                        Admin
                    </SelectItem>
                    <SelectItem value='MEMBER'>
                        Member
                    </SelectItem>
                    <SelectItem value='BILLING'>
                        Billing
                    </SelectItem>
                </SelectContent>
            </Select>

            <Button type="submit" disabled={isPading}>
                {isPading ? <Loader2 className='size-4 animate-spin' /> : 
                    <>
                        <UserPlus />
                        Invite User
                    </>
                }
            </Button>
        </div>
      </form>
    )
}
