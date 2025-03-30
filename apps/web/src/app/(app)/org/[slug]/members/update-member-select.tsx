'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Role } from '@saas/auth'
import React, { ComponentProps } from 'react'
import { updateMemberAction } from './actions'

interface UpdateMemberSelectProps extends ComponentProps<typeof Select> {
    memberId: string
}

export default function UpdateMemberSelect({ memberId, ...props }: UpdateMemberSelectProps) {

    async function updateMemberRole(role: Role){
        updateMemberAction(memberId, role)
    }

    return (
        <Select onValueChange={updateMemberRole} {...props}>
            <SelectTrigger className='w-32 h-8'>
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
    )
}
