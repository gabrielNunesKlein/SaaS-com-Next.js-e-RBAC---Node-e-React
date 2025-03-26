import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React from 'react'
import OrganizationForm from '../../create-organization/organization-form'

export default function CreateOrganization() {
    return (
        <Sheet defaultOpen>
            <SheetContent className='p-5'>
                <SheetHeader>
                    <SheetTitle>
                        Create Organization
                    </SheetTitle>
                </SheetHeader>

                <div className='py-4'>
                    <OrganizationForm />
                </div>
            </SheetContent>
        </Sheet>
    )
}
