import React from "react"
import { histogram, range } from "d3-array"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card"

// replace this with your actual per-mile paces in seconds
const rawPaceSeconds = [
  /* e.g. 540, 600, 570, ... each value = seconds per mile */
]

// helper to format seconds -> "MM:SS"
function fmt(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

export default function PaceDistributionChart() {
  // 1. Compute histogram bins from 5:00-12:00 (300-720 sec)
  const bins = histogram()
    .domain([300, 720])
    .thresholds(range(300, 720, 15)) // 15-sec bins
    (rawPaceSeconds)

  // 2. Turn bins into Recharts data
  const data = bins.map((bin) => {
    const center = (bin.x0 + bin.x1) / 2
    return {
      pace: fmt(center),
      pos: bin.length,
      neg: -bin.length,
    }
  })

  // 3. Compute median pace for the ref line
  const sorted = [...rawPaceSeconds].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median =
    sorted.length % 2 === 1
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2

  return (
    <Card>
      <CardHeader>
        <CardTitle>PACE DISTRIBUTION</CardTitle>
        <p className="text-sm text-muted-foreground">
          pretty much the easy pace I revert to these days — mean: {fmt(
            sorted.reduce((sum, x) => sum + x, 0) / sorted.length
          )} | median: {fmt(median)}
        </p>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
          >
            <XAxis
              type="number"
              domain={["dataMin - 1", "dataMax + 1"]}
              axisLine={false}
              tick={false}
            />
            <YAxis
              dataKey="pace"
              type="category"
              axisLine={false}
              tickLine={false}
              width={60}
              tick={{ fill: "var(--foreground)", fontSize: 12 }}
            />
            <ReferenceLine x={0} stroke="#64748B" strokeDasharray="3 3" />
            <ReferenceLine
              x={0}
              label={{
                position: "left",
                value: fmt(median),
                fill: "var(--accent)",
                fontSize: 12,
                dy: -6,
              }}
            />
            <Tooltip
              formatter={(val) => [`${Math.abs(val)} runs`]}
              labelFormatter={(pace) => `Pace: ${pace}`}
            />
            <Area
              dataKey="neg"
              fill="var(--foreground)"
              stroke="var(--foreground)"
              type="monotone"
              isAnimationActive={false}
            />
            <Area
              dataKey="pos"
              fill="var(--foreground)"
              stroke="var(--foreground)"
              type="monotone"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
