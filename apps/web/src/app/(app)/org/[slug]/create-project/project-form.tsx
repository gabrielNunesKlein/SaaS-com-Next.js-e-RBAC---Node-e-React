'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { createProjectAction } from './actions'
import { Textarea } from '@/components/ui/textarea'

export default function ProjectForm() {

    const [{success, errors, message}, handleSubmit, isPading] = useFormState(createProjectAction)
    
    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        {success === false && message && (
          <Alert variant={'destructive'}>
            <AlertTriangle className="size-4" />
            <AlertTitle>Project Falied</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {success === true && message && (
          <Alert variant={'success'}>
            <AlertTriangle className="size-4" />
            <AlertTitle>Project Save With Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="name">Project Name</Label>
          <Input name="name" type="text" id="name" />

          {errors?.name && (
            <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            name='description'
            id='description'
          />

          {errors?.description && (
                    <p className='text-xs font-medium text-red-500 dark:text-red-400'>{errors.description[0]}</p>
                )}
        </div>

        <Button className="w-full" type="submit" disabled={isPading}>
            {isPading ? <Loader2 className='size-4 animate-spin' /> : "Save Project" }
        </Button>
      </form>
    )
}
