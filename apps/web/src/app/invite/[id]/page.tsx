import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getInvite } from '@/http/get-invite';
import dayjs from 'dayjs';
import React from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import { auth, isAutenticated } from '@/auth/auth';
import { Button } from '@/components/ui/button';
import { CheckCircle, LogIn } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { acceptInvite } from '@/http/accept-invite';


dayjs.extend(relativeTime)

interface InvitePageProps {
    params: {
        id: string;
    }
}

export default async function InvitePage({ params }: InvitePageProps) {

    const inviteId = params.id
    const { invite } = await getInvite(inviteId)
    const isUserAuthenticated = await isAutenticated()

    let currentUserEmail = null
 
    if (isUserAuthenticated) {
      const { user } = await auth()
  
      currentUserEmail = user.email
    }

    const userIsAuthenticatedWithSameEmailFromInvite = currentUserEmail === invite.email

    async function signInFromInvite() {
        'use server'
        const cookiesStore = await cookies()

        cookiesStore.set('inviteId', inviteId)
        redirect(`/auth/sign-in?email=${invite.email}`)
    }

    async function acceptInviteAction(){
        'use server'

        await acceptInvite(inviteId)
        redirect('/')
    }

    return (
        <div className="min-h-screen flex items-center justify-center flex-col px-4">
            <div className="w-full max-w-sm space-y-6 flex flex-col justify-center">
                <div className='flex flex-col items-center spcae-y-4'>
                    <Avatar className='size-16'>
                        {invite.author?.avatarUrl && (
                            <AvatarImage src={invite.author.avatarUrl} />
                        )}
                        <AvatarFallback />
                    </Avatar>

                    <p className='text-center leading-relaxed text-muted-foreground text-balance'>
                        <span className='font-medium text-foreground'>{invite.author?.name ?? 'Someone'}</span>{' '}
                        invited you to join <span className='font-medium text-foreground'>{invite.organization.name}</span>{' '}
                        <span className='text-xs'>{dayjs(invite.createdAt).fromNow()}</span>
                    </p>
                </div>

                <Separator />

                {!isUserAuthenticated && (
                    <form action={signInFromInvite}>
                        <Button type='submit' variant={'secondary'} className='w-full'>
                            <LogIn className='size-4 mr-2' />
                            Sign in accept the invite
                        </Button>
                    </form>
                )}
                
                {userIsAuthenticatedWithSameEmailFromInvite && (
                    <form action={acceptInviteAction}>
                        <Button type="submit" variant="secondary" className="w-full">
                            <CheckCircle className="mr-2 size-4" />
                            Join {invite.organization.name}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    )
}
