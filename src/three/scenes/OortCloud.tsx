// PLACEHOLDER — replaced by the edge build.
import { useMemo, useRef } from 'react';
import type { Points } from 'three';
import { OORT } from '../../journey/layout';
import { useVis } from '../useVis';

export function OortCloud() {
  const ref = useRef<Points>(null);
  useVis('oort', ref);
  const pos = useMemo(() => {
    const n = 8000;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = OORT.innerLy + Math.pow(Math.random(), 0.5) * (OORT.outerLy - OORT.innerLy);
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      a.set([r * s * Math.cos(t), r * u, r * s * Math.sin(t)], i * 3);
    }
    return a;
  }, []);
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#8ab4ff" size={1.5} sizeAttenuation={false} transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}
