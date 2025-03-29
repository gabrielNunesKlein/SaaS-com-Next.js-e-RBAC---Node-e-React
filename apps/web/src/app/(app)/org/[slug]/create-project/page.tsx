import Header from '@/components/header'
import React from 'react'
import ProjectForm from './project-form'
import { ability } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function CreateOrganizarionPage() {

    const permissions = await ability()
    
    if(permissions?.cannot('create', 'Project')){
        redirect('/')
    }

    return (
        <div className="py-4 space-y-4">
            <Header />
            <main className="mx-auto w-full max-w-[1200px] space-y-4">
                <h1 className='text-2xl font-bold'>Create Organization</h1>
                <ProjectForm />
            </main>
        </div>
    )
}
