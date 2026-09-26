// PLACEHOLDER — replaced by the DOM/story build.
import { motion, useTransform } from 'motion/react';
import { progress } from '../journey/state';
import { CHAPTERS, type Chapter } from '../journey/timeline';

function ChapterTitle({ c }: { c: Chapter }) {
  const len = c.end - c.start;
  const opacity = useTransform(progress, [c.start, c.start + len * 0.15, c.end - len * 0.2, c.end], [0, 1, 1, 0]);
  return (
    <motion.section style={{ opacity }} className="absolute inset-0 flex items-end p-[var(--gutter)] pb-24" aria-labelledby={`h-${c.id}`}>
      <div>
        <p className="font-mono text-xs tracking-[0.3em] text-white/50">{c.index} — {c.label.toUpperCase()}</p>
        <h2 id={`h-${c.id}`} className="font-display text-5xl font-bold uppercase md:text-7xl">{c.label}</h2>
      </div>
    </motion.section>
  );
}

export function Story() {
  return (
    <>
      {CHAPTERS.map((c) => (
        <ChapterTitle key={c.id} c={c} />
      ))}
    </>
  );
}
