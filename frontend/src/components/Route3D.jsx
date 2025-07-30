import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

export default function Route3D({ points = [] }) {
  if (!points.length) return null;

  const curve = useMemo(() => {
    const first = points[0];
    const scale = 10000; // simple degree to meter scaling
    return new THREE.CatmullRomCurve3(
      points.map((p) => {
        const x = (p.lon - first.lon) * scale;
        const y = (p.lat - first.lat) * scale;
        const z = p.elevation ?? 0;
        return new THREE.Vector3(x, y, z);
      })
    );
  }, [points]);

  return (
    <Canvas camera={{ position: [0, -50, 30], up: [0, 0, 1] }}>
      <ambientLight />
      <directionalLight position={[10, 10, 10]} />
      <mesh>
        <tubeGeometry args={[curve, 100, 1, 8, false]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
}
