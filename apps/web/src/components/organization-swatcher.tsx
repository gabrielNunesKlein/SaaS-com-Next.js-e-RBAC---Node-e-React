
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ChevronsUpDown, Plus, PlusCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { GetOrganizations } from '@/http/get-organizations'

export default async function OrganizationSWatcher() {

    const { organizations } = await GetOrganizations() 

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex w-[168px] items-center gap-2 p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer'>
                <span className='text-muted-foreground'>Select organization</span>
                <ChevronsUpDown className='ml-auto size-4 text-muted-foreground' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[200px] min-h-[145px]' sideOffset={12} alignOffset={-16}>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                    {organizations.map((organization) => (
                        <DropdownMenuItem key={organization.id} asChild>
                            <Link href={`/organization/${organization.slug}`}>
                                <Avatar className='mr-2 size-4'>
                                    {organization.avatarUrl && (
                                        <AvatarImage src={organization.avatarUrl} />
                                    )}
                                    <AvatarFallback />
                                </Avatar>
                                <span className='line-clamp-1'>{organization.name}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator>
                    <DropdownMenuItem asChild>
                        <Link href={'/create-organization'}>
                            <PlusCircle className='size-4 mr-2' />
                            Create Organization
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuSeparator>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
