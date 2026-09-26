// PLACEHOLDER — replaced by the asteroid belt build.
import { useLayoutEffect, useRef } from 'react';
import { type InstancedMesh, Object3D } from 'three';
import { ASTEROID_BELT } from '../../journey/layout';
import { useVis } from '../useVis';

const N = 3000;
export function AsteroidBelt() {
  const ref = useRef<InstancedMesh>(null);
  useVis('asteroids', ref);
  useLayoutEffect(() => {
    const o = new Object3D();
    for (let i = 0; i < N; i++) {
      const r = ASTEROID_BELT.inner + Math.random() * (ASTEROID_BELT.outer - ASTEROID_BELT.inner);
      const a = Math.random() * Math.PI * 2;
      o.position.set(r * Math.cos(a), (Math.random() - 0.5) * ASTEROID_BELT.thickness, -r * Math.sin(a));
      o.scale.setScalar(0.03 + Math.random() * 0.08);
      o.updateMatrix();
      ref.current!.setMatrixAt(i, o.matrix);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#8a7d6e" roughness={1} />
    </instancedMesh>
  );
}
