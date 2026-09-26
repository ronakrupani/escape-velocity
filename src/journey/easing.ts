export type Ease = (t: number) => number;

export const clamp = (v: number, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
export const clamp01 = (v: number) => clamp(v, 0, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0 at a, 1 at b, clamped. */
export const progressIn = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = progressIn(v, a, b);
  return t * t * (3 - 2 * t);
};
/** Fade in over [a,b], hold, fade out over [c,d]. */
export const window4 = (v: number, a: number, b: number, c: number, d: number) =>
  Math.min(smoothstep(a, b, v), 1 - smoothstep(c, d, v));

/** CSS-style cubic-bezier easing (Newton-Raphson with bisection fallback). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): Ease {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  const solve = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) return t;
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const v = sampleX(t);
      if (Math.abs(v - x) < 1e-6) return t;
      if (x > v) lo = t;
      else hi = t;
      t = (hi - lo) / 2 + lo;
      if (hi - lo < 1e-7) break;
    }
    return t;
  };
  return (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : sampleY(solve(t)));
}

/** The motion language of the site. No linear motion anywhere. */
export const ease = {
  /** Default camera move: slow in, slow out, weighty. */
  cinematic: cubicBezier(0.65, 0, 0.35, 1),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutQuart: cubicBezier(0.76, 0, 0.24, 1),
  inOutExpo: cubicBezier(0.87, 0, 0.13, 1),
  outExpo: cubicBezier(0.16, 1, 0.3, 1),
  outQuint: cubicBezier(0.22, 1, 0.36, 1),
  outCubic: cubicBezier(0.33, 1, 0.68, 1),
  inCubic: cubicBezier(0.32, 0, 0.67, 0),
  inQuart: cubicBezier(0.5, 0, 0.75, 0),
  /** A launch: slow build then committed acceleration. */
  launch: cubicBezier(0.55, 0, 0.9, 0.35),
} satisfies Record<string, Ease>;

export type EaseName = keyof typeof ease;

/** Same curves as CSS/Motion arrays, for DOM animation. */
export const bezier = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  cinematic: [0.65, 0, 0.35, 1],
  inExpo: [0.7, 0, 0.84, 0],
} as const satisfies Record<string, readonly [number, number, number, number]>;

/**
 * Monotone cubic (Fritsch–Carlson) interpolation through [x, y] anchors.
 * Used for HUD curves (altitude, velocity) so numbers never overshoot.
 */
export function monotone(points: ReadonlyArray<readonly [number, number]>) {
  const n = points.length;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const d: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  };
}
