import React from 'react';
import ChartCard from './ChartCard';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { fetchActivities } from '../api';
import Skeleton from './ui/Skeleton';

ChartJS.register(PointElement, LinearScale, Tooltip, Legend, CategoryScale);

export default function TimeOfDay() {
  const [points, setPoints] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchActivities({ type: 'run' })
      .then((rows) => {
        const pts = rows.map((r) => {
          const [date, time] = r.startTimeLocal.split('T');
          const [h, m, s] = time.split(':').map(Number);
          const hour = h + m / 60 + s / 3600;
          return { x: hour, y: date };
        });
        setPoints(pts);
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const data = {
    datasets: [
      {
        data: points,
        backgroundColor: 'hsl(var(--primary))',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        min: 0,
        max: 24,
        title: { display: true, text: 'Hour' },
      },
      y: {
        type: 'category',
        title: { display: true, text: 'Date' },
      },
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <ChartCard title="Time of Day">
      <div className="h-64">
        {loading && <Skeleton className="h-full w-full" />}
        {error && (
          <div className="flex h-full items-center justify-center text-sm text-destructive">{error}</div>
        )}
        {!loading && !error && <Scatter data={data} options={options} />}
      </div>
    </ChartCard>
  );
}
