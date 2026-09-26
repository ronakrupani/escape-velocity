/**
 * Where everything lives. The universe is split into five nested frames, each
 * with units that suit what's inside it (see frames.ts for how they nest):
 *
 *   earth  (km)   origin = launch pad, +y = local up, Earth's centre below
 *   sol    (SU)   1 SU = one Earth radius. Sun at origin. Distances compressed.
 *   local  (ly)   Sun at origin, galactic axes (+x to galactic centre, +y = north galactic pole)
 *   galaxy (kly)  galactic centre at origin, disk in the y = 0 plane
 *   group  (Mly)  Milky Way at origin, Andromeda 2.5 Mly away
 *
 * three.js axes convention used for "astronomical" frames: an astronomical
 * right-handed (X, Y, Z) with Z = north maps to three (x, y, z) = (X, Z, -Y).
 */
import { Matrix4, Vector3 } from 'three';

const DEG = Math.PI / 180;

/* ------------------------------------------------------------------ earth (km) */

export const EARTH_RADIUS_KM = 6371;
export const EARTH_CENTER_KM = new Vector3(0, -EARTH_RADIUS_KM, 0);
/**
 * Unit vector toward the Sun, identical in the earth and sol frames (they share
 * axes). It is horizontal at the pad, so the launch happens at dusk and the pad
 * sits exactly on the day/night terminator when we pull back to see the planet.
 */
export const SUN_DIR = new Vector3(1, 0, 0);
/** Downrange (east) direction of the ascent: away from the sunset. */
export const DOWNRANGE_DIR = new Vector3(-1, 0, 0);
export const ROCKET_HEIGHT_KM = 0.058;
export const MOON_RADIUS_KM = 1737.4;
/** Real mean distance is 384,400 km; compressed ~7x so Earth and Moon share a frame. */
export const MOON_POSITION_KM = new Vector3(-24000, 14000, -46000).add(EARTH_CENTER_KM);
export const EARTH_AXIAL_TILT_DEG = 23.44;

/* ------------------------------------------------------------------- sol (SU) */

export const SUN_RADIUS_SU = 7.2;
export type PlanetKey = 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';

export interface PlanetLayout {
  /** Orbit radius in SU (compressed). */
  orbit: number;
  /** Position angle on its orbit, degrees counter-clockwise seen from ecliptic north. */
  angleDeg: number;
  /** Display radius in SU (gas giants compressed). */
  radius: number;
  /** Real obliquity in degrees. */
  tiltDeg: number;
  /** Real sidereal rotation period in hours, negative = retrograde. */
  rotationHours: number;
}

/**
 * Planets sit on a loose line leading away from the Sun, alternating sides,
 * so the camera can weave outward past each one in order.
 */
export const PLANET_LAYOUT: Record<PlanetKey, PlanetLayout> = {
  mercury: { orbit: 19, angleDeg: 171, radius: 0.38, tiltDeg: 0.03, rotationHours: 1407.6 },
  venus: { orbit: 29, angleDeg: 188.5, radius: 0.95, tiltDeg: 177.4, rotationHours: -5832.5 },
  earth: { orbit: 42, angleDeg: 180, radius: 1, tiltDeg: 23.44, rotationHours: 23.93 },
  mars: { orbit: 54, angleDeg: 190.5, radius: 0.53, tiltDeg: 25.19, rotationHours: 24.62 },
  jupiter: { orbit: 96, angleDeg: 173.5, radius: 4.6, tiltDeg: 3.13, rotationHours: 9.93 },
  saturn: { orbit: 128, angleDeg: 187, radius: 3.9, tiltDeg: 26.73, rotationHours: 10.66 },
  uranus: { orbit: 158, angleDeg: 175.5, radius: 1.95, tiltDeg: 97.77, rotationHours: -17.24 },
  neptune: { orbit: 184, angleDeg: 184.5, radius: 1.9, tiltDeg: 28.32, rotationHours: 16.11 },
};
export const PLANET_ORDER: PlanetKey[] = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

export const ASTEROID_BELT = { inner: 64, outer: 80, thickness: 2.2, centerAngleDeg: 181 };
export const TERMINATION_SHOCK_SU = 262;
export const HELIOPAUSE_SU = 300;
/** Real heliopause distance (Voyager 1 crossed at ~121 AU). */
export const HELIOPAUSE_AU = 121;

export function orbitPosition(orbit: number, angleDeg: number, out = new Vector3()) {
  const a = angleDeg * DEG;
  return out.set(orbit * Math.cos(a), 0, -orbit * Math.sin(a));
}
export function planetPosition(key: PlanetKey, out = new Vector3()) {
  const p = PLANET_LAYOUT[key];
  return orbitPosition(p.orbit, p.angleDeg, out);
}
/** Earth's centre in sol coordinates. Must be on the -x axis so SUN_DIR = +x. */
export const EARTH_SOL = planetPosition('earth');
/** Where the deep-space "hero" rocket crosses the heliopause (sol frame). */
export const DEEP_ROCKET_SOL = orbitPosition(HELIOPAUSE_SU - 6, 182).add(new Vector3(0, 7, 0));

/* ----------------------------------------------------------------- local (ly) */

const LY_PER_AU = 1 / 63241.077;
/** Size of one SU in light-years: the heliopause lands where it should (~121 AU). */
export const LY_PER_SU = (HELIOPAUSE_AU * LY_PER_AU) / HELIOPAUSE_SU;

/** Equatorial (J2000) -> galactic rotation (standard IAU matrix, rows). */
const EQ_TO_GAL = [
  [-0.0548755604, -0.8734370902, -0.4838350155],
  [0.4941094279, -0.44482963, 0.7469822445],
  [-0.867666149, -0.1980763734, 0.4559837762],
];
const OBLIQUITY = 23.4392811 * DEG;

type V3 = [number, number, number];
const mul = (m: number[][], v: V3): V3 => [
  m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
  m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
  m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
];
/** Astronomical (X, Y, Z-north) -> three (x, y-up, z). */
const toThree = (v: V3, out = new Vector3()) => out.set(v[0], v[2], -v[1]);
const fromThree = (v: Vector3): V3 => [v.x, -v.z, v.y];

/** Galactic longitude/latitude (deg) + distance -> local-frame position. */
export function galacticToLocal(lDeg: number, bDeg: number, dist: number, out = new Vector3()) {
  const l = lDeg * DEG;
  const b = bDeg * DEG;
  return toThree([Math.cos(b) * Math.cos(l) * dist, Math.cos(b) * Math.sin(l) * dist, Math.sin(b) * dist], out);
}
/** J2000 right ascension/declination (deg) + distance -> local-frame position. */
export function raDecToLocal(raDeg: number, decDeg: number, dist: number, out = new Vector3()) {
  const a = raDeg * DEG;
  const d = decDeg * DEG;
  const eq: V3 = [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)];
  const g = mul(EQ_TO_GAL, eq);
  return toThree([g[0] * dist, g[1] * dist, g[2] * dist], out);
}
/** Ecliptic (sol frame, three axes) direction -> local (galactic, three axes). */
function eclipticToLocal(v: Vector3, out = new Vector3()) {
  const [x, y, z] = fromThree(v);
  const c = Math.cos(OBLIQUITY);
  const s = Math.sin(OBLIQUITY);
  const eq: V3 = [x, c * y - s * z, s * y + c * z];
  return toThree(mul(EQ_TO_GAL, eq), out);
}
/**
 * Rotation that orients the solar system inside the galaxy: the ecliptic is
 * tilted about 60 degrees to the galactic plane, and that's what you'll see.
 */
export const SOL_TO_LOCAL_ROTATION = (() => {
  const ex = eclipticToLocal(new Vector3(1, 0, 0));
  const ey = eclipticToLocal(new Vector3(0, 1, 0));
  const ez = eclipticToLocal(new Vector3(0, 0, 1));
  return new Matrix4().makeBasis(ex, ey, ez);
})();

export const OORT = { innerLy: 0.03, outerLy: 1.6 };

/* --------------------------------------------------------------- galaxy (kly) */

/** Sun's distance from the galactic centre (GRAVITY Collaboration, ~8.2 kpc). */
export const SUN_GALACTOCENTRIC_KLY = 26.67;
/** Sun sits ~20 pc above the midplane. */
export const SUN_HEIGHT_KLY = 0.068;
/** Sun position in the galaxy frame at galaxy rotation angle 0 (+x of local points to the centre). */
export const SUN_GALAXY = new Vector3(-SUN_GALACTOCENTRIC_KLY, SUN_HEIGHT_KLY, 0);
export const GALAXY_RADIUS_KLY = 50;
/**
 * Display spin of the galaxy in rad/s. Negative = clockwise seen from the north
 * galactic pole (+y), which is the real sense of rotation.
 */
export const GALAXY_SPIN = -0.018;

/* ---------------------------------------------------------------- group (Mly) */

export const ANDROMEDA = galacticToLocal(121.17, -21.57, 2.537);
export const TRIANGULUM = galacticToLocal(133.61, -31.33, 2.73);
export const LMC = galacticToLocal(280.47, -32.89, 0.163);
export const SMC = galacticToLocal(302.8, -44.3, 0.2);
