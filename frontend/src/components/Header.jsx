import React from 'react'
import { Card, CardHeader, CardTitle } from '@shadcn/ui'
import AppNav from './AppNav'
import DarkModeToggle from './DarkModeToggle'
export default function Header({ tab, onTabChange }) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-bold">Garmin Activity Dashboard</CardTitle>
        <div className="flex items-center gap-4">
          <AppNav value={tab} onChange={onTabChange} />
          <DarkModeToggle />
        </div>
      </CardHeader>
    </Card>
  )
}
