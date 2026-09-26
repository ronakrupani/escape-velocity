// PLACEHOLDER — replaced by the planets build.
import { useRef } from 'react';
import type { Group } from 'three';
import { PLANET_LAYOUT, PLANET_ORDER, planetPosition } from '../../journey/layout';
import { useVis } from '../useVis';

const COLORS: Record<string, string> = { mercury: '#8c8c8c', venus: '#d9b77a', mars: '#b5532e', jupiter: '#c9a27a', saturn: '#d8c28d', uranus: '#9fd8e0', neptune: '#3f63c9' };

export function Planets() {
  const ref = useRef<Group>(null);
  useVis('planets', ref);
  return (
    <group ref={ref}>
      {PLANET_ORDER.filter((k) => k !== 'earth').map((k) => (
        <mesh key={k} position={planetPosition(k)}>
          <sphereGeometry args={[PLANET_LAYOUT[k].radius, 64, 32]} />
          <meshStandardMaterial color={COLORS[k]} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
