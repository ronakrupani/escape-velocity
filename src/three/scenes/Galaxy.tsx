// PLACEHOLDER — replaced by the galaxy build.
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import { SUN_GALAXY } from '../../journey/layout';
import { journey } from '../../journey/state';
import { useVis } from '../useVis';

export function Galaxy() {
  const ref = useRef<Group>(null);
  useVis('galaxy', ref);
  useFrame(() => {
    // The galaxy co-rotates with the frame system so the Sun stays on its arm.
    ref.current!.rotation.y = journey.frames.galaxyAngle;
  });
  const pos = useMemo(() => {
    const n = 40000;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const arm = i % 2;
      const r = Math.pow(Math.random(), 0.7) * 50;
      const th = arm * Math.PI + Math.log(1 + r) * 2.2 + (Math.random() - 0.5) * 0.6;
      a.set([r * Math.cos(th), (Math.random() - 0.5) * 1.2, r * Math.sin(th)], i * 3);
    }
    return a;
  }, []);
  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#b8c8ff" size={1.2} sizeAttenuation={false} transparent opacity={0.7} depthWrite={false} />
      </points>
      <mesh position={SUN_GALAXY}>
        <sphereGeometry args={[0.5, 16, 8]} />
        <meshBasicMaterial color="#ff6b2c" />
      </mesh>
    </group>
  );
}
