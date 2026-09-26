// PLACEHOLDER — replaced by the Earth/Moon build.
import { useRef } from 'react';
import type { Mesh } from 'three';
import { MOON_POSITION_KM, MOON_RADIUS_KM } from '../../journey/layout';
import { useVis } from '../useVis';

export function Moon() {
  const ref = useRef<Mesh>(null);
  useVis('moon', ref);
  return (
    <mesh ref={ref} position={MOON_POSITION_KM}>
      <sphereGeometry args={[MOON_RADIUS_KM, 64, 32]} />
      <meshStandardMaterial color="#9a9a9a" roughness={1} />
    </mesh>
  );
}
