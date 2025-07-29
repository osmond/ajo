import React from 'react';
import {
  ResponsiveContainer,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
} from 'recharts';
import {
  Thermometer, Cloud, Sun, CloudRain, CloudSnow,
  Haze, Droplet, CloudFog, Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { temperatureData, weatherData } from './DemoWeatherData';

export default function DemoWeatherCharts() {
  return (
    <div className="space-y-8">
      {/* Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              layout="vertical"
              data={temperatureData}
              margin={{ left: 100, right: 20, top: 20, bottom: 20 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="label"
                width={100}
                tickLine={false}
                axisLine={false}
                  tick={({ x, y, payload }) => {
                    const entry = temperatureData.find(d => d.label === payload.value);
                    const range = entry ? entry.range : "";
                    return (
                      <text
                        x={x - 8}
                        y={y + 4}
                        textAnchor="end"
                        fontSize={12}
                        fill="#334155"
                      >
                        {payload.value}
                        <tspan fill="#64748B">  {range}</tspan>
                      </text>
                    );
                  }}
                />
              <Tooltip
                formatter={(val) => [`${val} runs`, ""]}
                cursor={{ fill: "rgba(56, 189, 248, 0.1)" }}
              />
              <Bar
                dataKey="count"
                fill="#94A3B8"
                barSize={20}
                radius={[4, 4, 4, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weather Conditions Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              layout="vertical"
              data={weatherData}
              margin={{ left: 120, right: 20, top: 20, bottom: 20 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="condition"
                width={120}
                tickLine={false}
                axisLine={false}
                  tick={({ x, y, payload }) => {
                    const entry = weatherData.find(d => d.condition === payload.value);
                    const Icon = entry ? entry.icon : null;
                    return (
                      <g transform={`translate(${x - 40},${y - 10})`}>
                        {Icon && (
                          <Icon size={16} fill="none" stroke="#334155" />
                        )}
                        <text x={24} y={16} fontSize={12} fill="#334155">
                          {payload.value}
                        </text>
                      </g>
                    );
                  }}
                />
              <Tooltip
                formatter={(val) => [`${val} runs`, ""]}
                cursor={{ fill: "rgba(56, 189, 248, 0.1)" }}
              />
              <Bar
                dataKey="count"
                fill="#CBD5E1"
                barSize={20}
                radius={[4, 4, 4, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
