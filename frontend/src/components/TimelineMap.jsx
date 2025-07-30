import React from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { motion } from "framer-motion";
import TrackMap from "./TrackMap";
import { fetchActivitiesByDate, fetchActivityTrack } from "../api";
import "react-horizontal-scrolling-menu/dist/styles.css";

function monthLabel(monthKey) {
  const [y, m] = monthKey.split("-");
  const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
  return d.toLocaleString("default", { month: "short", year: "numeric" });
}

export default function TimelineMap() {
  const [months, setMonths] = React.useState([]);
  const [selected, setSelected] = React.useState("");
  const [tracks, setTracks] = React.useState([]);

  React.useEffect(() => {
    fetchActivitiesByDate()
      .then((groups) => {
        const byMonth = {};
        for (const date of Object.keys(groups)) {
          const month = date.slice(0, 7);
          byMonth[month] ||= [];
          byMonth[month].push(...groups[date]);
        }
        const keys = Object.keys(byMonth).sort();
        setMonths(keys.map((k) => ({ key: k, acts: byMonth[k] })));
        setSelected(keys[keys.length - 1]);
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    if (!selected) return;
    const month = months.find((m) => m.key === selected);
    if (!month) return;
    Promise.all(month.acts.map((a) => fetchActivityTrack(a.activityId))).then((all) => {
      setTracks(all.flat());
    });
  }, [selected, months]);

  return (
    <div className="space-y-4">
      <ScrollMenu>
        {months.map((m) => (
          <button
            key={m.key}
            className={`mx-1 px-2 py-1 rounded whitespace-nowrap border transition-colors ${
              m.key === selected ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
            onClick={() => setSelected(m.key)}
          >
            {monthLabel(m.key)}
          </button>
        ))}
      </ScrollMenu>
      <div className="h-64">
        <React.Suspense fallback={<div className="h-64">Loading...</div>}>
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <TrackMap points={tracks} />
          </motion.div>
        </React.Suspense>
      </div>
    </div>
  );
}
