"use client"
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeSwatcher() {
    const { resolvedTheme, setTheme } = useTheme()

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} size={'icon'}>
            {resolvedTheme == 'ligth' && <Sun className="size-4" />}
            {resolvedTheme == 'dark' && <Moon className="size-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('ligth')}>Ligth</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
}
