import React from 'react'
import { Button } from '@shadcn/ui'
const ITEMS = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'map',       label: 'Map' },
  { value: 'analysis',  label: 'Analysis' },
]

export default function AppNav({ value, onChange }) {
  return (
    <nav className="flex gap-2">
      {ITEMS.map((item) => (
        <Button
          key={item.value}
          size="sm"
          variant={value === item.value ? 'default' : 'ghost'}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
