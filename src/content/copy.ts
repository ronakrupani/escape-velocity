/**
 * Escape Velocity: editorial copy.
 *
 * Every number here matches src/content/facts.ts (see NUMBERS and SOURCES there).
 * Voice: curious, short, concrete. No exclamation marks.
 */
import type { ChapterId } from './facts';

export interface ChapterCopy {
  index: string;
  eyebrow: string;
  headline: string;
  lede: string;
}

export const CHAPTER_COPY: Record<ChapterId, ChapterCopy> = {
  // 11.2 km/s ≈ 40,000 km/h: https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  tminus: {
    index: '01',
    eyebrow: 'T-MINUS',
    headline: 'Leaving home takes 11.2 km/s',
    lede: 'That’s about 40,000 km/h, the speed that turns a throw into a goodbye.',
  },
  // 100 km Kármán line, 99.99997% below: https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/
  ascent: {
    index: '02',
    eyebrow: 'ASCENT',
    headline: 'Space is an hour’s drive. Up.',
    lede: 'The usual boundary sits 100 km overhead. By then, almost all of the air is already underneath you.',
  },
  // ~7.7 km/s: https://www.esa.int/Enabling_Support/Operations/The_wizards_of_orbits
  orbit: {
    index: '03',
    eyebrow: 'EARTH ORBIT',
    headline: 'Falling around the world',
    lede: 'Orbit is falling sideways fast enough to keep missing the ground. In low orbit, that means about 7.7 km every second.',
  },
  // 99.8%: https://science.nasa.gov/sun/facts/
  solar: {
    index: '04',
    eyebrow: 'SOLAR SYSTEM',
    headline: 'Mostly Sun, mostly empty',
    lede: 'The Sun holds 99.8% of the mass. Everything else, from Jupiter to the last pebble, splits the leftovers.',
  },
  // Heliopause at 121.6 / 119 au: https://pmc.ncbi.nlm.nih.gov/articles/PMC8092584/
  // Both Voyagers still operating: https://science.nasa.gov/blogs/voyager/2026/08/04/nasa-engineers-help-prolong-voyager-2s-science-mission/
  edge: {
    index: '05',
    eyebrow: 'THE EDGE',
    headline: 'The Sun’s bubble has an edge',
    lede: 'About 120 times farther from the Sun than Earth, the solar wind runs into interstellar space. Two spacecraft have crossed that line, and both still phone home.',
  },
  // Proxima 4.25 ly: https://simbad.cds.unistra.fr/simbad/sim-id?Ident=Proxima+Centauri
  // 1 ly = 9.46 trillion km: https://iauarchive.eso.org/public/themes/measuring/
  interstellar: {
    index: '06',
    eyebrow: 'INTERSTELLAR',
    headline: 'Even light takes over four years',
    lede: 'The nearest other star is 4.25 light-years out. A light-year is about 9.46 trillion km, so pack snacks.',
  },
  // 100–400 billion stars: https://science.nasa.gov/universe/exoplanets/our-milky-way-galaxy-how-big-is-space/
  // ~27,000 ly: https://www.eso.org/public/news/eso2208-eht-mw/
  milkyway: {
    index: '07',
    eyebrow: 'THE MILKY WAY',
    headline: 'You are here. Roughly.',
    lede: 'The Sun is one of 100 to 400 billion stars, about 27,000 light-years from the centre. Nobody has counted them all.',
  },
  // 2.5 Mly: https://science.nasa.gov/image-article/apod-2021-june-25-andromeda-in-a-single-shot/
  // Merger 50–90% within 10 Gyr: https://science.nasa.gov/missions/hubble/apocalypse-when-hubble-casts-doubt-on-certainty-of-galactic-collision/ ; https://arxiv.org/abs/2603.22863
  beyond: {
    index: '08',
    eyebrow: 'BEYOND',
    headline: 'The neighbours are coming over',
    lede: 'Andromeda is 2.5 million light-years away and closing. A merger is likely within 10 billion years, but not certain.',
  },
};

export const HERO = { title: 'ESCAPE VELOCITY', sub: 'Scroll to launch.' } as const;

// Local Group: nearly 10 million ly (https://imagine.gsfc.nasa.gov/features/cosmic/local_group_info.html);
// more than 100 known galaxies (≥65 MW dwarfs, https://arxiv.org/html/2411.07424v1, + 36 around Andromeda, https://esahubble.org/images/opo2509/)
export const CLOSING: { line: string; sub: string; cta: 'Launch again' } = {
  line: 'And that’s just the neighbourhood.',
  sub: 'The Local Group: nearly 10 million light-years across, more than 100 known galaxies, and one small planet that looked up.',
  cta: 'Launch again',
};

export const NOT_TO_SCALE = 'Not to scale. At true scale, you’d mostly see black.';
