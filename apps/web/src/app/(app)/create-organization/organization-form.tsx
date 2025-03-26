'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { createOrganizationAction } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'

export default function OrganizationForm() {

    const [{success, errors, message}, handleSubmit, isPading] = useFormState(createOrganizationAction)
    
    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        {success === false && message && (
          <Alert variant={'destructive'}>
            <AlertTriangle className="size-4" />
            <AlertTitle>Organization Falied</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {success === true && message && (
          <Alert variant={'success'}>
            <AlertTriangle className="size-4" />
            <AlertTitle>Organization Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="name">Organization Name</Label>
          <Input name="name" type="text" id="name" />

          {errors?.name && (
            <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="domain">E-mail domain</Label>
          <Input
            name="domain"
            type="text"
            id="domain"
            inputMode="url"
            placeholder="example.com"
          />

          {errors?.domain && (
                    <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.domain[0]}</p>
                )}
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <Checkbox
              name="shouldAttachUsersByDomain"
              id="shouldAttachUsersByDomain"
              className="translate-0.5"
            />
            <label htmlFor="shouldAttachUsersByDomain" className="space-y-">
              <span className="text-sm font-medium leading-none">
                Auto-join new mwmbers
              </span>
              <p className="text-muted-foreground text-sm">
                This will automatically invite all members with same e-mail
                domain to this organization.
              </p>
            </label>
          </div>
          {errors?.shouldAttachUsersByDomain && (
            <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.shouldAttachUsersByDomain[0]}</p>
           )}
        </div>

        <Button className="w-full" type="submit" disabled={isPading}>
            {isPading ? <Loader2 className='size-4 animate-spin' /> : "Save organization" }
        </Button>
      </form>
    )
}
