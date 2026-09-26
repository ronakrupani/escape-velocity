/**
 * Runs first every frame (priority -10). Reads smoothed scroll progress,
 * samples the camera and the look from the timeline, places every reference
 * frame around the camera (floating origin + floating scale), and publishes
 * the result on `journey` for scenes and the HUD.
 */
import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { type Group, Matrix4, type PerspectiveCamera, Vector3 } from 'three';
import { FRAME_IDS, type FrameId } from '../journey/frames';
import { GALAXY_SPIN } from '../journey/layout';
import { sampleCamera } from '../journey/rig';
import { CAM_DIST, journey, progress } from '../journey/state';
import {
  chapterAt,
  engineThrottle,
  ignitionFlash,
  SCENE_WINDOWS,
  type SceneId,
  sampleLook,
  sceneWeight,
  shakeAmount,
  warpAmount,
} from '../journey/timeline';

const groups: Partial<Record<FrameId, Group>> = {};

/** A group whose contents are authored in one frame's units. */
export function Frame({ id, children }: { id: FrameId; children: ReactNode }) {
  const ref = useRef<Group>(null);
  useLayoutEffect(() => {
    const g = ref.current!;
    groups[id] = g;
    g.matrix.copy(journey.frameMatrix[id]);
    g.matrixWorldNeedsUpdate = true;
    return () => {
      if (groups[id] === g) delete groups[id];
    };
  }, [id]);
  return (
    <group ref={ref} matrixAutoUpdate={false} name={`frame:${id}`}>
      {children}
    </group>
  );
}

const DEG = Math.PI / 180;
const T = new Matrix4();
const S = new Matrix4();
const pos = new Vector3();
const scl = new Vector3();
const dir = new Vector3();
const right = new Vector3();
const SCENE_IDS = Object.keys(SCENE_WINDOWS) as SceneId[];

/** Cheap smooth 1D noise for camera shake. */
const noise1 = (t: number) => Math.sin(t * 1.7) * 0.5 + Math.sin(t * 3.1 + 1.3) * 0.3 + Math.sin(t * 7.3 + 4.1) * 0.2;

export function Director() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);

  useFrame((state, delta) => {
    const j = journey;
    const dt = Math.min(delta, 1 / 20);
    const p = progress.get();
    const v = (p - j.p) / Math.max(dt, 1e-4);
    j.velocity += (v - j.velocity) * (1 - Math.exp(-dt * 6));
    j.p = p;
    j.time = state.clock.elapsedTime;
    j.delta = dt;
    j.chapter = chapterAt(p);

    j.frames.setGalaxyAngle(GALAXY_SPIN * j.time);
    const cam = sampleCamera(p, j.frames, j.cam);
    const z = CAM_DIST / cam.dist;

    T.makeTranslation(-cam.target.x, -cam.target.y, -cam.target.z);
    S.makeScale(z, z, z);
    for (const id of FRAME_IDS) {
      const M = j.frames.relative(id, cam.frame, j.frameMatrix[id]);
      M.premultiply(T).premultiply(S);
      M.decompose(pos, j.frameRotation[id], scl);
      j.frameScale[id] = z * j.frames.scale(id, cam.frame);
      const g = groups[id];
      if (g) {
        g.matrix.copy(M);
        g.matrixWorldNeedsUpdate = true;
      }
    }

    for (const id of SCENE_IDS) j.vis[id] = sceneWeight(id, p);
    sampleLook(p, j.look);
    const calm = j.reducedMotion;
    j.flash = ignitionFlash(p) * (calm ? 0.35 : 1);
    j.shake = calm ? 0 : shakeAmount(p);
    j.throttle = engineThrottle(p);
    j.warp = calm ? 0 : warpAmount(p);

    // Pointer parallax: the camera leans a few degrees toward the cursor.
    const k = 1 - Math.exp(-dt * 2.5);
    const px = calm || j.isTouch ? 0 : state.pointer.x;
    const py = calm || j.isTouch ? 0 : state.pointer.y;
    j.pointer.x += (px - j.pointer.x) * k;
    j.pointer.y += (py - j.pointer.y) * k;

    dir.copy(cam.dir);
    right.crossVectors(cam.up, dir).normalize();
    dir.applyAxisAngle(cam.up, -j.pointer.x * 3.2 * DEG);
    dir.applyAxisAngle(right, j.pointer.y * 2.2 * DEG);

    camera.position.copy(dir).multiplyScalar(CAM_DIST);
    camera.up.copy(cam.up);
    camera.lookAt(0, 0, 0);
    if (cam.roll) camera.rotateZ(cam.roll * DEG);
    if (j.shake > 0.001) {
      const a = j.shake * 0.0065;
      const t = j.time * 21;
      camera.rotateX(noise1(t) * a);
      camera.rotateY(noise1(t + 17.3) * a);
      camera.rotateZ(noise1(t + 41.7) * a * 0.6);
    }

    // Portrait screens get a wider lens so subjects stay in frame.
    const aspect = size.width / Math.max(1, size.height);
    const fov = aspect < 1 ? Math.min(75, cam.fov * (1 + (1 - aspect) * 0.75)) : cam.fov;
    if (Math.abs(camera.fov - fov) > 1e-3) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, -10);

  return null;
}
