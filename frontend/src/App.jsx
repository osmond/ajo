import React, { useState, useEffect } from "react";

export default function App() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  const rawBase = import.meta.env.VITE_BACKEND_URL || "";
  const baseUrl = rawBase.replace(/\/$/, "");

  useEffect(() => {
    const url = `${baseUrl}/activities?start=0&limit=20`;
    fetch(url)
      .then((res) => res.json())
      .then(setActivities)
      .catch(setError);
  }, [baseUrl]);

  if (error) return <div className="p-4 text-red-600">Error: {error.toString()}</div>;
  if (!activities.length) return <div className="p-4">Loading…</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dummy Garmin Activities</h1>
      <ul className="bg-white p-4 rounded shadow">
        {activities.map(act => (
          <li key={act.activityId} className="border-b py-2 last:border-0">
            <span className="font-semibold">{act.activityType.typeKey}</span>
             — {new Date(act.startTimeLocal).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
