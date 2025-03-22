import Image from 'next/image'
import React from 'react'
import ProfileButton from './profile-button'
import { Slash } from 'lucide-react'
import OrganizationSWatcher from './organization-swatcher'

export default function Header() {

    return (
        <div className='mx-auto flex max-w-[1200px] items-center justify-between'>
            <div className='flex items-center gap-3'>
                <div className='relative size-4'>
                    <Image src={'/vercel.svg'} className='object-cover' fill alt='Logo' />
                </div>
                
                <Slash className='size-3 -rotate-[24deg] text-border' />
                <OrganizationSWatcher />
            </div>

            <div className='flex items-center gap-4'>
                <ProfileButton />
            </div>
        </div>
    )
}
