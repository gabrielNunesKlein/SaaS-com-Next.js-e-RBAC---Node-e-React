import { ability } from '@/auth/auth'
import React from 'react'
import Invites from './invites'
import MembersList from './members-list'

export default async function MembersPage() {
    
    const permissons = await ability()

    return (
        <div className='space-y-4'>
            <h1 className='text-2xl font-bold'>Members</h1>

            <div className='space-y-4'>
                {permissons?.can('get', 'Invite') && <Invites />}
                {permissons?.can('get', 'User') && <MembersList />}
            </div>
        </div>
    )
}
