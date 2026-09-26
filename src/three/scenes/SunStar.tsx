// PLACEHOLDER — replaced by the edge build.
import { useRef } from 'react';
import type { Points } from 'three';
import { useVis } from '../useVis';

export function SunStar() {
  const ref = useRef<Points>(null);
  useVis('sunStar', ref);
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0]), 3]} />
      </bufferGeometry>
      <pointsMaterial color={[4, 3, 2]} size={10} sizeAttenuation={false} toneMapped={false} />
    </points>
  );
}
