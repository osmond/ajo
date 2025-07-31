import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { ScatterplotLayer } from "@deck.gl/layers";
import { useCartoTileURL } from "@/hooks/useCartoTiles";

export default function DeckGLMap({ points = [] }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const tileUrl = useCartoTileURL();

  useEffect(() => {
    if (!points.length || !containerRef.current) return;

    // create map instance once
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            basemap: {
              type: "raster",
              tiles: [tileUrl.replace("{s}", "a")],
              tileSize: 256,
              attribution: "\u00a9 OpenStreetMap contributors"
            }
          },
          layers: [
            {
              id: "basemap",
              type: "raster",
              source: "basemap"
            }
          ]
        },
        center: [points[0].lon, points[0].lat],
        zoom: 13,
      });
      overlayRef.current = new MapboxOverlay();
      mapRef.current.addControl(overlayRef.current);
    }

    const layer = new ScatterplotLayer({
      id: "scatter",
      data: points,
      getPosition: d => [d.lon, d.lat],
      getFillColor: [255, 0, 0, 200],
      getRadius: 30,
    });
    overlayRef.current.setProps({ layers: [layer] });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points, tileUrl]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
