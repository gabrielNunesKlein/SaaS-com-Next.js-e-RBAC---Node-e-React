import { ability, getCurrentOrg } from '@/auth/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getInvites } from '@/http/get-invites'
import React from 'react'
import RevokeInviteButton from './revoke-invite-button'
import CreateInviteForm from './create-invite-form'

export default async function Invites() {
    const currentOrg = await getCurrentOrg()
    const permissions = await ability()

    const { invites } = await getInvites(currentOrg!)

    return (
        <div className='space-y-4'>
            {permissions?.can('create', 'Invite') && (
                <Card>
                    <CardHeader>
                        <CardTitle>Invite member</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CreateInviteForm />
                    </CardContent>
                </Card>
            )}

            <div className='space-2'>
                <h2 className='text-lg font-semibold'>Invites</h2>
            </div>

            <div className='rounded border'>
                <Table>
                    <TableBody>
                        {invites.map((invite) => (
                            <TableRow key={invite.id}>
                                <TableCell className='p-2.5'>
                                    <span className='text-muted-foreground'>
                                        {invite.email}
                                    </span>
                                </TableCell>
                                <TableCell className='p-2.5 font-medium'>
                                    {invite.role}
                                </TableCell>
                                <TableCell className='p-2.5'>
                                    <div className='flex justify-end'>
                                        {permissions?.can('delete', 'Invite') && (
                                            <RevokeInviteButton inviteId={invite.id} />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        
                        {invites.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center text-muted-foreground">
                                    No invites found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
