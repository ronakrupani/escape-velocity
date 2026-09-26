// PLACEHOLDER — replaced by the sky build (dusk dome, background stars, warp streaks).
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group, Points } from 'three';
import { journey } from '../../journey/state';
import { useVis } from '../useVis';

export function Sky() {
  const camera = useThree((s) => s.camera);
  const group = useRef<Group>(null);
  const stars = useRef<Points>(null);
  useVis('sky', stars);
  useFrame(() => {
    const g = group.current!;
    g.position.copy(camera.position);
    g.quaternion.copy(journey.frameRotation.local);
  });
  const pos = useMemo(() => {
    const n = 5000;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      a.set([5e4 * s * Math.cos(t), 5e4 * u, 5e4 * s * Math.sin(t)], i * 3);
    }
    return a;
  }, []);
  return (
    <group ref={group}>
      <points ref={stars} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={1.3} sizeAttenuation={false} transparent opacity={0.8} depthWrite={false} />
      </points>
    </group>
  );
}
