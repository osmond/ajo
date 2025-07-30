import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { fetchDailyTotals } from "../api";
import { haversineDistance, interpolatePoint } from "../lib/geo";
import "leaflet/dist/leaflet.css";

const route = [
  { lat: 37.7749, lon: -122.4194 }, // San Francisco
  { lat: 40.7608, lon: -111.891 },  // Salt Lake City
  { lat: 39.7392, lon: -104.9903 }, // Denver
  { lat: 39.0997, lon: -94.5786 },  // Kansas City
  { lat: 41.8781, lon: -87.6298 },  // Chicago
  { lat: 40.7128, lon: -74.006 },   // New York
];

function buildCumulativeDistances(points) {
  const dists = [0];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const d = haversineDistance(prev.lat, prev.lon, curr.lat, curr.lon);
    dists.push(dists[i - 1] + d);
  }
  return dists;
}

export default function VirtualPathMap() {
  const [progress, setProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchDailyTotals()
      .then((rows) => {
        const total = rows.reduce((sum, r) => sum + r.distance, 0);
        setProgress(total);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const cum = React.useMemo(() => buildCumulativeDistances(route), []);

  let traveled = [];
  let markerPos = route[0];

  if (progress > 0) {
    for (let i = 1; i < route.length; i++) {
      if (progress >= cum[i]) {
        traveled.push(route[i]);
      } else {
        const segDist = progress - cum[i - 1];
        const point = interpolatePoint(route[i - 1], route[i], segDist);
        traveled.push(point);
        markerPos = point;
        break;
      }
    }
    if (progress >= cum[cum.length - 1]) {
      markerPos = route[route.length - 1];
    }
  }

  const center = route[0];

  if (loading) return <div className="h-64">Loading...</div>;
  if (error) return <div className="h-64 text-destructive">{error}</div>;

  return (
    <div className="h-64">
      <MapContainer center={[center.lat, center.lon]} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={route.map(p => [p.lat, p.lon])} pathOptions={{ color: '#ccc', dashArray: '4' }} />
        {traveled.length > 0 && (
          <Polyline positions={[[route[0].lat, route[0].lon], ...traveled.map(p => [p.lat, p.lon])]} pathOptions={{ color: 'hsl(var(--primary))' }} />
        )}
        <Marker position={[markerPos.lat, markerPos.lon]} data-testid="progress-marker">
          <Popup>Total Distance: {(progress / 1000).toFixed(1)} km</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
