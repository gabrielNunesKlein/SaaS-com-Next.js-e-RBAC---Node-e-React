import React from 'react'
import { Button } from './ui/button'
import { ability, getCurrentOrg } from '@/auth/auth'
import NavLink from './nav-link'

export default async function Tabs() {
    const currentOrg = await getCurrentOrg()
    const permisssions = await ability()

    const canUpdateOrganization = permisssions?.can('update', 'Organization')
    const canGetBilling = permisssions?.can('get', 'Billing')
    const canGetMembers = permisssions?.can('get', 'User')
    const canGetProjects = permisssions?.can('get', 'Project')

    return (
        <div className='border-b py-4'>
            <nav className='mx-auto flex max-w-[1200px] items-center gap-2'>
                {canGetProjects && (
                    <Button asChild variant='ghost' size={'sm'} 
                        className='border border-transparent text-muted-foreground data-[current=true]:border-border 
                        data-[current=true]:text-foreground'>
                        <NavLink href={`/org/${currentOrg}`}>
                            Projects
                        </NavLink>
                    </Button>
                )}
                {canGetMembers && (
                    <Button asChild variant='ghost' size={'sm'} 
                        className='border border-transparent text-muted-foreground data-[current=true]:border-border 
                        data-[current=true]:text-foreground'>
                        <NavLink href={`/org/${currentOrg}/members`}>
                            Members
                        </NavLink>
                    </Button>
                )}
                {(canUpdateOrganization || canGetBilling) && (
                    <Button asChild variant='ghost' size={'sm'} 
                        className='border border-transparent text-muted-foreground data-[current=true]:border-border 
                        data-[current=true]:text-foreground'>
                        <NavLink href={`/org/${currentOrg}/settings`}>
                            Settings & Billing
                        </NavLink>
                    </Button>
                )}
            </nav>
        </div>
    )
}
