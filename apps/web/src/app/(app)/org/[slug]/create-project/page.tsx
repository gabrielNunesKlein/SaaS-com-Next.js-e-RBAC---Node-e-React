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
        <div>
            <h1 className='text-2xl font-bold'>Create Project</h1>
            <ProjectForm />
        </div>
    )
}
