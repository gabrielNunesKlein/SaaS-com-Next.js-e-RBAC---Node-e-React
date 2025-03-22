import Image from 'next/image'
import React from 'react'
import ProfileButton from './profile-button'

export default function Header() {

    return (
        <div className='mx-auto flex max-w-[1200px] items-center justify-between'>
            <div className='flex items-center gap-3 relative size-4'>
                <Image src={'/vercel.svg'} className='object-cover' fill alt='Logo' />
            </div>

            <div className='flex items-center gap-4'>
                <ProfileButton />
            </div>
        </div>
    )
}
