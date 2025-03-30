import { ability, getCurrentOrg } from '@/auth/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import OrganizationForm from '../../organization-form'
import ShutdownOrganizationButton from './shutdown-organization-button'
import { getOrganization } from '@/http/get-organization'
import Belling from './belling'

export default async function SettingsPage() {
    const currentOrg = await getCurrentOrg()
    const permisssions = await ability()

    const canUpdateOrganization = permisssions?.can('update', 'Organization')
    const canGetBilling = permisssions?.can('get', 'Billing')
    const canShutdownOrganization = permisssions?.can('delete', 'Organization')

    const { organization } = await getOrganization(currentOrg!)

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="space-y-4">
          {canUpdateOrganization && (
            <Card>
              <CardHeader>
                <CardTitle>Organization settings</CardTitle>
                <CardDescription>
                  Update your organization details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrganizationForm 
                    isUpdating={true}
                    initialData={{
                        name: organization.name,
                        domain: organization.domain,
                        shouldAttachUsersByDomain: organization.shouldAttachUsersByDomain
                    }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {canGetBilling && 
            <Belling />
        }

        {canShutdownOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization settings</CardTitle>
              <CardDescription>
                This will delete all organization data including all projects. You cannot undo this action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShutdownOrganizationButton />
            </CardContent>
          </Card>
        )}
      </div>
    )
}
