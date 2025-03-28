'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ChevronsUpDown, Link, PlusCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/http/get-projects'

export default function ProjectSwatcher() {

    const { slug: orgSlug } = useParams<{
        slug: string
    }>()

    const { data, isLoading } = useQuery({
        queryKey: [orgSlug, 'projects'],
        queryFn: () => getProjects(orgSlug),
        enabled: !!orgSlug
    })

    console.log('Data >>> ', data, orgSlug)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
                {/* {currentOrganization ? (
                    <>
                    <Avatar className="mr-2 size-4">
                        {currentOrganization.avatarUrl && (
                        <AvatarImage src={currentOrganization.avatarUrl} />
                        )}
                        <AvatarFallback />
                    </Avatar>
                    <span className="truncate text-left">
                        {currentOrganization.name}
                    </span>
                    </>
                ) : ( */}
                <span className="text-muted-foreground">Select project</span>
                {/* )} */}
                <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                alignOffset={-16}
                sideOffset={12}
                className="w-[200px]"
            >
                <DropdownMenuGroup>
                <DropdownMenuLabel>Projects</DropdownMenuLabel>
                {/* {organizations.map((organization) => {
                    return ( */}
                <DropdownMenuItem /* key={organization.id} */ asChild>
                    <Link href={''}>
                    <Avatar className="mr-2 size-4">
                        {/* {organization.avatarUrl && (
                                <AvatarImage src={organization.avatarUrl} />
                            )} */}
                        <AvatarFallback />
                    </Avatar>
                    <span className="line-clamp-1">Projeto teste</span>
                    </Link>
                </DropdownMenuItem>
                {/* )
                    })} */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                <Link href="">
                    <PlusCircle className="mr-2 size-4" />
                    Create new
                </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
