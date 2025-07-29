import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import Skeleton from './ui/Skeleton'
import { fetchDailyTotals } from '../api'
import { TodayDistanceSparkbar } from './ui/TodayDistanceSparkbar'

export default function TodayDistanceCard() {
  const [history, setHistory] = React.useState([])
  const [today, setToday] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    fetchDailyTotals()
      .then((data) => {
        const values = data
          .slice(-8)
          .map((t) => (t.distance ?? 0) / 1000)
        setHistory(values)
        setToday(values[values.length - 1] ?? 0)
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className="animate-in fade-in">
      <CardHeader>
        <CardTitle>Distance Today</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {loading && <Skeleton className="h-8 w-20" />}
        {error && !loading && (
          <div className="text-sm font-normal text-destructive">{error}</div>
        )}
        {!loading && !error && (
          <TodayDistanceSparkbar history={history} todayValue={today} />
        )}
      </CardContent>
    </Card>
  )
}
