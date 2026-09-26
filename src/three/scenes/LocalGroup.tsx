// PLACEHOLDER — replaced by the beyond build.
import { useRef } from 'react';
import type { Group } from 'three';
import { ANDROMEDA, LMC, SMC, TRIANGULUM } from '../../journey/layout';
import { useVis } from '../useVis';

export function LocalGroup() {
  const ref = useRef<Group>(null);
  useVis('localGroup', ref);
  return (
    <group ref={ref}>
      {[ANDROMEDA, TRIANGULUM, LMC, SMC].map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i === 0 ? 0.08 : 0.02, 16, 8]} />
          <meshBasicMaterial color="#ffd9b0" />
        </mesh>
      ))}
    </group>
  );
}
