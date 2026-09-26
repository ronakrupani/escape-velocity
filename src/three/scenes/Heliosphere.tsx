// PLACEHOLDER — replaced by the edge build.
import { useRef } from 'react';
import type { Mesh } from 'three';
import { HELIOPAUSE_SU } from '../../journey/layout';
import { useVis } from '../useVis';

export function Heliosphere() {
  const ref = useRef<Mesh>(null);
  useVis('heliosphere', ref);
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[HELIOPAUSE_SU, 48, 24]} />
      <meshBasicMaterial color="#8ab4ff" wireframe transparent opacity={0.08} depthWrite={false} />
    </mesh>
  );
}
