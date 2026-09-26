/**
 * The one label style for things in 3D (planets, stars, markers): a small
 * mono caption with a hairline and an orange tick. Opacity follows `weight`,
 * read every frame, so labels fade with their scene.
 */
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type ReactNode, useRef } from 'react';
import type { Vector3Tuple } from 'three';
import { Vector3 } from 'three';

export interface Label3DProps {
  position: Vector3 | Vector3Tuple;
  title: string;
  sub?: ReactNode;
  /** 0..1, read each frame. Label is hidden (display:none) at 0. */
  weight: () => number;
  /** Which side of the anchor the text sits on. */
  side?: 'right' | 'left';
  accent?: boolean;
}

export function Label3D({ position, title, sub, weight, side = 'right', accent = false }: Label3DProps) {
  const el = useRef<HTMLDivElement>(null);
  useFrame(() => {
    const d = el.current;
    if (!d) return;
    const w = weight();
    d.style.opacity = w.toFixed(3);
    d.style.display = w < 0.01 ? 'none' : 'block';
  });
  return (
    <Html position={position} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }} aria-hidden>
      <div ref={el} className="ev-label" data-side={side} data-accent={accent || undefined} style={{ opacity: 0, display: 'none' }}>
        <span className="ev-label__tick" />
        <span className="ev-label__line" />
        <span className="ev-label__text">
          <span className="ev-label__title">{title}</span>
          {sub ? <span className="ev-label__sub">{sub}</span> : null}
        </span>
      </div>
    </Html>
  );
}
