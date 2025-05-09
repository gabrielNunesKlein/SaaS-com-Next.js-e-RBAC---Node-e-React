import { Button } from '@/components/ui/button'
import { XOctagon } from 'lucide-react'
import React from 'react'
import { revokeInviteAction } from './actions';

interface RevokeInviteButtonProps {
    inviteId: string;   
}

export default function RevokeInviteButton({ inviteId }: RevokeInviteButtonProps) {
    return (
        <form action={revokeInviteAction.bind(null, inviteId)}>
            <Button size='sm' variant='destructive'>
                <XOctagon className='size-4 mr-2' />
                Revoke Invite
            </Button>
        </form>
    )
}
