import { BarChart, Bar, ReferenceLine, ResponsiveContainer, XAxis } from 'recharts'

export function TodayDistanceSparkbar({ history, todayValue }) {
  return (
    <ResponsiveContainer width={120} height={32}>
      <BarChart
        data={history.map((d, i) => ({ index: i, v: d }))}
        margin={{ top: 4, bottom: 4, left: 0, right: 0 }}
      >
        <XAxis dataKey="index" hide tick={false} />
        <Bar dataKey="v" fill="hsl(var(--accent))" barSize={6} />
        <ReferenceLine
          x={history.length - 1}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
