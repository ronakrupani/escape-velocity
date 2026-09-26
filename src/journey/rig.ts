/**
 * Samples the camera from the keyframes in timeline.ts. Pure math, no React.
 */
import { Vector3 } from 'three';
import { ease, lerp, progressIn } from './easing';
import { type FrameId, type FrameSystem, finerFrame } from './frames';
import { CAMERA_KEYS, type CamKey } from './timeline';

export interface CameraSample {
  /** The frame the camera is expressed in (the finer frame of the active segment). */
  frame: FrameId;
  target: Vector3;
  /** Unit vector from target to camera. */
  dir: Vector3;
  up: Vector3;
  dist: number;
  fov: number;
  roll: number;
  /** Index of the key the camera is leaving. */
  key: number;
}

const DEG = Math.PI / 180;
const Y = new Vector3(0, 1, 0);

export function azElToDir(azDeg: number, elDeg: number, out = new Vector3()) {
  const az = azDeg * DEG;
  const el = elDeg * DEG;
  return out.set(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
}

function keyTarget(k: CamKey, p: number, out: Vector3) {
  const t = k.target;
  if (typeof t === 'function') return out.copy(t(p));
  if (t instanceof Vector3) return out.copy(t);
  return out.set(t[0], t[1], t[2]);
}

/** Spherical interpolation between unit vectors, robust to near-parallel/opposite inputs. */
export function slerpUnit(a: Vector3, b: Vector3, t: number, out = new Vector3()) {
  const dot = Math.min(1, Math.max(-1, a.dot(b)));
  const theta = Math.acos(dot);
  if (theta < 1e-4) return out.copy(a).lerp(b, t).normalize();
  if (Math.PI - theta < 1e-3) {
    // Opposite: rotate through any perpendicular axis.
    const axis = new Vector3(0, 1, 0).cross(a);
    if (axis.lengthSq() < 1e-6) axis.set(1, 0, 0).cross(a);
    return out.copy(a).applyAxisAngle(axis.normalize(), theta * t);
  }
  const s = Math.sin(theta);
  const wa = Math.sin((1 - t) * theta) / s;
  const wb = Math.sin(t * theta) / s;
  return out.set(a.x * wa + b.x * wb, a.y * wa + b.y * wb, a.z * wa + b.z * wb).normalize();
}

const tA = new Vector3();
const tB = new Vector3();
const dA = new Vector3();
const dB = new Vector3();
const uA = new Vector3();
const uB = new Vector3();

export function sampleCamera(p: number, frames: FrameSystem, out: CameraSample, keys: CamKey[] = CAMERA_KEYS): CameraSample {
  let i = 0;
  while (i < keys.length - 2 && p >= keys[i + 1].at) i++;
  const A = keys[i];
  const B = keys[i + 1];
  const raw = progressIn(p, A.at, B.at);
  const t = ease[A.ease ?? 'cinematic'](raw);
  const F = finerFrame(A.frame, B.frame);

  frames.point(keyTarget(A, p, tA), A.frame, F, tA);
  frames.point(keyTarget(B, p, tB), B.frame, F, tB);
  frames.direction(azElToDir(A.az, A.el, dA), A.frame, F, dA);
  frames.direction(azElToDir(B.az, B.el, dB), B.frame, F, dB);
  frames.direction(Y, A.frame, F, uA);
  frames.direction(Y, B.frame, F, uB);

  const distA = A.dist * frames.scale(A.frame, F);
  const distB = B.dist * frames.scale(B.frame, F);
  const dist = Math.exp(lerp(Math.log(distA), Math.log(distB), t));

  // During big zooms, move the target in proportion to the change in distance,
  // so the subject stays framed (a Powers-of-Ten move rather than a whip-pan).
  const zoom = Math.abs(Math.log(distB / distA));
  const k = Math.min(1, zoom / Math.log(3));
  const wDist = Math.abs(distB - distA) > 1e-12 ? (dist - distA) / (distB - distA) : t;
  const w = lerp(t, wDist, k);

  out.frame = F;
  out.target.copy(tA).lerp(tB, w);
  slerpUnit(dA, dB, t, out.dir);
  slerpUnit(uA, uB, t, out.up);
  out.dist = dist;
  out.fov = lerp(A.fov ?? 40, B.fov ?? A.fov ?? 40, t);
  out.roll = lerp(A.roll ?? 0, B.roll ?? 0, t);
  out.key = raw >= 1 && i === keys.length - 2 ? i + 1 : i;
  return out;
}

export const createCameraSample = (): CameraSample => ({
  frame: 'earth',
  target: new Vector3(),
  dir: new Vector3(0, 0, 1),
  up: new Vector3(0, 1, 0),
  dist: 1,
  fov: 40,
  roll: 0,
  key: 0,
});
