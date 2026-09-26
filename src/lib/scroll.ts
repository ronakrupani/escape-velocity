/**
 * Lenis smooth scrolling, ticked by the react-three-fiber render loop (via
 * addEffect) so scroll and 3D advance in the same frame. A fallback rAF keeps
 * scrolling alive if the canvas loop is not running (e.g. no WebGL).
 */
import { addEffect } from '@react-three/fiber';
import Lenis from 'lenis';
import { journey } from '../journey/state';

let lenis: Lenis | null = null;
let lastTick = 0;

export function initScroll() {
  if (lenis || journey.reducedMotion) return () => {};
  lenis = new Lenis({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.85, touchMultiplier: 1.35, anchors: false });
  const l = lenis;
  const unsub = addEffect((t) => {
    lastTick = performance.now();
    l.raf(t);
  });
  let raf = 0;
  const fallback = (t: number) => {
    if (performance.now() - lastTick > 120) l.raf(t);
    raf = requestAnimationFrame(fallback);
  };
  raf = requestAnimationFrame(fallback);
  return () => {
    unsub();
    cancelAnimationFrame(raf);
    l.destroy();
    lenis = null;
  };
}

export const getLenis = () => lenis;

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

/** Scroll the window to an absolute Y, smoothly unless `immediate`. */
export function scrollToY(y: number, opts: { immediate?: boolean; duration?: number; easing?: (t: number) => number; onComplete?: () => void } = {}) {
  if (lenis) {
    lenis.scrollTo(y, { immediate: opts.immediate, duration: opts.duration, easing: opts.easing, force: true, lock: !!opts.duration, onComplete: opts.onComplete });
  } else {
    window.scrollTo({ top: y, behavior: opts.immediate || journey.reducedMotion ? 'auto' : 'smooth' });
    opts.onComplete?.();
  }
}
