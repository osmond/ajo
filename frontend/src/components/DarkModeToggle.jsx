'use client'

import { useTheme } from 'next-themes'
import { Button } from '@shadcn/ui'
import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  )
}
