import { useFrame } from '@react-three/fiber';
import type { RefObject } from 'react';
import type { Object3D } from 'three';
import { journey } from '../journey/state';
import type { SceneId } from '../journey/timeline';

/**
 * Hides `ref` whenever the scene's timeline weight is 0 (so it costs nothing),
 * and calls `onWeight` every visible frame with the 0..1 weight for fades.
 * Runs at priority -5: after the Director (-10), before normal scene frames (0).
 */
export function useVis(id: SceneId, ref: RefObject<Object3D | null>, onWeight?: (w: number) => void) {
  useFrame(() => {
    const w = journey.vis[id];
    const o = ref.current;
    if (!o) return;
    const on = w > 0.0005;
    o.visible = on;
    if (on && onWeight) onWeight(w);
  }, -5);
}
