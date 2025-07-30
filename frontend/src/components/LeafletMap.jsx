import React from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useCartoTileURL, cartoAttribution } from "@/hooks/useCartoTiles";

export default function LeafletMap({
  points,
  metricKey = "heartRate",
  showWeather = false,
  onHoverPoint,
}) {
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
        pathOptions={{ color }}
        eventHandlers={{
          mouseover: () => onHoverPoint && onHoverPoint(i),
          mouseout: () => onHoverPoint && onHoverPoint(null),
        }}
      />
    );
  }

  const markers = points.map((p, idx) => (
    <CircleMarker
      key={`pt-${idx}`}
      center={[p.lat, p.lon]}
      radius={2}
      pathOptions={{ opacity: 0, fillOpacity: 0 }}
      eventHandlers={{
        mouseover: () => onHoverPoint && onHoverPoint(idx),
        mouseout: () => onHoverPoint && onHoverPoint(null),
      }}
    />
  ));

  const tileUrl = useCartoTileURL();

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer url={tileUrl} attribution={cartoAttribution} />
      {showWeather && (
        <TileLayer
          url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02"
          attribution="&copy; <a href='https://openweathermap.org/'>OpenWeatherMap</a>"
        />
      )}
      {segments}
      {markers}
    </MapContainer>
  );
}
