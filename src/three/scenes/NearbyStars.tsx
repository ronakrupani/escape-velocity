// PLACEHOLDER — replaced by the interstellar build.
import { useRef } from 'react';
import type { Group } from 'three';
import { ALPHA_CEN_LOCAL, PROXIMA_LOCAL } from '../../journey/timeline';
import { useVis } from '../useVis';

export function NearbyStars() {
  const ref = useRef<Group>(null);
  useVis('nearbyStars', ref);
  return (
    <group ref={ref}>
      <mesh position={PROXIMA_LOCAL}>
        <sphereGeometry args={[0.02, 16, 8]} />
        <meshBasicMaterial color={[3, 1, 0.6]} toneMapped={false} />
      </mesh>
      <mesh position={ALPHA_CEN_LOCAL}>
        <sphereGeometry args={[0.03, 16, 8]} />
        <meshBasicMaterial color={[3, 2.8, 2]} toneMapped={false} />
      </mesh>
    </group>
  );
}
