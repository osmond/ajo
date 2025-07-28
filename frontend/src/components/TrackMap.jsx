import React from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapUpdater({ center }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

export default function TrackMap({ points, center }) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    setCount(0);
    if (!points.length) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= points.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 500);
    return () => clearInterval(id);
  }, [points]);

  if (!points.length) return null;
  const defaultCenter = [points[0].lat, points[0].lon];
  const segments = [];
  const markers = [];
  for (let i = 0; i < Math.min(count, points.length); i++) {
    const curr = points[i];
    markers.push(
      <CircleMarker key={`m-${i}`} center={[curr.lat, curr.lon]} radius={3}>
        <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
          <div className="text-xs">
            Temp: {curr.temperature ?? "n/a"}°C<br />
            Precip: {curr.precipitation ?? "n/a"} mm<br />
            Wind: {curr.windspeed ?? "n/a"} m/s<br />
            Humidity: {curr.humidity ?? "n/a"}%
          </div>
        </Tooltip>
      </CircleMarker>
    );
    if (i === 0) continue;
    const prev = points[i - 1];
    const t = curr.temperature;
    let color = "hsl(var(--primary))";
    if (t !== undefined && t !== null) {
      if (t < 10) color = "hsl(var(--accent))"; // blue for cold
      else if (t < 20) color = "hsl(var(--secondary))"; // green for mild
      else color = "hsl(var(--destructive))"; // red for warm
    }
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

  const mapCenter = center || defaultCenter;

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapUpdater center={mapCenter} />
      {segments}
      {markers}
    </MapContainer>
  );
}
