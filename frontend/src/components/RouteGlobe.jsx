import React, { useMemo, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

export default function RouteGlobe({ points = [] }) {
  const globeRef = useRef();

  const arcs = useMemo(() => {
    const res = [];
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      res.push({
        startLat: a.lat,
        startLng: a.lon,
        endLat: b.lat,
        endLng: b.lon,
      });
    }
    return res;
  }, [points]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0);
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.3;
    globe.scene().add(new THREE.AmbientLight(0xffffff, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 5, 5);
    globe.scene().add(dir);
  }, []);

  if (!arcs.length) return null;

  return (
    <div className="h-full w-full">
      <Globe ref={globeRef} arcsData={arcs} width={undefined} height={undefined} />
    </div>
  );
}
