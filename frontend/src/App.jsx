import React from 'react'
import Header from './components/Header'
import KPIGrid from './components/KPIGrid'
import TrendsSection from './components/TrendsSection'
import MapSection from './components/MapSection'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@shadcn/ui'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto space-y-8 px-4 py-6">
        <KPIGrid />

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <TrendsSection />
          </TabsContent>
          <TabsContent value="map">
            <MapSection />
          </TabsContent>
          <TabsContent value="analysis">
            {/* your analysis view here */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
