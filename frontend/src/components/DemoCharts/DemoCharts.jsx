import React from 'react';
import {
  PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer,
} from 'recharts';
import { modeData, timeData, mileageData } from './data';

const COLORS = ['#555', '#DDD'];
const TIME_COLOR = '#AEC6CF';
const MILEAGE_COLOR = '#FFB347';

export default function DemoCharts() {
  return (
    <div className="space-y-8 p-6 bg-gray-900 text-white rounded-xl relative">
      {/* 1) Donut */}
      <div className="text-center">
        <h2 className="text-lg font-semibold">TREADMILL VS OUTDOOR</h2>
        <div className="relative mx-auto" style={{ width: 200, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={modeData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                dataKey="value"
                startAngle={90} endAngle={-270}
              >
                {modeData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="uppercase opacity-60">treadmill</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* 2) Activity by Time */}
        <div className="text-center">
          <h2 className="text-lg font-semibold">WORKOUT ACTIVITY BY TIME</h2>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={timeData}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="time" stroke="#AAA" />
                <PolarRadiusAxis angle={30} domain={[0, 30]} tick={false} />
                <Radar name="activity" dataKey="pct" stroke={TIME_COLOR} fill={TIME_COLOR} fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3) Mileage by Day */}
        <div className="text-center">
          <h2 className="text-lg font-semibold">AVERAGE DAILY MILEAGE BY DAY</h2>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={mileageData}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="day" stroke="#AAA" />
                <PolarRadiusAxis angle={30} domain={[0, 6]} tick={false} />
                <Radar name="mileage" dataKey="mi" stroke={MILEAGE_COLOR} fill={MILEAGE_COLOR} fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
