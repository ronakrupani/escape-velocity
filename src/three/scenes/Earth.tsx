// PLACEHOLDER — replaced by the Earth build.
import { useRef } from 'react';
import type { Mesh } from 'three';
import { EARTH_CENTER_KM, EARTH_RADIUS_KM } from '../../journey/layout';
import { useVis } from '../useVis';

export function Earth() {
  const ref = useRef<Mesh>(null);
  useVis('earth', ref);
  return (
    <mesh ref={ref} position={EARTH_CENTER_KM}>
      <sphereGeometry args={[EARTH_RADIUS_KM, 96, 64]} />
      <meshStandardMaterial color="#2c5aa0" roughness={0.8} />
    </mesh>
  );
}
