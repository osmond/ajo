import React from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({ points }) {
  const center = [37.7749, -122.4194];
  const path = points.map((p, i) => [
    center[0] + p.value * 0.001,
    center[1] + i * 0.001,
  ]);
  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Polyline positions={path} color="#2563eb" />
    </MapContainer>
  );
}
