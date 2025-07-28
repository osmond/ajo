import React from "react";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function RouteHeatmap({ coords }) {
  if (!coords.length) return null;
  const center = [coords[0].lat, coords[0].lon];
  const grid = {};
  coords.forEach((p) => {
    const key = `${p.lat.toFixed(3)},${p.lon.toFixed(3)}`;
    grid[key] = (grid[key] || 0) + 1;
  });
  const points = Object.entries(grid).map(([k, count]) => {
    const [lat, lon] = k.split(",").map(Number);
    return { lat, lon, count };
  });
  const max = Math.max(...points.map((p) => p.count));
  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {points.map((p, i) => (
        <CircleMarker
          key={i}
          center={[p.lat, p.lon]}
          radius={4 + (8 * p.count) / max}
          pathOptions={{
            color: "hsl(var(--accent))",
            fillColor: "hsl(var(--accent))",
            fillOpacity: 0.6,
          }}
        />
      ))}
    </MapContainer>
  );
}
