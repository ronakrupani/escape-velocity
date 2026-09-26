/**
 * THE FILM. Every chapter, camera move, look change, and scene fade lives here,
 * keyed to one normalized scroll progress value p in [0, 1].
 *
 * Camera keys are expressed in whichever frame suits the shot (see layout.ts):
 * a target point, an orbit direction (az/el in degrees, in that frame's axes),
 * and a distance. The rig interpolates direction with slerp and distance in log
 * space, so a pull-back from a 58 m rocket to a 100,000 light-year galaxy
 * feels like one continuous move.
 */
import { Vector3 } from 'three';
import type { FrameId } from './frames';
import { ease, type EaseName, monotone, progressIn, window4 } from './easing';
import {
  ANDROMEDA,
  ASTEROID_BELT,
  DEEP_ROCKET_SOL,
  DOWNRANGE_DIR,
  EARTH_CENTER_KM,
  MOON_POSITION_KM,
  PLANET_LAYOUT,
  type PlanetKey,
  planetPosition,
  orbitPosition,
  raDecToLocal,
} from './layout';

/* ================================================================ chapters */

export type ChapterId = 'tminus' | 'ascent' | 'orbit' | 'solar' | 'edge' | 'interstellar' | 'milkyway' | 'beyond';

export interface Chapter {
  id: ChapterId;
  index: string;
  label: string;
  start: number;
  end: number;
}

export const CHAPTERS: Chapter[] = [
  { id: 'tminus', index: '01', label: 'T-Minus', start: 0, end: 0.08 },
  { id: 'ascent', index: '02', label: 'Ascent', start: 0.08, end: 0.2 },
  { id: 'orbit', index: '03', label: 'Earth Orbit', start: 0.2, end: 0.32 },
  { id: 'solar', index: '04', label: 'Solar System', start: 0.32, end: 0.58 },
  { id: 'edge', index: '05', label: 'The Edge', start: 0.58, end: 0.68 },
  { id: 'interstellar', index: '06', label: 'Interstellar', start: 0.68, end: 0.78 },
  { id: 'milkyway', index: '07', label: 'The Milky Way', start: 0.78, end: 0.94 },
  { id: 'beyond', index: '08', label: 'Beyond', start: 0.94, end: 1 },
];

/** Total scroll length of the film, in viewport heights. */
export const SCROLL_VH = 1200;

export function chapterAt(p: number): Chapter {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) if (p >= CHAPTERS[i].start) return CHAPTERS[i];
  return CHAPTERS[0];
}
/** 0..1 progress within a chapter (clamped). */
export function chapterProgress(id: ChapterId, p: number) {
  const c = CHAPTERS.find((ch) => ch.id === id)!;
  return progressIn(p, c.start, c.end);
}

/* ================================================================= moments */

export const MOMENTS = {
  /** Countdown ticks 10 -> 0 across this range. */
  countdownStart: 0.006,
  ignition: 0.064,
  liftoff: 0.069,
  maxQ: 0.13,
  stageSeparation: 0.152,
  fairingSeparation: 0.168,
  karmanLine: 0.178,
  escapeVelocity: 0.197,
  moonFlyby: 0.275,
  heliopause: 0.612,
  proxima: 0.735,
  galaxyReveal: 0.87,
  andromeda: 0.965,
} as const;

/** 10 -> 0 during CH1; fractional (the DOM floors it). */
export const countdown = (p: number) => 10 * (1 - progressIn(p, MOMENTS.countdownStart, MOMENTS.ignition));

/* ============================================================ rocket path */

/** Altitude above the pad in km. Compressed from ~8 minutes of real flight. */
export const rocketAltitudeKm = monotone([
  [MOMENTS.liftoff, 0],
  [0.076, 0.05],
  [0.085, 0.5],
  [0.095, 2.2],
  [0.11, 9],
  [0.125, 20],
  [0.14, 38],
  [MOMENTS.stageSeparation, 60],
  [MOMENTS.fairingSeparation, 84],
  [MOMENTS.karmanLine, 100],
  [0.2, 170],
  [0.23, 420],
  [0.27, 2600],
  [0.32, 16000],
]);

/** Speed in km/s, peaking at Earth's escape velocity at the end of CH2. */
export const rocketSpeedKmS = monotone([
  [MOMENTS.liftoff, 0],
  [0.08, 0.04],
  [0.095, 0.22],
  [0.11, 0.55],
  [0.125, 1.0],
  [0.14, 1.7],
  [MOMENTS.stageSeparation, 2.5],
  [MOMENTS.fairingSeparation, 3.9],
  [MOMENTS.karmanLine, 5.2],
  [MOMENTS.escapeVelocity, 11.2],
  [0.23, 11.4],
]);

/** Gravity turn: downrange distance (km) as a function of altitude (km). */
const downrangeKm = (alt: number) => 0.011 * alt * alt;

/** Rocket base position in the earth frame (km). */
export function rocketPosition(p: number, out = new Vector3()) {
  const alt = rocketAltitudeKm(p);
  return out.copy(DOWNRANGE_DIR).multiplyScalar(downrangeKm(alt)).setY(alt);
}
/** Unit direction of travel (the rocket's nose points along this). */
export function rocketHeading(p: number, out = new Vector3()) {
  const alt = rocketAltitudeKm(p);
  const dDown = 0.022 * alt; // d(downrange)/d(alt)
  return out.copy(DOWNRANGE_DIR).multiplyScalar(dDown).setY(1).normalize();
}

const _focus = new Vector3();
/** Camera focus point: a little above the rocket's base, riding with it. */
const rocketFocus = (lift = 0.024) => (p: number) =>
  rocketPosition(p, _focus).addScaledVector(rocketHeading(p, new Vector3()), lift).clone();

/* ========================================================= solar beats */

export type SolarBeatId = 'sun' | PlanetKey | 'belt';
export interface SolarBeat {
  id: SolarBeatId;
  start: number;
  end: number;
}
export const SOLAR_BEATS: SolarBeat[] = [
  { id: 'sun', start: 0.32, end: 0.352 },
  { id: 'mercury', start: 0.352, end: 0.374 },
  { id: 'venus', start: 0.374, end: 0.396 },
  { id: 'earth', start: 0.396, end: 0.414 },
  { id: 'mars', start: 0.414, end: 0.436 },
  { id: 'belt', start: 0.436, end: 0.458 },
  { id: 'jupiter', start: 0.458, end: 0.488 },
  { id: 'saturn', start: 0.488, end: 0.518 },
  { id: 'uranus', start: 0.518, end: 0.546 },
  { id: 'neptune', start: 0.546, end: 0.58 },
];
export const solarBeatAt = (p: number) => SOLAR_BEATS.find((b) => p >= b.start && p < b.end) ?? null;

/* ======================================================== nearby stars */

/** Proxima Centauri (J2000 RA 217.429°, Dec -62.680°, 4.2465 ly). */
export const PROXIMA_LOCAL = raDecToLocal(217.42895, -62.67949, 4.2465);
/** Alpha Centauri A (J2000 RA 219.902°, Dec -60.834°, 4.37 ly). */
export const ALPHA_CEN_LOCAL = raDecToLocal(219.90206, -60.83399, 4.37);

/* ============================================================ look (post) */

export interface Look {
  /** Linear exposure multiplier before tone mapping. */
  exposure: number;
  bloom: number;
  bloomThreshold: number;
  /** Chromatic aberration offset in UV units (tiny). */
  chroma: number;
  vignette: number;
  grain: number;
  saturation: number;
}
const DEFAULT_LOOK: Look = {
  exposure: 1,
  bloom: 0.7,
  bloomThreshold: 0.85,
  chroma: 0.0006,
  vignette: 0.55,
  grain: 0.05,
  saturation: 1,
};

/* ============================================================ camera keys */

export type Vec3Like = Vector3 | readonly [number, number, number];
export interface CamKey {
  at: number;
  frame: FrameId;
  /** A fixed point, or a function of p for moving subjects. */
  target: Vec3Like | ((p: number) => Vector3);
  /** Orbit direction from target to camera (degrees, frame axes). az 0 = +z, 90 = +x. */
  az: number;
  el: number;
  /** Camera distance from target, in frame units. */
  dist: number;
  fov?: number;
  /** Dutch angle in degrees. */
  roll?: number;
  /** Easing used for the move from this key to the next. */
  ease?: EaseName;
  look?: Partial<Look>;
}

/** Orbit direction for a camera that looks at a planet from its sun-lit side. */
function planetShot(key: PlanetKey, at: number, opts: { side?: number; el?: number; distMul?: number; fov?: number; drift?: number; roll?: number }): CamKey {
  const P = planetPosition(key);
  const sunAz = (Math.atan2(-P.x, -P.z) * 180) / Math.PI; // direction from planet to Sun
  const side = opts.side ?? 1;
  return {
    at,
    frame: 'sol',
    target: P,
    az: sunAz + side * (58 + (opts.drift ?? 0)),
    el: opts.el ?? 9,
    dist: PLANET_LAYOUT[key].radius * (opts.distMul ?? 3.8),
    fov: opts.fov ?? 38,
    roll: opts.roll ?? 0,
    ease: 'cinematic',
  };
}
/** Two keys per planet beat: arrive and hold with a slow drift, then leave. */
function planetBeat(key: PlanetKey, opts: Parameters<typeof planetShot>[2] = {}): CamKey[] {
  const b = SOLAR_BEATS.find((s) => s.id === key)!;
  const len = b.end - b.start;
  return [
    planetShot(key, b.start + len * 0.32, opts),
    planetShot(key, b.end - len * 0.18, { ...opts, drift: (opts.drift ?? 0) + 14, distMul: (opts.distMul ?? 3.8) * 0.94 }),
  ];
}

const beltCenter = orbitPosition((ASTEROID_BELT.inner + ASTEROID_BELT.outer) / 2, ASTEROID_BELT.centerAngleDeg);

export const CAMERA_KEYS: CamKey[] = [
  /* --- CH1 T-MINUS: dusk on the pad --- */
  { at: 0, frame: 'earth', target: rocketFocus(0.03), az: -38, el: 3, dist: 0.2, fov: 34, ease: 'inOutSine', look: { exposure: 1.05, bloom: 0.55 } },
  { at: 0.036, frame: 'earth', target: rocketFocus(0.028), az: -30, el: 1.5, dist: 0.15, fov: 36, ease: 'inOutSine' },
  { at: MOMENTS.ignition, frame: 'earth', target: rocketFocus(0.018), az: -22, el: -2, dist: 0.12, fov: 40, ease: 'inOutSine' },
  { at: 0.08, frame: 'earth', target: rocketFocus(0.02), az: -14, el: -6, dist: 0.16, fov: 44, ease: 'inOutSine', look: { bloom: 0.9 } },

  /* --- CH2 ASCENT: climb, clouds, stage separation, the Kármán line --- */
  { at: 0.1, frame: 'earth', target: rocketFocus(), az: 0, el: -5, dist: 0.2, fov: 46, ease: 'cinematic' },
  { at: 0.125, frame: 'earth', target: rocketFocus(), az: 28, el: 7, dist: 0.28, fov: 42, ease: 'cinematic', look: { exposure: 1, bloom: 0.75 } },
  { at: MOMENTS.stageSeparation, frame: 'earth', target: rocketFocus(0.01), az: 58, el: 12, dist: 0.2, fov: 40, ease: 'cinematic' },
  { at: 0.168, frame: 'earth', target: rocketFocus(), az: 74, el: 18, dist: 0.32, fov: 40, ease: 'cinematic' },
  { at: 0.186, frame: 'earth', target: rocketFocus(), az: 96, el: 28, dist: 1.4, fov: 38, ease: 'cinematic' },
  { at: 0.2, frame: 'earth', target: rocketFocus(), az: 110, el: 42, dist: 32, fov: 38, ease: 'cinematic', look: { exposure: 1, bloom: 0.7 } },

  /* --- CH3 EARTH ORBIT: the whole planet, then the Moon --- */
  { at: 0.236, frame: 'earth', target: EARTH_CENTER_KM, az: 22, el: 36, dist: 21500, fov: 36, ease: 'cinematic', look: { exposure: 1.1, bloom: 0.65 } },
  { at: 0.268, frame: 'earth', target: EARTH_CENTER_KM, az: 2, el: 22, dist: 23500, fov: 36, ease: 'cinematic' },
  {
    at: 0.3,
    frame: 'earth',
    target: new Vector3().lerpVectors(EARTH_CENTER_KM, MOON_POSITION_KM, 0.35),
    az: -12,
    el: 16,
    dist: 52000,
    fov: 36,
    ease: 'cinematic',
  },

  /* --- CH4 THE SOLAR SYSTEM: the Sun, then outward past every planet --- */
  { at: 0.336, frame: 'sol', target: [0, 0, 0], az: -80, el: 9, dist: 34, fov: 40, ease: 'cinematic', look: { exposure: 0.9, bloom: 1.05, bloomThreshold: 0.9 } },
  { at: 0.348, frame: 'sol', target: [0, 0, 0], az: -68, el: 6, dist: 30, fov: 40, ease: 'cinematic' },
  ...planetBeat('mercury', { side: -1, el: 7 }),
  ...planetBeat('venus', { side: 1, el: 10 }),
  ...planetBeat('earth', { side: -1, el: 14, distMul: 4.4 }),
  ...planetBeat('mars', { side: 1, el: 8 }),
  { at: 0.442, frame: 'sol', target: beltCenter, az: -60, el: 7, dist: 7, fov: 44, ease: 'cinematic', look: { exposure: 1, bloom: 0.8, bloomThreshold: 0.85 } },
  { at: 0.454, frame: 'sol', target: beltCenter, az: -40, el: 3, dist: 5.5, fov: 46, ease: 'cinematic' },
  ...planetBeat('jupiter', { side: -1, el: 6, distMul: 3.4 }),
  ...planetBeat('saturn', { side: 1, el: 16, distMul: 4.2 }),
  ...planetBeat('uranus', { side: -1, el: 10, distMul: 4 }),
  ...planetBeat('neptune', { side: 1, el: 8, distMul: 4 }),

  /* --- CH5 THE EDGE: past the heliopause, the Sun becomes a star --- */
  { at: 0.598, frame: 'sol', target: DEEP_ROCKET_SOL, az: -74, el: 6, dist: 0.34, fov: 38, ease: 'cinematic', look: { exposure: 1.05, bloom: 0.9, bloomThreshold: 0.8 } },
  { at: 0.622, frame: 'sol', target: DEEP_ROCKET_SOL, az: -60, el: 10, dist: 0.42, fov: 38, ease: 'cinematic' },
  { at: 0.648, frame: 'local', target: [0, 0, 0], az: -50, el: 24, dist: 0.03, fov: 40, ease: 'cinematic' },
  { at: 0.674, frame: 'local', target: [0, 0, 0], az: -35, el: 28, dist: 4.6, fov: 42, ease: 'cinematic' },

  /* --- CH6 INTERSTELLAR: 4.2 light-years to the neighbours --- */
  {
    at: 0.705,
    frame: 'local',
    target: PROXIMA_LOCAL.clone().multiplyScalar(0.35),
    az: 0,
    el: 12,
    dist: 1.2,
    fov: 50,
    ease: 'cinematic',
    look: { chroma: 0.0016 },
  },
  { at: MOMENTS.proxima, frame: 'local', target: PROXIMA_LOCAL.clone().lerp(ALPHA_CEN_LOCAL, 0.4), az: 30, el: 14, dist: 0.5, fov: 42, ease: 'cinematic', look: { chroma: 0.0007 } },
  { at: 0.765, frame: 'local', target: [0, 0, 0], az: 40, el: 32, dist: 26, fov: 40, ease: 'cinematic' },
  { at: 0.782, frame: 'local', target: [0, 0, 0], az: 46, el: 38, dist: 60, fov: 40, ease: 'cinematic' },

  /* --- CH7 THE MILKY WAY: the money shot --- */
  { at: 0.805, frame: 'local', target: [0, 0, 0], az: 55, el: 42, dist: 2200, fov: 42, ease: 'cinematic', look: { exposure: 1, bloom: 1.1, bloomThreshold: 0.6 } },
  { at: 0.836, frame: 'galaxy', target: [-12, 0, 0], az: 70, el: 52, dist: 42, fov: 42, ease: 'cinematic' },
  { at: MOMENTS.galaxyReveal, frame: 'galaxy', target: [0, 0, 0], az: 96, el: 30, dist: 98, fov: 40, roll: -14, ease: 'cinematic', look: { bloom: 1.25, bloomThreshold: 0.55 } },
  { at: 0.905, frame: 'galaxy', target: [0, 0, 0], az: 118, el: 48, dist: 92, fov: 40, roll: -8, ease: 'cinematic' },
  { at: 0.938, frame: 'galaxy', target: [-6, 0, 0], az: 132, el: 64, dist: 104, fov: 40, roll: 0, ease: 'cinematic' },

  /* --- CH8 BEYOND: our galaxy, Andromeda, the Local Group --- */
  { at: 0.962, frame: 'group', target: ANDROMEDA.clone().multiplyScalar(0.08), az: 200, el: 14, dist: 0.42, fov: 44, ease: 'cinematic', look: { bloom: 1.2, bloomThreshold: 0.55 } },
  { at: 1, frame: 'group', target: ANDROMEDA.clone().multiplyScalar(0.5), az: 230, el: 26, dist: 3.4, fov: 44, ease: 'cinematic' },
];

/* =========================================================== visibility */

export type SceneId =
  | 'launch'
  | 'rocket'
  | 'clouds'
  | 'earth'
  | 'moon'
  | 'sun'
  | 'planets'
  | 'orbits'
  | 'asteroids'
  | 'heliosphere'
  | 'deepRocket'
  | 'oort'
  | 'sunStar'
  | 'sky'
  | 'nearbyStars'
  | 'warp'
  | 'galaxy'
  | 'sagittarius'
  | 'marker'
  | 'localGroup';

/** [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] for every scene element. */
export const SCENE_WINDOWS: Record<SceneId, readonly [number, number, number, number]> = {
  launch: [-1, 0, 0.19, 0.215],
  rocket: [-1, 0, 0.212, 0.228],
  clouds: [0.07, 0.09, 0.2, 0.235],
  earth: [0.12, 0.16, 0.6, 0.625],
  moon: [0.205, 0.235, 0.43, 0.45],
  sun: [0.19, 0.22, 0.7, 0.735],
  planets: [0.28, 0.31, 0.605, 0.63],
  orbits: [0.31, 0.34, 0.57, 0.6],
  asteroids: [0.4, 0.43, 0.565, 0.6],
  heliosphere: [0.55, 0.59, 0.66, 0.69],
  deepRocket: [0.572, 0.588, 0.64, 0.655],
  oort: [0.61, 0.645, 0.75, 0.79],
  sunStar: [0.6, 0.64, 0.86, 0.9],
  sky: [0.05, 0.14, 0.785, 0.82],
  nearbyStars: [0.66, 0.7, 0.8, 0.83],
  warp: [0.684, 0.698, 0.742, 0.758],
  galaxy: [0.74, 0.8, 2, 2],
  sagittarius: [0.82, 0.86, 0.95, 0.975],
  marker: [0.83, 0.862, 0.95, 0.968],
  localGroup: [0.925, 0.952, 2, 2],
};

export const sceneWeight = (id: SceneId, p: number) => {
  const [a, b, c, d] = SCENE_WINDOWS[id];
  return window4(p, a, b, c, d);
};

/* ================================================================= events */

/** Ignition flash, 0..1: a sharp spike that decays over a few % of scroll. */
export const ignitionFlash = (p: number) => {
  const t = (p - MOMENTS.ignition) / 0.012;
  if (t < 0 || t > 1) return 0;
  return t < 0.12 ? ease.outCubic(t / 0.12) : 1 - ease.outCubic((t - 0.12) / 0.88);
};
/** Engine intensity 0..1 (drives exhaust particles, glow, sound). */
export const engineThrottle = (p: number) =>
  p < MOMENTS.ignition ? 0 : Math.min(1, progressIn(p, MOMENTS.ignition, MOMENTS.ignition + 0.004)) * (1 - 0.35 * window4(p, MOMENTS.stageSeparation - 0.002, MOMENTS.stageSeparation, MOMENTS.stageSeparation + 0.004, MOMENTS.stageSeparation + 0.008)) * (1 - progressIn(p, 0.205, 0.225));
/** Camera shake amplitude 0..1 (multiplied by a small angle in the rig). */
export const shakeAmount = (p: number) => {
  const launch = p < MOMENTS.ignition ? 0 : Math.max(0, 1 - progressIn(p, MOMENTS.liftoff + 0.006, 0.15)) * progressIn(p, MOMENTS.ignition, MOMENTS.ignition + 0.004);
  const maxQ = 0.35 * window4(p, MOMENTS.maxQ - 0.012, MOMENTS.maxQ, MOMENTS.maxQ, MOMENTS.maxQ + 0.012);
  const sep = 0.6 * window4(p, MOMENTS.stageSeparation - 0.001, MOMENTS.stageSeparation, MOMENTS.stageSeparation + 0.001, MOMENTS.stageSeparation + 0.006);
  return Math.min(1, launch + maxQ + sep);
};
/** Streak amount for the interstellar warp, 0..1. */
export const warpAmount = (p: number) => window4(p, 0.686, 0.702, 0.722, 0.742);
/** Sky colour at the launch site from dusk to black, by altitude (0 = dusk, 1 = space). */
export const skyDarkness = (p: number) => {
  const alt = rocketAltitudeKm(p);
  return Math.min(1, Math.log10(1 + alt) / Math.log10(1 + 90));
};

/* ================================================================== look */

const LOOK_KEYS = (() => {
  let current = { ...DEFAULT_LOOK };
  return CAMERA_KEYS.map((k) => {
    current = { ...current, ...k.look };
    return { at: k.at, look: { ...current }, ease: k.ease ?? 'cinematic' };
  });
})();

export function sampleLook(p: number, out: Look = { ...DEFAULT_LOOK }): Look {
  let i = 0;
  while (i < LOOK_KEYS.length - 2 && p > LOOK_KEYS[i + 1].at) i++;
  const a = LOOK_KEYS[i];
  const b = LOOK_KEYS[Math.min(i + 1, LOOK_KEYS.length - 1)];
  const t = b.at === a.at ? 0 : ease[a.ease](progressIn(p, a.at, b.at));
  for (const k of Object.keys(DEFAULT_LOOK) as (keyof Look)[]) out[k] = a.look[k] + (b.look[k] - a.look[k]) * t;
  return out;
}
