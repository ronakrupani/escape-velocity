// PLACEHOLDER — replaced by the rocket build.
import { useRef } from 'react';
import type { Group } from 'three';
import { DEEP_ROCKET_SOL } from '../../journey/layout';
import { useVis } from '../useVis';

export function DeepRocket() {
  const ref = useRef<Group>(null);
  useVis('deepRocket', ref);
  return (
    <group ref={ref} position={DEEP_ROCKET_SOL} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.006, 0.007, 0.07, 24]} />
        <meshStandardMaterial color="#f4f1ea" />
      </mesh>
    </group>
  );
}
