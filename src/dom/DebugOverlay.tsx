import { useEffect, useRef } from 'react';
import { journey } from '../journey/state';

/** ?debug — live readout of progress, chapter, camera and fps. */
export function DebugOverlay() {
  const ref = useRef<HTMLPreElement>(null);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let fps = 60;
    const tick = () => {
      const now = performance.now();
      fps += (1000 / Math.max(1, now - last) - fps) * 0.05;
      last = now;
      const c = journey.cam;
      if (ref.current)
        ref.current.textContent = [
          `p        ${journey.p.toFixed(4)}`,
          `chapter  ${journey.chapter.id}`,
          `frame    ${c.frame}  key ${c.key}`,
          `target   ${c.target.x.toFixed(3)}, ${c.target.y.toFixed(3)}, ${c.target.z.toFixed(3)}`,
          `dist     ${c.dist.toPrecision(4)}`,
          `fov      ${c.fov.toFixed(1)}  roll ${c.roll.toFixed(1)}`,
          `quality  ${journey.quality}  fps ${fps.toFixed(0)}`,
        ].join('\n');
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <pre ref={ref} className="pointer-events-none fixed bottom-3 left-3 z-[100] rounded bg-black/70 p-3 font-mono text-[11px] leading-4 text-white/80" />;
}
