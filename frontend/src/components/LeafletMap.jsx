import React from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({ points, metricKey = "heartRate" }) {
  if (!points.length) return null;
  const center = [points[0].lat, points[0].lon];

  const metricValues = points
    .map((p) => p[metricKey])
    .filter((v) => v !== undefined && v !== null);
  const min = Math.min(...metricValues);
  const max = Math.max(...metricValues);

  const segments = [];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const value = curr[metricKey];
    let ratio = 0;
    if (max !== min) ratio = (value - min) / (max - min);
    const hue = 240 - ratio * 240; // blue to red
    const color = `hsl(${hue}, 100%, 50%)`;
    segments.push(
      <Polyline
        key={i}
        positions={[
          [prev.lat, prev.lon],
          [curr.lat, curr.lon],
        ]}
        color={color}
      />
    );
  }

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {segments}
    </MapContainer>
  );
}
