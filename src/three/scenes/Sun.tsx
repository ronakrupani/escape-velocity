// PLACEHOLDER — replaced by the Sun build.
import { useRef } from 'react';
import type { Group } from 'three';
import { SUN_RADIUS_SU } from '../../journey/layout';
import { useVis } from '../useVis';

export function Sun() {
  const ref = useRef<Group>(null);
  useVis('sun', ref);
  return (
    <>
      {/* The Sun lights everything in the earth + sol frames. decay 0 = no falloff. */}
      <pointLight position={[0, 0, 0]} intensity={3.2} decay={0} color="#fff4e6" />
      <ambientLight intensity={0.015} />
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[SUN_RADIUS_SU, 64, 32]} />
          <meshBasicMaterial color={[6, 3.6, 1.6]} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}
