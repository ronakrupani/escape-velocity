// PLACEHOLDER — replaced by the launch scene build.
import { useRef } from 'react';
import type { Group } from 'three';
import { useVis } from '../useVis';

export function LaunchSite() {
  const ref = useRef<Group>(null);
  useVis('launch', ref);
  return (
    <group ref={ref}>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial color="#1b1f2a" />
      </mesh>
      <mesh position={[0.018, 0.04, -0.012]}>
        <boxGeometry args={[0.008, 0.08, 0.008]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <hemisphereLight args={['#6d7fb8', '#2a1a14', 0.6]} />
    </group>
  );
}
