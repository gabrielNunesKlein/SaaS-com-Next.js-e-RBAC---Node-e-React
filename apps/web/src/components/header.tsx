import Image from 'next/image'
import React from 'react'
import ProfileButton from './profile-button'
import { Slash } from 'lucide-react'
import OrganizationSWatcher from './organization-swatcher'
import { ability } from '@/auth/auth'
import { Separator } from './ui/separator'
import ThemeSwatcher from './theme/theme-swatcher'
import ProjectSwatcher from './project-swatcher'

export default async function Header() {

    const permissions = await ability()

    return (
        <div className='mx-auto flex max-w-[1200px] items-center justify-between'>
            <div className='flex items-center gap-3'>
                <div className='relative size-4'>
                    <Image src={'/vercel.svg'} className='object-cover invert dark:invert-0' fill alt='Logo' />
                </div>
                
                <Slash className='size-3 -rotate-[24deg] text-border' />
                <OrganizationSWatcher />

                {permissions?.can('get', 'Project') && (
                    <>
                        <Slash className='size-3 -rotate-[24deg] text-border' />
                        <ProjectSwatcher />
                    </>
                )}
            </div>

            <div className='flex items-center gap-4'>
                <ThemeSwatcher />
                <Separator orientation='vertical' className='h-5' />
                <ProfileButton />
            </div>
        </div>
    )
}
