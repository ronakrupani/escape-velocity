/**
 * Shared, mutable, per-frame state. The Director (src/three/Director.tsx)
 * writes it once per frame before anything else runs; scenes and the HUD read
 * it. Nothing here triggers React renders, on purpose.
 */
import { motionValue } from 'motion/react';
import { Matrix4, Quaternion } from 'three';
import { FrameSystem, type FrameId } from './frames';
import { createCameraSample } from './rig';
import { CHAPTERS, type Chapter, type Look, type SceneId, SCENE_WINDOWS, sampleLook } from './timeline';

/**
 * THE source of truth: smoothed scroll progress (0..1). Set from Motion's
 * useScroll -> useSpring in App.tsx. DOM reads it through Motion transforms,
 * the 3D world reads progress.get() inside useFrame. They cannot drift.
 */
export const progress = motionValue(0);
/** Unsmoothed scroll progress (for things that must not lag, e.g. the rail). */
export const rawProgress = motionValue(0);

export type Quality = 'high' | 'medium' | 'low';

const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const coarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
const small = typeof window !== 'undefined' && Math.min(window.innerWidth, window.innerHeight) < 700;

function initialQuality(): Quality {
  const q = params.get('quality');
  if (q === 'high' || q === 'medium' || q === 'low') return q;
  return coarse || small ? 'low' : 'high';
}

export const journey = {
  /** Smoothed progress for this frame. */
  p: 0,
  /** Scroll velocity in progress units per second (smoothed, signed). */
  velocity: 0,
  /** Seconds since start (r3f clock). */
  time: 0,
  /** Frame delta in seconds, clamped. */
  delta: 0,
  chapter: CHAPTERS[0] as Chapter,
  /** Scene weights 0..1 from SCENE_WINDOWS. 0 means: don't render. */
  vis: Object.fromEntries(Object.keys(SCENE_WINDOWS).map((k) => [k, 0])) as Record<SceneId, number>,
  look: sampleLook(0) as Look,
  /** Ignition flash 0..1, camera shake 0..1, engine throttle 0..1, warp 0..1. */
  flash: 0,
  shake: 0,
  throttle: 0,
  warp: 0,
  cam: createCameraSample(),
  frames: new FrameSystem(),
  /** Render units per frame unit, per frame (multiply sizes in custom point shaders by this). */
  frameScale: { earth: 1, sol: 1, local: 1, galaxy: 1, group: 1 } as Record<FrameId, number>,
  /** Rotation of each frame's axes in render space (for camera-attached sky layers). */
  frameRotation: {
    earth: new Quaternion(),
    sol: new Quaternion(),
    local: new Quaternion(),
    galaxy: new Quaternion(),
    group: new Quaternion(),
  } as Record<FrameId, Quaternion>,
  /** Render matrix per frame (frame coords -> render/world coords). */
  frameMatrix: {
    earth: new Matrix4(),
    sol: new Matrix4(),
    local: new Matrix4(),
    galaxy: new Matrix4(),
    group: new Matrix4(),
  } as Record<FrameId, Matrix4>,
  /** Smoothed pointer, -1..1 on both axes (0,0 = centre). */
  pointer: { x: 0, y: 0 },
  reducedMotion: typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  quality: initialQuality(),
  isTouch: !!coarse,
  debug: params.has('debug'),
  /** Name of the planet/object under the cursor, for the cursor + labels. */
  hovered: null as string | null,
};

/** Camera distance from its target in render units. Everything is scaled around this. */
export const CAM_DIST = 10;

/** Particle budget multiplier for the current quality tier. */
export const particleBudget = (high: number, low = Math.round(high * 0.3)) =>
  journey.quality === 'high' ? high : journey.quality === 'medium' ? Math.round((high + low) / 2) : low;
