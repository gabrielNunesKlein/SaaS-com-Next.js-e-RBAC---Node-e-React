import Header from '@/components/header'
import React from 'react'
import ProjectForm from './project-form'

export default function CreateOrganizarionPage() {
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
