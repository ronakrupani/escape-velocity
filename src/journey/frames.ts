/**
 * Nested reference frames with a floating origin and a floating scale.
 *
 * Each frame is embedded in its parent by a similarity transform (translate,
 * rotate, uniform scale). Transforms between two frames are always composed
 * along the chain between them (never through a far-away root), so a rocket
 * 58 m tall renders rock-steady even though the galaxy frame is 10^17 km wide.
 */
import { Matrix4, Quaternion, Vector3 } from 'three';
import { EARTH_RADIUS_KM, EARTH_SOL, LY_PER_SU, SOL_TO_LOCAL_ROTATION, SUN_GALAXY } from './layout';

export type FrameId = 'earth' | 'sol' | 'local' | 'galaxy' | 'group';
export const FRAME_IDS: readonly FrameId[] = ['earth', 'sol', 'local', 'galaxy', 'group'];
const RANK: Record<FrameId, number> = { earth: 0, sol: 1, local: 2, galaxy: 3, group: 4 };

/** The finer (more detailed) of two frames. */
export const finerFrame = (a: FrameId, b: FrameId): FrameId => (RANK[a] <= RANK[b] ? a : b);

/** Length of one unit of each frame, measured in its parent's units. */
export const FRAME_UNIT_IN_PARENT: Record<Exclude<FrameId, 'group'>, number> = {
  earth: 1 / EARTH_RADIUS_KM,
  sol: LY_PER_SU,
  local: 0.001,
  galaxy: 0.001,
};

const EARTH_TO_SOL = new Matrix4().compose(
  EARTH_SOL.clone().add(new Vector3(0, 1, 0)),
  new Quaternion(),
  new Vector3().setScalar(FRAME_UNIT_IN_PARENT.earth),
);
const SOL_TO_LOCAL = new Matrix4().makeScale(LY_PER_SU, LY_PER_SU, LY_PER_SU).multiply(SOL_TO_LOCAL_ROTATION);
const GALAXY_TO_GROUP = new Matrix4().makeScale(0.001, 0.001, 0.001);

export class FrameSystem {
  /** Current galaxy rotation angle (radians). Everything local co-rotates with it. */
  galaxyAngle = 0;
  /** localToParent matrices, indexed by rank. */
  private toParent: Matrix4[] = [EARTH_TO_SOL, SOL_TO_LOCAL, new Matrix4(), GALAXY_TO_GROUP];
  private tmpA = new Matrix4();
  private tmpB = new Matrix4();
  private rot = new Matrix4();
  private v = new Vector3();

  constructor() {
    this.setGalaxyAngle(0);
  }

  setGalaxyAngle(theta: number) {
    this.galaxyAngle = theta;
    this.rot.makeRotationY(theta);
    this.v.copy(SUN_GALAXY).applyMatrix4(this.rot);
    this.toParent[2]
      .makeScale(0.001, 0.001, 0.001)
      .premultiply(this.rot)
      .setPosition(this.v);
  }

  /** Sun position in the galaxy frame at the current rotation. */
  sunInGalaxy(out = new Vector3()) {
    return out.setFromMatrixPosition(this.toParent[2]);
  }

  /** Matrix mapping coordinates expressed in `from` into `to`. */
  relative(from: FrameId, to: FrameId, out = new Matrix4()): Matrix4 {
    const a = RANK[from];
    const b = RANK[to];
    if (a === b) return out.identity();
    if (a < b) {
      out.copy(this.toParent[a]);
      for (let r = a + 1; r < b; r++) out.premultiply(this.toParent[r]);
      return out;
    }
    this.relative(to, from, this.tmpA);
    return out.copy(this.tmpA).invert();
  }

  /** Multiplier converting lengths in `from` into lengths in `to`. */
  scale(from: FrameId, to: FrameId): number {
    const a = RANK[from];
    const b = RANK[to];
    let s = 1;
    const units = [FRAME_UNIT_IN_PARENT.earth, FRAME_UNIT_IN_PARENT.sol, FRAME_UNIT_IN_PARENT.local, FRAME_UNIT_IN_PARENT.galaxy];
    if (a < b) for (let r = a; r < b; r++) s *= units[r];
    else for (let r = b; r < a; r++) s /= units[r];
    return s;
  }

  point(p: Vector3, from: FrameId, to: FrameId, out = new Vector3()) {
    return out.copy(p).applyMatrix4(this.relative(from, to, this.tmpB));
  }

  /** Transforms a direction (rotation only) and normalizes it. */
  direction(d: Vector3, from: FrameId, to: FrameId, out = new Vector3()) {
    return out.copy(d).transformDirection(this.relative(from, to, this.tmpB));
  }
}
