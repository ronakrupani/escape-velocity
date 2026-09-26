// PLACEHOLDER — replaced by the rocket build.
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { type Group, Quaternion, Vector3 } from 'three';
import { journey } from '../../journey/state';
import { rocketHeading, rocketPosition } from '../../journey/timeline';
import { useVis } from '../useVis';

const up = new Vector3(0, 1, 0);
const h = new Vector3();
const q = new Quaternion();

export function Rocket() {
  const ref = useRef<Group>(null);
  useVis('rocket', ref);
  useFrame(() => {
    const g = ref.current!;
    rocketPosition(journey.p, g.position);
    q.setFromUnitVectors(up, rocketHeading(journey.p, h));
    g.quaternion.copy(q);
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.024, 0]}>
        <cylinderGeometry args={[0.0028, 0.0032, 0.048, 32]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.053, 0]}>
        <coneGeometry args={[0.0028, 0.01, 32]} />
        <meshStandardMaterial color="#ff6b2c" />
      </mesh>
    </group>
  );
}
