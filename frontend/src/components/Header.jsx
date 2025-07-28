import React from 'react'
import { Card, CardHeader, CardTitle } from '@shadcn/ui'
import DarkModeToggle from './DarkModeToggle'
export default function Header() {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-bold">Garmin Activity Dashboard</CardTitle>
        <DarkModeToggle />
      </CardHeader>
    </Card>
  )
}
