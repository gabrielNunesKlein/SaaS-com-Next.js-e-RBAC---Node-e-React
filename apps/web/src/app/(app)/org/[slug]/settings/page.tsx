import { ability } from '@/auth/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import OrganizationForm from '../../organization-form'
import ShutdownOrganizationButton from './shutdown-organization-button'

export default async function SettingsPage() {
    const permisssions = await ability()

    const canUpdateOrganization = permisssions?.can('update', 'Organization')
    const canGetBilling = permisssions?.can('get', 'Billing')
    const canShutdownOrganization = permisssions?.can('delete', 'Organization')

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
                <OrganizationForm />
              </CardContent>
            </Card>
          )}
        </div>

        {canGetBilling && <div>Billing</div>}

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
