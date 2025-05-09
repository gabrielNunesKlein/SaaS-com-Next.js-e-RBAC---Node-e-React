'use client'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Check, UserPlus2, X } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPendingInvites } from '@/http/get-peading-invites'
import { acceptInvite } from '@/http/accept-invite'
import { rejectInviteAction } from './actions'

dayjs.extend(relativeTime)

export default function PeadingInvites() {
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['peading-invites'],
        queryFn: getPendingInvites,
        enabled: isOpen,
    })


    async function handleAcceptInvite(inviteId: string) {
        await acceptInvite(inviteId)

        queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
    }

    async function handleRejectInvite(inviteId: string) {
        await rejectInviteAction(inviteId)

        queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                    <UserPlus2 className="size-4" />
                    <span className="sr-only">Peading Invites</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 space-y-2">
                <span className="block text-sm font-medium">
                    Pending Invites ({data?.invites.length ?? 0})
                </span>

                {data?.invites.length === 0 && (
                    <p className="text-muted-foreground text-sm">No invites found.</p>
                )}

                {data?.invites.map((invite) => {
                    return (
                        <div className="space-y-2" key={invite.id}>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                <span className="text-foreground font-medium">
                                    {invite.author?.name}
                                </span>{' '}
                                invited you to join{' '}
                                <span className="text-foreground font-medium">
                                    {invite.organization?.name}
                                </span>{' '}
                                <span>{dayjs(invite.createdAt).fromNow()}</span>
                            </p>

                            <div className="flex gap-1">
                                <Button size="xs" variant="outline" onClick={() => handleAcceptInvite(invite.id)}>
                                    <Check className="mr-1.5 size-3" />
                                    Accept
                                </Button>

                                <Button
                                    size="xs"
                                    variant="ghost"
                                    className="text-muted-foreground"
                                    onClick={() => handleRejectInvite(invite.id)}
                                >
                                    <X className="mr-1.5 size-3" />
                                    Revoke
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </PopoverContent>
        </Popover>
    )
}
