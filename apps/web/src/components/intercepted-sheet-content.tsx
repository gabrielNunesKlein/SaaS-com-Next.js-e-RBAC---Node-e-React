'use client'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X, XIcon } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { SheetOverlay, SheetPortal } from './ui/sheet'

export function InterceptionSheetContent({
  className,
  children,
  side = 'right',
  title = 'Dialog', // Título opcional
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  title?: string
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(true) // Estado controlado

  function onDismiss() {
    console.log('DISMISS >>>')
    setOpen(false)
    router.back()
    //setTimeout(() => router.back(), 300);
  }

  return (
    <SheetPortal>
      <SheetOverlay/>
      <SheetPrimitive.Content
        onEscapeKeyDown={onDismiss}
        onPointerDownOutside={onDismiss}
        data-slot="sheet-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
          side === 'right' &&
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
          side === 'left' &&
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
          side === 'top' &&
            'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
          side === 'bottom' &&
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
          className
        )}
        {...props}
      >
        {/* Adicionando um título acessível */}
        <SheetPrimitive.Title className="sr-only">{title}</SheetPrimitive.Title>

        {children}

        <button
          onClick={onDismiss}
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary rounded-xs focus:outline-hidden absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </button>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

InterceptionSheetContent.displayName = SheetPrimitive.Content.displayName
