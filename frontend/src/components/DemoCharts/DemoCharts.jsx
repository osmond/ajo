import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Label,
} from 'recharts';
import { modeData, timeData, mileageData } from './data';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import ModeLegend from '../ModeLegend';

// Use theme-based colors so the charts adapt to light and dark modes
const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))'];
const TIME_COLOR = 'hsl(var(--primary))';
const MILEAGE_COLOR = 'hsl(var(--accent))';

export default function DemoCharts() {
  const total = modeData[0].value + modeData[1].value;
  const tPct = (modeData[0].value / total) * 100;
  const oPct = (modeData[1].value / total) * 100;
  return (
    <div className="space-y-8 p-6 bg-background text-foreground rounded-xl relative">
      {/* 1) Donut */}
      <Card className="animate-in fade-in">
        <CardHeader>
          <CardTitle>Treadmill vs Outdoor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {modeData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx]} />
                  ))}
                  <Label value={`${modeData[0].value}% / ${modeData[1].value}%`} position="center" />
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ModeLegend treadmillPct={tPct} outdoorPct={oPct} colors={COLORS} />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-12">
        {/* 2) Activity by Time */}
        <Card className="text-center animate-in fade-in">
          <CardHeader>
            <CardTitle>Workout Activity by Time</CardTitle>
            <p className="text-sm text-muted-foreground">
              Andy spends a lot of time doing this. Radial distance shows the
              percentage of workouts that begin in each three-hour slot.
            </p>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={timeData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 30]}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Radar
                    name="activity"
                    dataKey="pct"
                    stroke={TIME_COLOR}
                    fill={TIME_COLOR}
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3) Mileage by Day */}
        <Card className="text-center animate-in fade-in">
          <CardHeader>
            <CardTitle>Average Daily Mileage by Day</CardTitle>
            <p className="text-sm text-muted-foreground">
              Andy probaly runs more on the weekend
            </p>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={mileageData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <PolarRadiusAxis angle={30} domain={[0, 6]} tick={false} />
                  <Radar
                    name="mileage"
                    dataKey="mi"
                    stroke={MILEAGE_COLOR}
                    fill={MILEAGE_COLOR}
                    fillOpacity={0.6}
                  />
                  <Tooltip formatter={(val) => [`${val} mi`, ""]} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
