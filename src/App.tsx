import { useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { DebugOverlay } from './dom/DebugOverlay';
import { Story } from './dom/Story';
import { journey, progress, rawProgress } from './journey/state';
import { SCROLL_VH } from './journey/timeline';
import { initScroll, scrollToY } from './lib/scroll';

const Experience = lazy(() => import('./three/Experience'));

declare global {
  interface Window {
    __ev?: { goto: (p: number) => void; progress: () => number };
  }
}

export default function App() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 34, mass: 0.4, restDelta: 1e-5 });

  useMotionValueEvent(scrollYProgress, 'change', (v) => rawProgress.set(v));
  useMotionValueEvent(smooth, 'change', (v) => progress.set(v));

  useEffect(() => initScroll(), []);

  // Deep links / automation: ?p=0.45 jumps straight to that point of the film.
  useEffect(() => {
    const goto = (p: number) => {
      const el = track.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const y = top + p * (el.offsetHeight - window.innerHeight);
      scrollToY(y, { immediate: true });
      smooth.jump(p);
      progress.set(p);
      rawProgress.set(p);
    };
    window.__ev = { goto, progress: () => journey.p };
    const p = new URLSearchParams(window.location.search).get('p');
    if (p !== null) requestAnimationFrame(() => goto(Math.min(1, Math.max(0, parseFloat(p)))));
  }, [smooth]);

  return (
    <>
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
      <main className="relative z-10">
        <div ref={track} id="journey" className="relative" style={{ height: `${SCROLL_VH}vh` }}>
          <div className="pointer-events-none sticky top-0 h-[100lvh] w-full overflow-hidden">
            <Story />
          </div>
        </div>
      </main>
      {journey.debug && <DebugOverlay />}
    </>
  );
}
