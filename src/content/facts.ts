/**
 * Escape Velocity: facts, figures and sources.
 *
 * Every fact, planet, star and number below was researched and then checked by
 * an adversarial fact-checker. Only claims marked "confirmed" or "corrected"
 * made it in, and corrected wording or numbers are used where they were given.
 * Each entry names its sources (see SOURCES) and has the source URL in a comment.
 *
 * Data are current as of 2026-09-25. Things that change: moon counts, Voyager
 * positions and instrument status, Milky Way–Andromeda merger odds.
 */

/* ======================================================================= types */

export type ChapterId = 'tminus' | 'ascent' | 'orbit' | 'solar' | 'edge' | 'interstellar' | 'milkyway' | 'beyond';

export interface Source {
  id: string;
  label: string;
  publisher: string;
  url: string;
}

/** `value` drives an animated counter, e.g. {value: 11.2, decimals: 1, suffix: ' km/s', label: 'Escape velocity'}. */
export interface Stat {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface Fact {
  id: string;
  chapter: ChapterId;
  subject: string;
  title: string;
  body: string;
  stat?: Stat;
  sourceIds: string[];
  /** Optional honest footnote the UI can show in small type. */
  caveat?: string;
}

export type PlanetId = 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';

export interface PlanetInfo {
  id: PlanetId;
  name: string;
  tagline: string;
  fact: string;
  /** Volumetric mean radius. */
  radiusKm: number;
  semiMajorAxisAU: number;
  /** Semi-major axis in millions of km. */
  distanceFromSunMkm: number;
  /** Rotation relative to the stars. Negative = retrograde (Venus, Uranus). */
  siderealRotationHours: number;
  /** Solar day (sunrise to sunrise), human-readable. */
  dayLength: string;
  /** Sidereal orbital period, human-readable. */
  yearLength: string;
  axialTiltDeg: number;
  moons: number;
  moonsAsOf: string;
  sourceIds: string[];
  /** Extra short facts (same length rules as Fact.body). */
  more: string[];
}

export interface NearbyStar {
  id: string;
  name: string;
  distanceLy: number;
  /** ICRS, epoch J2000, degrees. */
  raDeg: number;
  decDeg: number;
  spectralType: string;
  /** Approximate display colour for the spectral type, not a measurement. */
  color: string;
  note: string;
  sourceIds: string[];
}

export interface AtmosphereLayer {
  name: string;
  fromKm: number;
  toKm: number;
  /** Short HUD-friendly note. */
  note?: string;
  /** Where the physical layer really ends, when the HUD band is cut short. */
  layerTopKm?: number;
  sourceIds?: string[];
}

export interface AltitudeMarker {
  name: string;
  km: number;
  sourceIds: string[];
}

export interface Caveat {
  id: string;
  text: string;
  sourceIds: string[];
}

/* ===================================================================== sources */

export const SOURCES: Source[] = [
  /* ---- NASA NSSDC fact sheets ---- */
  { id: 'nssdc-planetary', label: 'Planetary Fact Sheet (Metric)', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
  { id: 'nssdc-sun', label: 'Sun Fact Sheet', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html' },
  { id: 'nssdc-mercury', label: 'Mercury Fact Sheet', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html' },
  { id: 'nssdc-venus', label: 'Venus Fact Sheet', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html' },
  { id: 'nssdc-earth', label: 'Earth Fact Sheet', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html' },
  { id: 'nssdc-moon', label: 'Moon Fact Sheet', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html' },
  { id: 'nssdc-mars', label: 'Mars Fact Sheet', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html' },
  { id: 'nssdc-jupiter', label: 'Jupiter Fact Sheet', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html' },
  { id: 'nssdc-saturn', label: 'Saturn Fact Sheet', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html' },
  { id: 'nssdc-uranus', label: 'Uranus Fact Sheet', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html' },
  { id: 'nssdc-neptune', label: 'Neptune Fact Sheet', publisher: 'NASA Goddard Space Flight Center, NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html' },

  /* ---- T-minus / Earth ---- */
  { id: 'spaceplace-launch', label: 'Launch a rocket from a spinning planet', publisher: 'NASA Space Place', url: 'https://spaceplace.nasa.gov/launch-windows/en/' },
  { id: 'esa-kourou', label: 'Sentinel-2: About the launch', publisher: 'European Space Agency', url: 'https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/About_the_launch' },

  /* ---- Ascent / atmosphere ---- */
  { id: 'nasa-atmos-layers', label: "Earth's Atmospheric Layers", publisher: 'NASA', url: 'https://www.nasa.gov/image-article/earths-atmospheric-layers-3/' },
  { id: 'nasa-atmos-cake', label: "Earth's Atmosphere: A Multi-layered Cake", publisher: 'NASA Science', url: 'https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/' },
  { id: 'ucar-layers', label: "Layers of Earth's Atmosphere", publisher: 'UCAR Center for Science Education', url: 'https://scied.ucar.edu/learning-zone/atmosphere/layers-earths-atmosphere' },
  { id: 'esa-geocorona', label: "Earth's atmosphere stretches out to the Moon – and beyond", publisher: 'European Space Agency', url: 'https://www.esa.int/Science_Exploration/Space_Science/Earth_s_atmosphere_stretches_out_to_the_Moon_and_beyond' },
  { id: 'noaa-ozone-20q', label: 'Twenty Questions and Answers About the Ozone Layer (2022 Assessment)', publisher: 'NOAA Chemical Sciences Laboratory / WMO / UNEP', url: 'https://csl.noaa.gov/assessments/ozone/2022/twentyquestions/' },
  { id: 'nasa-ozonewatch', label: 'Ozone Facts: What is the ozone layer?', publisher: 'NASA Ozone Watch', url: 'https://ozonewatch.gsfc.nasa.gov/facts/SH.html' },
  { id: 'mcdowell-2018', label: 'The Edge of Space: Revisiting the Karman Line (Acta Astronautica 151, 2018)', publisher: 'J. C. McDowell, arXiv:1807.07894', url: 'https://arxiv.org/abs/1807.07894' },
  { id: 'noaa-nesdis-layers', label: 'Peeling Back the Layers of the Atmosphere', publisher: 'NOAA NESDIS', url: 'https://www.nesdis.noaa.gov/news/peeling-back-the-layers-of-the-atmosphere' },
  { id: 'nasa-grc-atmosphere', label: 'Earth Atmosphere (Beginner’s Guide to Aeronautics)', publisher: 'NASA Glenn Research Center', url: 'https://www.grc.nasa.gov/www/k-12/airplane/atmosphere.html' },

  /* ---- Orbit / Moon ---- */
  { id: 'nasa-iss-facts', label: 'International Space Station Facts and Figures', publisher: 'NASA', url: 'https://www.nasa.gov/international-space-station/space-station-facts-and-figures/' },
  { id: 'esa-iss-orbits', label: 'The wizards of orbits', publisher: 'European Space Agency', url: 'https://www.esa.int/Enabling_Support/Operations/The_wizards_of_orbits' },
  { id: 'nasa-jsc-orbit', label: 'Space Station Orbit Tutorial', publisher: 'NASA Johnson Space Center', url: 'https://eol.jsc.nasa.gov/Tools/orbitTutorial.htm' },
  { id: 'nasa-iss-altitude-2025', label: 'Station Orbiting Higher as Exercise, Research, and Maintenance Continue', publisher: 'NASA Space Station Blog (19 Nov 2025)', url: 'https://www.nasa.gov/blogs/spacestation/2025/11/19/station-orbiting-higher-as-exercise-research-and-maintenance-continue/' },
  { id: 'nasa-llr', label: 'Laser Beams Reflected Between Earth and Moon Boost Science', publisher: 'NASA', url: 'https://www.nasa.gov/missions/laser-beams-reflected-between-earth-and-moon-boost-science/' },
  { id: 'nasa-grc-light-moon', label: '“Seeing” the Earth, Moon, and Sun to Scale', publisher: 'NASA Glenn Research Center', url: 'https://www.grc.nasa.gov/www/k-12/Numbers/Math/Mathematical_Thinking/seeing_the_earth_moon.htm' },
  { id: 'nasa-artemis2-fd6', label: 'Artemis II Flight Day 6: Crew Wraps Historic Lunar Flyby', publisher: 'NASA (6 Apr 2026)', url: 'https://www.nasa.gov/blogs/missions/2026/04/06/artemis-ii-flight-day-6-crew-wraps-historic-lunar-flyby/' },

  /* ---- Solar system ---- */
  { id: 'nasa-sun-facts', label: 'Sun: Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/sun/facts/' },
  { id: 'spaceplace-sun', label: 'All About the Sun', publisher: 'NASA Space Place', url: 'https://spaceplace.nasa.gov/all-about-the-sun/en/' },
  { id: 'jpl-astro-par', label: 'Astrodynamic Parameters', publisher: 'NASA JPL Solar System Dynamics', url: 'https://ssd.jpl.nasa.gov/astro_par.html' },
  { id: 'nasa-mercury-facts', label: 'Mercury: Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/mercury/facts/' },
  { id: 'nasa-venus-facts', label: 'Venus: Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/venus/venus-facts/' },
  { id: 'nasa-mars-sunset', label: 'What Do Sunrises and Sunsets Look Like on Mars?', publisher: 'NASA Science', url: 'https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/' },
  { id: 'esa-olympus', label: 'At the foot of the Red Planet’s giant volcano', publisher: 'European Space Agency (Mars Express)', url: 'https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/At_the_foot_of_the_Red_Planet_s_giant_volcano' },
  { id: 'nature-everest', label: 'Mount Everest is 86 centimetres taller than previously thought (8,848.86 m)', publisher: 'Nature (8 Dec 2020)', url: 'https://www.nature.com/articles/d41586-020-03502-y' },
  { id: 'lucy-belt', label: 'The Density of the Asteroid Belt', publisher: 'NASA Lucy Mission (Southwest Research Institute)', url: 'https://lucy.swri.edu/MainBeltDensity.html' },
  { id: 'pitjeva-2018', label: 'Masses of the Main Asteroid Belt and the Kuiper Belt (Astronomy Letters 44, 554)', publisher: 'Pitjeva & Pitjev, arXiv:1811.05191', url: 'https://arxiv.org/abs/1811.05191' },
  { id: 'jpl-sbdb-ceres', label: 'Small-Body Database: 1 Ceres (physical parameters)', publisher: 'NASA JPL Solar System Dynamics', url: 'https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=1&phys-par=1' },
  { id: 'nasa-jupiter-facts', label: 'Jupiter: Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/jupiter/jupiter-facts/' },
  { id: 'nasa-grs-2014', label: 'Hubble Shows Jupiter’s Great Red Spot is Smaller than Ever Measured', publisher: 'NASA Science (15 May 2014)', url: 'https://science.nasa.gov/missions/hubble/nasas-hubble-shows-jupiters-great-red-spot-is-smaller-than-ever-measured/' },
  { id: 'nasa-grs-2024', label: 'Hubble Watches Jupiter’s Great Red Spot Behave Like a Stress Ball', publisher: 'NASA Science (9 Oct 2024)', url: 'https://science.nasa.gov/missions/hubble/nasas-hubble-watches-jupiters-great-red-spot-behave-like-a-stress-ball/' },
  { id: 'nasa-jupiter-moons', label: 'Jupiter: Moons', publisher: 'NASA Science', url: 'https://science.nasa.gov/jupiter/jupiter-moons/' },
  { id: 'nasa-saturn-facts', label: 'Saturn: Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/saturn/facts/' },
  { id: 'nasa-saturn-moons', label: 'Saturn: Moons', publisher: 'NASA Science', url: 'https://science.nasa.gov/saturn/moons/' },
  { id: 'mpc-2026-m19', label: 'MPEC 2026-M19: S/2009 S 2', publisher: 'IAU Minor Planet Center (17 Jun 2026)', url: 'https://minorplanetcenter.net/mpec/K26/K26M19.html' },
  { id: 'jpl-sats', label: 'Planetary Satellite Discovery Circumstances', publisher: 'NASA JPL Solar System Dynamics', url: 'https://ssd.jpl.nasa.gov/sats/discovery.html' },
  { id: 'jpl-saturn-day', label: 'Scientists Finally Know What Time It Is on Saturn', publisher: 'NASA JPL (18 Jan 2019)', url: 'https://www.jpl.nasa.gov/news/scientists-finally-know-what-time-it-is-on-saturn/' },
  { id: 'nasa-uranus-facts', label: 'Uranus: Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/uranus/facts/' },
  { id: 'nasa-uranus-moons', label: 'Uranus: Moons', publisher: 'NASA Science', url: 'https://science.nasa.gov/uranus/moons/' },
  { id: 'esahubble-uranus-seasons', label: 'Uranus (November 2014 and November 2022)', publisher: 'ESA/Hubble', url: 'https://esahubble.org/images/heic2303f/' },
  { id: 'esahubble-uranus-day', label: 'Hubble helps determine Uranus’ rotation rate with unprecedented precision', publisher: 'ESA/Hubble (7 Apr 2025)', url: 'https://esahubble.org/news/heic2503/' },
  { id: 'nasa-neptune-facts', label: 'Neptune: Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/neptune/neptune-facts/' },
  { id: 'nasa-neptune-moons', label: 'Neptune: Moons', publisher: 'NASA Science', url: 'https://science.nasa.gov/neptune/moons/' },

  /* ---- The edge ---- */
  { id: 'nasa-voyager-where', label: 'Where Are Voyager 1 and Voyager 2 Now?', publisher: 'NASA Science', url: 'https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/' },
  { id: 'nasa-voyager-lightday', label: 'Voyager 1: What Is a Light-Day?', publisher: 'NASA Science', url: 'https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/' },
  { id: 'jpl-horizons-v1', label: 'JPL Horizons ephemeris for Voyager 1, 2026-09-25', publisher: 'NASA JPL Solar System Dynamics', url: "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='-31'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='2026-09-25'&STOP_TIME='2026-09-26'&STEP_SIZE='1d'&QUANTITIES='19,20'&RANGE_UNITS='KM'&CAL_FORMAT='CAL'" },
  { id: 'jpl-horizons-v1-2026', label: 'JPL Horizons ephemeris for Voyager 1, monthly through 2026', publisher: 'NASA JPL Solar System Dynamics', url: "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='-31'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='2026-01-01'&STOP_TIME='2026-12-31'&STEP_SIZE='1 MONTHS'&QUANTITIES='20'&RANGE_UNITS='KM'&CAL_FORMAT='CAL'" },
  { id: 'pnas-voyager', label: 'News Feature: Voyager still breaking barriers decades after launch', publisher: 'PNAS (Croswell 2021, via PubMed Central)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8092584/' },
  { id: 'jpl-voyager2-interstellar', label: 'NASA’s Voyager 2 Probe Enters Interstellar Space', publisher: 'NASA JPL', url: 'https://www.jpl.nasa.gov/news/nasas-voyager-2-probe-enters-interstellar-space/' },
  { id: 'nasa-voyager1-lecp', label: 'NASA Shuts Off Instrument on Voyager 1 to Keep Spacecraft Operating', publisher: 'NASA Voyager Blog (17 Apr 2026)', url: 'https://science.nasa.gov/blogs/voyager/2026/04/17/nasa-shuts-off-instrument-on-voyager-1-to-keep-spacecraft-operating/' },
  { id: 'nasa-voyager2-power', label: 'NASA Engineers Help Prolong Voyager 2’s Science Mission', publisher: 'NASA Voyager Blog (4 Aug 2026)', url: 'https://science.nasa.gov/blogs/voyager/2026/08/04/nasa-engineers-help-prolong-voyager-2s-science-mission/' },
  { id: 'nasa-oort-facts', label: 'Oort Cloud: Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/solar-system/oort-cloud/facts/' },
  { id: 'nasa-oort-infographic', label: 'Oort Cloud and Scale of the Solar System (infographic)', publisher: 'NASA Science', url: 'https://science.nasa.gov/resource/oort-cloud-and-scale-of-the-solar-system-infographic/' },

  /* ---- Interstellar ---- */
  { id: 'iau-measuring', label: 'Measuring the Universe', publisher: 'International Astronomical Union (IAU archive at ESO)', url: 'https://iauarchive.eso.org/public/themes/measuring/' },
  { id: 'simbad-proxima', label: 'SIMBAD: Proxima Centauri', publisher: 'CDS, Université de Strasbourg', url: 'https://simbad.cds.unistra.fr/simbad/sim-id?Ident=Proxima+Centauri' },
  { id: 'simbad-tap', label: 'SIMBAD TAP service (coordinates, parallaxes, spectral types)', publisher: 'CDS, Université de Strasbourg', url: 'https://simbad.cds.unistra.fr/simbad/sim-tap/sync' },
  { id: 'akeson-2021', label: 'Precision Millimeter Astrometry of the α Centauri AB System (AJ 162, 14)', publisher: 'The Astronomical Journal (Akeson et al. 2021)', url: 'https://iopscience.iop.org/article/10.3847/1538-3881/abfaff' },
  { id: 'eso-proxima-b', label: 'Planet Found in Habitable Zone Around Nearest Star (eso1629)', publisher: 'European Southern Observatory', url: 'https://www.eso.org/public/news/eso1629/' },
  { id: 'nirps-2025', label: 'Diving into the planetary system of Proxima with NIRPS (A&A 700, A11)', publisher: 'Suárez Mascareño et al. 2025, arXiv:2507.21751', url: 'https://arxiv.org/abs/2507.21751' },
  { id: 'nasa-3star', label: 'Our Nearest Celestial Neighbor: An Exotic 3-Star System', publisher: 'NASA Science', url: 'https://science.nasa.gov/exoplanets/other-stars-other-worlds/our-nearest-celestial-neighbor-an-exotic-3-star-system/' },
  { id: 'nasa-webb-alphacen', label: 'NASA’s Webb Finds New Evidence for Planet Around Closest Solar Twin', publisher: 'NASA Science', url: 'https://science.nasa.gov/missions/webb/nasas-webb-finds-new-evidence-for-planet-around-closest-solar-twin/' },
  { id: 'nasa-imagine-nearest', label: 'The Nearest Neighbor Star', publisher: 'NASA Goddard, Imagine the Universe!', url: 'https://imagine.gsfc.nasa.gov/features/cosmic/nearest_star_info.html' },
  { id: 'aasnova-barnard', label: 'Confirmed at Last: Barnard’s Star Hosts Four Tiny Planets', publisher: 'AAS Nova (American Astronomical Society)', url: 'https://aasnova.org/2025/03/11/confirmed-at-last-barnards-star-hosts-four-tiny-planets/' },

  /* ---- Milky Way ---- */
  { id: 'nasa-mw-size', label: 'Our Milky Way Galaxy: How Big is Space?', publisher: 'NASA Science', url: 'https://science.nasa.gov/universe/exoplanets/our-milky-way-galaxy-how-big-is-space/' },
  { id: 'lopez-corredoira-2018', label: 'Disk stars in the Milky Way detected beyond 25 kpc from its center (A&A 612, L8)', publisher: 'López-Corredoira et al. 2018, arXiv:1804.03064', url: 'https://arxiv.org/abs/1804.03064' },
  { id: 'iac-disc', label: 'The disc of the Milky Way is bigger than we thought', publisher: 'Instituto de Astrofísica de Canarias', url: 'https://www.iac.es/en/outreach/news/disc-milky-way-bigger-we-thought' },
  { id: 'gravity-2022', label: 'Mass distribution in the Galactic Center based on interferometric astrometry of multiple stellar orbits (A&A 657, L12)', publisher: 'GRAVITY Collaboration 2022, arXiv:2112.07478', url: 'https://arxiv.org/pdf/2112.07478' },
  { id: 'gravity-2024', label: 'Improving constraints on the extended mass distribution in the Galactic Center with stellar orbits', publisher: 'GRAVITY Collaboration 2024, arXiv:2409.12261', url: 'https://arxiv.org/abs/2409.12261' },
  { id: 'reid-2019', label: 'Trigonometric Parallaxes of High-mass Star-forming Regions: Our View of the Milky Way (ApJ 885, 131)', publisher: 'Reid et al. 2019, arXiv:1910.03357', url: 'https://arxiv.org/abs/1910.03357' },
  { id: 'nasa-imagine-mw', label: 'The Milky Way Galaxy', publisher: 'NASA Goddard, Imagine the Universe!', url: 'https://imagine.gsfc.nasa.gov/science/featured_science/milkyway/' },
  { id: 'nhm-dinos', label: 'Where did dinosaurs come from?', publisher: 'Natural History Museum, London', url: 'https://www.nhm.ac.uk/discover/where-did-dinosaurs-come-from.html' },
  { id: 'mit-dinos-2020', label: 'Study pinpoints timing of dinosaur evolution', publisher: 'MIT News (29 Jul 2020)', url: 'https://news.mit.edu/2020/study-timing-dinosaurs-evolution-0729' },
  { id: 'jpl-spiral-arms', label: 'Two of the Milky Way’s Spiral Arms Go Missing', publisher: 'NASA JPL (3 Jun 2008)', url: 'https://www.jpl.nasa.gov/news/two-of-the-milky-ways-spiral-arms-go-missing/' },
  { id: 'eso-sgra', label: 'Astronomers reveal first image of the black hole at the heart of our galaxy (eso2208)', publisher: 'ESO / Event Horizon Telescope Collaboration (12 May 2022)', url: 'https://www.eso.org/public/news/eso2208-eht-mw/' },

  /* ---- Beyond ---- */
  { id: 'apod-andromeda', label: 'APOD 2021 June 25: Andromeda in a Single Shot', publisher: 'NASA Astronomy Picture of the Day', url: 'https://science.nasa.gov/image-article/apod-2021-june-25-andromeda-in-a-single-shot/' },
  { id: 'nasa-nsn-andromeda', label: 'October’s Night Sky Notes: Catch Andromeda Rising', publisher: 'NASA Night Sky Network', url: 'https://science.nasa.gov/solar-system/skywatching/night-sky-network/catch-andromeda-rising/' },
  { id: 'nasa-m31-mosaic-2025', label: 'NASA’s Hubble Traces Hidden History of Andromeda Galaxy', publisher: 'NASA Science (16 Jan 2025)', url: 'https://science.nasa.gov/missions/hubble/nasas-hubble-traces-hidden-history-of-andromeda-galaxy/' },
  { id: 'si-homo-sapiens', label: 'Homo sapiens', publisher: 'Smithsonian National Museum of Natural History, Human Origins Program', url: 'https://humanorigins.si.edu/evidence/human-fossils/species/homo-sapiens' },
  { id: 'si-stone-tools', label: 'Stone Tools', publisher: 'Smithsonian National Museum of Natural History, Human Origins Program', url: 'https://humanorigins.si.edu/evidence/behavior/stone-tools' },
  { id: 'nasa-andromeda-2012', label: 'NASA’s Hubble Shows Milky Way is Destined for Head-On Collision with Andromeda Galaxy (2012)', publisher: 'NASA Science', url: 'https://science.nasa.gov/missions/hubble/nasas-hubble-shows-milky-way-is-destined-for-head-on-collision-with-andromeda-galaxy' },
  { id: 'nasa-sawala-2025', label: 'Apocalypse When? Hubble Casts Doubt on Certainty of Galactic Collision', publisher: 'NASA Science / ESA (2 Jun 2025)', url: 'https://science.nasa.gov/missions/hubble/apocalypse-when-hubble-casts-doubt-on-certainty-of-galactic-collision/' },
  { id: 'wu-2026', label: 'The Fate of the Milky Way–Andromeda System: To Merge or Not? (ApJL 1001, L19)', publisher: 'Wu, Huang, Zhang, Sun & Shao 2026, arXiv:2603.22863', url: 'https://arxiv.org/abs/2603.22863' },
  { id: 'wu-2026-iop', label: 'The Fate of the Milky Way–Andromeda System: To Merge or Not? (journal page)', publisher: 'The Astrophysical Journal Letters (IOP Publishing)', url: 'https://iopscience.iop.org/article/10.3847/2041-8213/ae5799' },
  { id: 'pace-2025', label: 'The Local Volume Database (Open Journal of Astrophysics)', publisher: 'A. B. Pace 2025, arXiv:2411.07424', url: 'https://arxiv.org/html/2411.07424v1' },
  { id: 'nasa-imagine-local-group', label: 'The Local Group', publisher: 'NASA Goddard, Imagine the Universe!', url: 'https://imagine.gsfc.nasa.gov/features/cosmic/local_group_info.html' },
  { id: 'esahubble-opo2509', label: 'Hubble surveys Andromeda’s satellite galaxies (opo2509)', publisher: 'ESA/Hubble (27 Feb 2025)', url: 'https://esahubble.org/images/opo2509/' },
];

/* ======================================================================= facts */

export const FACTS: Fact[] = [
  /* ------------------------------------------------------------ 01 T-MINUS */

  // https://spaceplace.nasa.gov/launch-windows/en/ (1,675 km/h at the equator)
  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html (radius + sidereal day give 465 m/s)
  // https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/About_the_launch (Kourou: +460 m/s)
  {
    id: 'earth-rotation-eastward-boost',
    chapter: 'tminus',
    subject: 'launch boost from Earth’s rotation',
    title: 'Earth’s spin is a free head start',
    body: 'At the equator, Earth’s surface moves east at about 1,675 km/h (465 m/s). Launch eastward and you start with that speed banked; the boost shrinks toward the poles.',
    stat: { value: 465, suffix: ' m/s', label: 'Free speed at the equator' },
    sourceIds: ['spaceplace-launch', 'nssdc-earth', 'esa-kourou'],
    caveat: 'Roughly scales with the cosine of latitude: about 408 m/s at 28.5° N.',
  },
  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html (escape velocity 11.186 km/s)
  {
    id: 'escape-velocity-earth',
    chapter: 'tminus',
    subject: 'escape velocity',
    title: '11.2 km/s, or you come back',
    body: 'Coasting away from Earth for good, with no engine, takes 11.2 km/s at the surface: about 40,000 km/h. Rockets skip the single giant kick by burning on the way up.',
    stat: { value: 11.2, decimals: 1, suffix: ' km/s', label: 'Escape velocity' },
    sourceIds: ['nssdc-earth'],
    caveat: 'Ignores air drag and Earth’s spin. Low orbit needs only about 7.7 km/s.',
  },

  /* ------------------------------------------------------------- 02 ASCENT */

  // https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/ (100 km; 99.99997%)
  // https://arxiv.org/abs/1807.07894 (80 km proposal)
  // https://www.nesdis.noaa.gov/news/peeling-back-the-layers-of-the-atmosphere (US astronaut threshold, 50 miles)
  {
    id: 'karman-line-99-99997-percent',
    chapter: 'ascent',
    subject: 'Kármán line',
    title: 'Space starts 100 km up. Roughly.',
    body: 'Most scientists put the edge of space at 100 km, the Kármán line, with 99.99997% of the atmosphere below. A 2018 study argued for 80 km, close to the US astronaut threshold.',
    stat: { value: 99.99997, decimals: 5, suffix: '%', label: 'Of the atmosphere below 100 km' },
    sourceIds: ['nasa-atmos-cake', 'mcdowell-2018', 'noaa-nesdis-layers'],
    caveat: 'By US standards, anyone who passes 50 miles (about 80.5 km) counts as an astronaut.',
  },
  // https://csl.noaa.gov/assessments/ozone/2022/twentyquestions/ (~90% in stratosphere; ~3 mm)
  // https://ozonewatch.gsfc.nasa.gov/facts/SH.html (peak ~32 km)
  {
    id: 'stratosphere-warms-ozone-3mm',
    chapter: 'ascent',
    subject: 'stratosphere and ozone',
    title: 'All the ozone would be 3 mm thick',
    body: 'About 90% of Earth’s ozone sits in the stratosphere, soaking up ultraviolet light. Squeeze all of it down to the surface and you’d get a layer about 3 mm thick.',
    stat: { value: 3, suffix: ' mm', label: 'All the ozone, squeezed flat' },
    sourceIds: ['noaa-ozone-20q', 'nasa-ozonewatch'],
    caveat: 'Average thickness at surface temperature and pressure.',
  },
  // https://www.grc.nasa.gov/www/k-12/airplane/atmosphere.html (basketball / plastic wrap)
  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html (mean radius 6,371 km; 100/6371 = 1.57%)
  {
    id: 'atmosphere-thin-as-plastic-wrap',
    chapter: 'ascent',
    subject: 'thinness of the atmosphere',
    title: 'Earth’s air, at basketball scale',
    body: 'If Earth were a basketball, the air we breathe would be about as thick as a sheet of plastic wrap. Even the edge of space, 100 km up, is just 1.6% of Earth’s radius.',
    stat: { value: 1.6, decimals: 1, suffix: '%', label: 'Edge of space, as a share of Earth’s radius' },
    sourceIds: ['nasa-grc-atmosphere', 'nssdc-earth'],
    caveat: 'At basketball scale, 100 km is about 2 mm; most of the air’s mass sits in the bottom few kilometres.',
  },

  /* -------------------------------------------------------------- 03 ORBIT */

  // https://www.esa.int/Enabling_Support/Operations/The_wizards_of_orbits (7.7 km/s, 92 min)
  // https://eol.jsc.nasa.gov/Tools/orbitTutorial.htm (90–93 min; 15.5–15.9 orbits/day)
  // https://www.nasa.gov/international-space-station/space-station-facts-and-figures/ ("16 sunrises", rounded)
  {
    id: 'iss-16-sunrises',
    chapter: 'orbit',
    subject: 'low Earth orbit speed',
    title: 'A sunrise every 92 minutes',
    body: 'The space station moves at about 7.7 km every second, circling Earth about every 92 minutes. Its crew gets 15 or 16 sunrises a day.',
    stat: { value: 7.7, decimals: 1, suffix: ' km/s', label: 'Space station speed' },
    sourceIds: ['esa-iss-orbits', 'nasa-jsc-orbit', 'nasa-iss-facts'],
    caveat: 'About 15.5 orbits a day at today’s ~420 km altitude; often rounded to 16.',
  },
  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/ (equatorial diameters, sum 387,941 km)
  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html (384,400 / 363,300 / 405,500 km; radius 1,737.4 km)
  // polar radii from each planet's NSSDC sheet (sum of polar diameters ≈ 364,797 km)
  {
    id: 'planets-fit-between-earth-and-moon',
    chapter: 'orbit',
    subject: 'planets between Earth and Moon',
    title: 'Seven planets, one gap, some conditions',
    body: 'At the Moon’s average distance, the other seven planets squeeze between Earth and Moon only if lined up pole to pole. When the Moon is farthest they fit either way; when closest, never.',
    stat: { value: 11500, prefix: '~', suffix: ' km', label: 'Room to spare, pole to pole' },
    sourceIds: ['nssdc-planetary', 'nssdc-moon', 'nssdc-earth', 'nssdc-mercury', 'nssdc-venus', 'nssdc-mars', 'nssdc-jupiter', 'nssdc-saturn', 'nssdc-uranus', 'nssdc-neptune'],
    caveat: 'Surface-to-surface gap: ~376,290 km on average, ~397,390 km at apogee, ~355,190 km at perigee. Our arithmetic from fact-sheet diameters.',
  },
  // https://www.nasa.gov/blogs/missions/2026/04/06/artemis-ii-flight-day-6-crew-wraps-historic-lunar-flyby/
  // 252,756 mi ≈ 406,771 km; Apollo 13 248,655 mi ≈ 400,171 km
  {
    id: 'artemis-ii-farthest-humans',
    chapter: 'orbit',
    subject: 'human distance record (2026)',
    title: 'The farthest humans have ever been',
    body: 'On 6 April 2026, the Artemis II crew swung around the Moon and reached about 406,770 km from Earth. That beat Apollo 13’s 1970 record by roughly 6,600 km.',
    stat: { value: 406770, prefix: '~', suffix: ' km', label: 'Farthest humans from Earth' },
    sourceIds: ['nasa-artemis2-fd6'],
  },

  /* -------------------------------------------------------------- 04 SOLAR */

  // https://science.nasa.gov/sun/facts/ (99.8%)
  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html (332,900 Earth masses)
  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/ (planet masses sum to 0.134% of total; Jupiter ≈ 71% of that)
  {
    id: 'sun-holds-99-8-percent-of-mass',
    chapter: 'solar',
    subject: 'sun',
    title: 'The Sun is 99.8% of everything here',
    body: 'The Sun holds about 99.8% of the solar system’s mass. All eight planets together come to roughly 0.13%, and Jupiter is most of that.',
    stat: { value: 99.8, decimals: 1, suffix: '%', label: 'Share of the solar system’s mass' },
    sourceIds: ['nasa-sun-facts', 'nssdc-sun', 'nssdc-planetary'],
  },
  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html (mass conversion rate 4,260 × 10^6 kg/s)
  {
    id: 'sun-converts-4-million-tonnes-per-second',
    chapter: 'solar',
    subject: 'sun',
    title: 'Over 4 million tonnes lighter, every second',
    body: 'Fusion turns about 4.26 million tonnes of the Sun’s mass into energy each second. Even at that rate, 4.6 billion years would use up only about 0.03% of it.',
    stat: { value: 4.26, decimals: 2, suffix: ' million t/s', label: 'Mass the Sun turns into energy' },
    sourceIds: ['nssdc-sun', 'nasa-sun-facts'],
    caveat: 'The 0.03% is our arithmetic at today’s rate; the young Sun was dimmer, so the real figure is lower.',
  },
  // https://lucy.swri.edu/MainBeltDensity.html (3–4% of the Moon; Dawn-based 2.1e21 kg)
  // https://arxiv.org/abs/1811.05191 (4.008e-4 Earth masses ≈ 2.4e21 kg)
  // https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=1&phys-par=1 (Ceres GM → 9.38e20 kg = 39–45% of the belt)
  {
    id: 'asteroid-belt-less-than-4-percent-of-moon',
    chapter: 'solar',
    subject: 'asteroid-belt',
    title: 'The whole belt: under 4% of a Moon',
    body: 'Add up every main-belt asteroid and you get only about 3–4% of our Moon’s mass. The dwarf planet Ceres alone holds a third to two-fifths of that.',
    stat: { value: 4, prefix: '< ', suffix: '%', label: 'Whole belt, as a share of the Moon’s mass' },
    sourceIds: ['lucy-belt', 'pitjeva-2018', 'jpl-sbdb-ceres'],
  },
  // https://lucy.swri.edu/MainBeltDensity.html ("a few × 10^5 km" between >1 km asteroids; no avoidance burns)
  // https://nssdc.gsfc.nasa.gov/planetary/factsheet/ (Earth–Moon 0.384 × 10^6 km)
  {
    id: 'asteroid-belt-no-dodging',
    chapter: 'solar',
    subject: 'asteroid-belt',
    title: 'No dodging required',
    body: 'Asteroids bigger than 1 km sit, on average, a few hundred thousand kilometres apart, roughly the Earth–Moon distance. The Lucy probe, bound for Jupiter’s Trojan asteroids, never has to swerve to avoid one.',
    sourceIds: ['lucy-belt', 'nssdc-planetary'],
  },

  /* --------------------------------------------------------------- 05 EDGE */

  // https://pmc.ncbi.nlm.nih.gov/articles/PMC8092584/ (V1: 25 Aug 2012, 121.6 au; V2: 5 Nov 2018, 119.0 au)
  // https://www.jpl.nasa.gov/news/nasas-voyager-2-probe-enters-interstellar-space/ (heliopause definition)
  {
    id: 'heliopause-crossings',
    chapter: 'edge',
    subject: 'heliopause',
    title: 'Crossed twice, six years apart',
    body: 'The solar wind’s bubble ends at the heliopause. Voyager 1 crossed it in 2012 at 121.6 au (one au is the Earth–Sun distance), Voyager 2 in 2018 at 119 au.',
    stat: { value: 121.6, decimals: 1, suffix: ' au', label: 'Voyager 1 at the heliopause' },
    sourceIds: ['pnas-voyager', 'jpl-voyager2-interstellar'],
    caveat: 'Crossing the heliopause means entering interstellar space, not leaving the solar system. The Oort Cloud lies far beyond.',
  },
  // https://spaceplace.nasa.gov/all-about-the-sun/en/ (8 min 20 s)
  // https://ssd.jpl.nasa.gov/astro_par.html (au/c = 499.004783836 s)
  // https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/ (18 Nov 2026, 25.902 billion km)
  // https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/ (25,902,068,356 km)
  {
    id: 'voyager1-one-light-day',
    chapter: 'edge',
    subject: 'voyager-1',
    title: 'A full light-day from home',
    body: 'Sunlight reaches us in about 8 minutes 20 seconds. On 18 November 2026, Voyager 1 reaches one light-day from Earth, 25.9 billion km, the first human-made object that far.',
    stat: { value: 24, suffix: ' hours', label: 'One-way radio delay to Voyager 1, Nov 2026' },
    sourceIds: ['spaceplace-sun', 'jpl-astro-par', 'nasa-voyager-where', 'nasa-voyager-lightday'],
    caveat: 'Crossing at 10:16:07 UTC (02:16:07 PST) by NASA’s geometric distance.',
  },
  // https://science.nasa.gov/solar-system/oort-cloud/facts/ (inner 2,000–5,000 au; outer 10,000–100,000 au; ~30,000 years to exit)
  // https://science.nasa.gov/resource/oort-cloud-and-scale-of-the-solar-system-infographic/ (inner edge could be as close as 1,000 au)
  {
    id: 'oort-cloud-extent-and-voyager-timeline',
    chapter: 'edge',
    subject: 'oort-cloud',
    title: 'A comet cloud nobody has seen',
    body: 'Up to trillions of icy bodies may circle 2,000 to 100,000 au out, in a cloud no one has seen directly. Voyager 1 needs centuries to reach it and maybe 30,000 years to exit.',
    stat: { value: 30000, prefix: '~', suffix: ' years', label: 'Until Voyager 1 leaves the Oort Cloud' },
    sourceIds: ['nasa-oort-facts', 'nasa-oort-infographic'],
    caveat: 'Inferred from long-period comets, never imaged. Estimates of the inner edge range from about 1,000 to 5,000 au.',
  },

  /* ------------------------------------------------------- 06 INTERSTELLAR */

  // https://imagine.gsfc.nasa.gov/features/cosmic/nearest_star_info.html (over 73,000 years)
  // https://simbad.cds.unistra.fr/simbad/sim-id?Ident=Proxima+Centauri (parallax 768.0665 mas → 4.2465 ly)
  // JPL Horizons (Voyager 1 at 16.92 km/s on 2026-09-25), URL in SOURCES['jpl-horizons-v1']
  {
    id: 'voyager-to-proxima-travel-time',
    chapter: 'interstellar',
    subject: 'voyager-1',
    title: 'Next star, 73,000-plus years out',
    body: 'Proxima Centauri, the Sun’s nearest neighbour, is about 4.25 light-years away. At Voyager 1’s roughly 17 km/s, the trip would take more than 73,000 years.',
    stat: { value: 73000, prefix: '> ', suffix: ' years', label: 'To Proxima at Voyager speed' },
    sourceIds: ['nasa-imagine-nearest', 'simbad-proxima', 'jpl-horizons-v1'],
    caveat: 'Voyager 1 is not actually heading there. At today’s 16.9 km/s the trip would be closer to 75,000 years.',
  },
  // https://www.eso.org/public/news/eso1629/ (11.2 days; ~7 million km; habitable zone)
  // https://arxiv.org/abs/2507.21751 (minimum mass 1.055 ± 0.055 Earth masses)
  // https://science.nasa.gov/exoplanets/other-stars-other-worlds/our-nearest-celestial-neighbor-an-exotic-3-star-system/ (flares)
  {
    id: 'proxima-b-habitable-zone',
    chapter: 'interstellar',
    subject: 'proxima-b',
    title: 'Next door, a planet that might hold water',
    body: 'Proxima b, at least roughly Earth’s mass, orbits its dim red star every 11.2 days. For a star that faint, that tight orbit sits in the habitable zone, where liquid water could exist.',
    stat: { value: 11.2, decimals: 1, suffix: ' days', label: 'A year on Proxima b' },
    sourceIds: ['eso-proxima-b', 'nirps-2025', 'nasa-3star'],
    caveat: 'Habitable zone is not the same as habitable: the star’s frequent flares may strip atmospheres.',
  },
  // https://aasnova.org/2025/03/11/confirmed-at-last-barnards-star-hosts-four-tiny-planets/
  {
    id: 'barnards-star-four-planets',
    chapter: 'interstellar',
    subject: 'barnards-star',
    title: 'Four small planets, confirmed in 2025',
    body: 'Barnard’s Star, the nearest single star at about 6 light-years, has four confirmed planets with minimum masses of just 19–34% of Earth’s. Their years last 2.3 to 6.7 days.',
    stat: { value: 4, label: 'Planets around Barnard’s Star' },
    sourceIds: ['aasnova-barnard', 'simbad-tap'],
    caveat: 'None orbits in the star’s habitable zone.',
  },

  /* --------------------------------------------------------- 07 MILKY WAY */

  // https://science.nasa.gov/sun/facts/ (~230 million years)
  // https://imagine.gsfc.nasa.gov/science/featured_science/milkyway/ (250 million years)
  // https://arxiv.org/pdf/2112.07478 + https://arxiv.org/abs/1910.03357 (R0 and speed imply ~203–222 Myr)
  // https://www.nhm.ac.uk/discover/where-did-dinosaurs-come-from.html (earliest dinosaurs ~230 Ma; dominance after 201 Ma)
  // https://news.mit.edu/2020/study-timing-dinosaurs-evolution-0729 (Ischigualasto 230–221 Ma)
  {
    id: 'galactic-year-dinosaurs',
    chapter: 'milkyway',
    subject: 'galactic year',
    title: 'One lap ago, dinosaurs weren’t in charge',
    body: 'The Sun needs about 230 million years to circle the galaxy once; estimates run from about 200 to 250 million. One lap ago, dinosaurs had not yet taken over.',
    stat: { value: 230, prefix: '~', suffix: ' million years', label: 'One lap around the galaxy' },
    sourceIds: ['nasa-sun-facts', 'nasa-imagine-mw', 'gravity-2022', 'reid-2019', 'nhm-dinos', 'mit-dinos-2020'],
    caveat: 'At about 230 million years ago the earliest dinosaurs had only just appeared; they came to dominate after the extinction 201 million years ago. “One lap” means the same angle around the centre, not the same neighbourhood.',
  },
  // https://arxiv.org/abs/1804.03064 (disk stars at R > 26 kpc at 99.7%, > 31 kpc at 95.4%)
  // https://www.iac.es/en/outreach/news/disc-milky-way-bigger-we-thought (~200,000 ly diameter)
  // https://science.nasa.gov/universe/exoplanets/our-milky-way-galaxy-how-big-is-space/ (~100,000 ly)
  {
    id: 'milky-way-disk-extent',
    chapter: 'milkyway',
    subject: 'disk size',
    title: '100,000 light-years across. Or double that.',
    body: 'The Milky Way is usually called 100,000 light-years wide. A 2018 study found signs of disk stars about 100,000 light-years from the centre, which would make it roughly twice that.',
    stat: { value: 200000, prefix: '~', suffix: ' ly', label: 'Possible width of the star disk' },
    sourceIds: ['nasa-mw-size', 'lopez-corredoira-2018', 'iac-disc'],
    caveat: 'Statistical evidence at 95.4% confidence. The galaxy has no sharp edge; star density just fades.',
  },
  // https://arxiv.org/pdf/2112.07478 (M = 4.297 million solar masses; R0 = 8,277 pc ≈ 27,000 ly)
  // https://arxiv.org/abs/2409.12261 (2024 refit: 4.2996 million)
  // https://www.eso.org/public/news/eso2208-eht-mw/ (doughnut on the Moon; ~27,000 ly)
  {
    id: 'sgr-a-star-doughnut',
    chapter: 'milkyway',
    subject: 'Sagittarius A*',
    title: 'Our black hole, a doughnut on the Moon',
    body: 'Sagittarius A*, our galaxy’s central black hole, has about 4.3 million times the Sun’s mass. From 27,000 light-years away, it looks about as big as a doughnut on the Moon.',
    stat: { value: 4.3, decimals: 1, suffix: ' million Suns', label: 'Mass of Sagittarius A*' },
    sourceIds: ['gravity-2022', 'gravity-2024', 'eso-sgra'],
    caveat: 'Its first image was released on 12 May 2022.',
  },

  /* ------------------------------------------------------------ 08 BEYOND */

  // https://science.nasa.gov/image-article/apod-2021-june-25-andromeda-in-a-single-shot/ (2.5 Mly; most distant object easily seen)
  // https://science.nasa.gov/solar-system/skywatching/night-sky-network/catch-andromeda-rising/ (light left when ancestors figured out stone tools)
  // https://humanorigins.si.edu/evidence/human-fossils/species/homo-sapiens (~300,000 years)
  // https://humanorigins.si.edu/evidence/behavior/stone-tools (toolmaking by at least 2.6 million years ago)
  {
    id: 'andromeda-old-light',
    chapter: 'beyond',
    subject: 'Andromeda’s light and human evolution',
    title: 'Light older than our species',
    body: 'Andromeda, about 2.5 million light-years away, is the farthest thing you can easily see with the naked eye. Its light left before our species existed, when our ancestors were getting the hang of stone tools.',
    stat: { value: 2.5, decimals: 1, suffix: ' million years', label: 'Age of the Andromeda light you see' },
    sourceIds: ['apod-andromeda', 'nasa-nsn-andromeda', 'si-homo-sapiens', 'si-stone-tools'],
    caveat: 'Homo sapiens is about 300,000 years old, so the light is roughly eight times older than our species.',
  },
  // https://science.nasa.gov/missions/hubble/nasas-hubble-shows-milky-way-is-destined-for-head-on-collision-with-andromeda-galaxy (~250,000 mph; Moon in an hour)
  // https://science.nasa.gov/missions/hubble/apocalypse-when-hubble-casts-doubt-on-certainty-of-galactic-collision/ (~2% head-on in 4–5 Gyr)
  {
    id: 'andromeda-approach-speed',
    chapter: 'beyond',
    subject: 'Andromeda approach speed',
    title: 'Closing in at 110 km/s',
    body: 'Andromeda is approaching at about 110 km/s, fast enough to cross the Earth–Moon gap in an hour. Even so, a head-on crash in the next 4–5 billion years has only about a 2% chance.',
    stat: { value: 110, prefix: '~', suffix: ' km/s', label: 'Andromeda’s approach speed' },
    sourceIds: ['nasa-andromeda-2012', 'nasa-sawala-2025'],
  },
  // https://science.nasa.gov/missions/hubble/apocalypse-when-hubble-casts-doubt-on-certainty-of-galactic-collision/ (~50–50 within 10 Gyr)
  // https://arxiv.org/abs/2603.22863 + https://iopscience.iop.org/article/10.3847/2041-8213/ae5799 (90%; 2σ range 64.7–100%)
  {
    id: 'milky-way-andromeda-merger-odds',
    chapter: 'beyond',
    subject: 'Milky Way–Andromeda future',
    title: 'Merger odds: somewhere from 50% to 90%',
    body: 'A 2025 study put a Milky Way–Andromeda merger within 10 billion years at roughly 50–50. A 2026 reanalysis with updated motion measurements raised it to about 90%.',
    stat: { value: 90, prefix: '50–', suffix: '%', label: 'Chance of merging within 10 billion years' },
    sourceIds: ['nasa-sawala-2025', 'wu-2026', 'wu-2026-iop'],
    caveat: 'Both hinge on Andromeda’s tiny sideways motion, which is not yet measured precisely enough to settle it.',
  },
];

/* ===================================================================== planets */

export const PLANETS: PlanetInfo[] = [
  // Physical data: https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html
  // Fact: https://science.nasa.gov/mercury/facts/ (176-day solar day; ~430 °C highs)
  {
    id: 'mercury',
    name: 'Mercury',
    tagline: 'Two years per day',
    fact: 'Mercury spins once every 58.6 Earth days, but it races around the Sun so fast that sunrise to sunrise takes 176 days. That’s two full Mercury years.',
    radiusKm: 2439.7,
    semiMajorAxisAU: 0.3871,
    distanceFromSunMkm: 57.909,
    siderealRotationHours: 1407.6,
    dayLength: '176 Earth days',
    yearLength: '88 Earth days',
    axialTiltDeg: 0.034,
    moons: 0,
    moonsAsOf: 'September 2026',
    sourceIds: ['nssdc-mercury', 'nasa-mercury-facts'],
    more: ['Daytime highs reach about 430 °C, and it still isn’t the hottest planet.'],
  },
  // Physical data: https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html (-5,832.6 h sidereal; 2,802 h solar day; 737 K; 92 bar)
  // Facts: https://science.nasa.gov/venus/venus-facts/ ; https://science.nasa.gov/mercury/facts/
  {
    id: 'venus',
    name: 'Venus',
    tagline: 'Spins slower than it orbits',
    fact: 'Venus spins backwards, and one turn takes 243 Earth days, longer than its 225-day year. From the surface, the Sun would rise in the west.',
    radiusKm: 6051.8,
    semiMajorAxisAU: 0.7233,
    distanceFromSunMkm: 108.21,
    siderealRotationHours: -5832.6,
    dayLength: '117 Earth days, sunrise to sunrise',
    yearLength: '225 Earth days',
    axialTiltDeg: 177.36,
    moons: 0,
    moonsAsOf: 'September 2026',
    sourceIds: ['nssdc-venus', 'nasa-venus-facts', 'nasa-mercury-facts'],
    more: ['At about 464 °C on average, it beats Mercury’s daytime peak, thanks to a thick carbon dioxide atmosphere pressing down at more than 90 times Earth’s sea-level pressure.'],
  },
  // Physical data: https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  // Density: https://nssdc.gsfc.nasa.gov/planetary/factsheet/ (Earth 5,514; Mercury 5,429; Jupiter 1,326; Saturn 687 kg/m³)
  // Moon recession: https://www.nasa.gov/missions/laser-beams-reflected-between-earth-and-moon-boost-science/
  {
    id: 'earth',
    name: 'Earth',
    tagline: 'The densest planet',
    fact: 'At about 5,500 kg per cubic metre, Earth is the densest planet, edging out metal-rich Mercury. It’s roughly four times as dense as Jupiter and eight times Saturn.',
    radiusKm: 6371.0,
    semiMajorAxisAU: 1.0,
    distanceFromSunMkm: 149.598,
    siderealRotationHours: 23.9345,
    dayLength: '24 hours',
    yearLength: '365.26 days',
    axialTiltDeg: 23.44,
    moons: 1,
    moonsAsOf: 'September 2026',
    sourceIds: ['nssdc-earth', 'nssdc-planetary', 'nasa-llr', 'nssdc-moon'],
    more: ['The Moon drifts about 3.8 cm farther away each year, roughly as fast as fingernails grow.'],
  },
  // Physical data: https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html
  // Sunsets: https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/
  // Olympus Mons: https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/At_the_foot_of_the_Red_Planet_s_giant_volcano
  // Everest 8,848.86 m: https://www.nature.com/articles/d41586-020-03502-y
  {
    id: 'mars',
    name: 'Mars',
    tagline: 'Blue sunsets on a red planet',
    fact: 'On Mars, the glow around the setting Sun is bluish. Fine dust lets blue light through a little more easily, while the rest of the sky stays yellow to orange.',
    radiusKm: 3389.5,
    semiMajorAxisAU: 1.5238,
    distanceFromSunMkm: 227.956,
    siderealRotationHours: 24.6229,
    dayLength: '24 h 40 min',
    yearLength: '687 Earth days',
    axialTiltDeg: 25.19,
    moons: 2,
    moonsAsOf: 'September 2026',
    sourceIds: ['nssdc-mars', 'nasa-mars-sunset', 'esa-olympus', 'nature-everest'],
    more: ['Olympus Mons rises about 22 km above the surrounding plains, roughly two and a half Everests.'],
  },
  // Physical data: https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html (1,898.13 × 10^24 kg; 9.925 h)
  // Mass ratio: https://nssdc.gsfc.nasa.gov/planetary/factsheet/ (other seven sum to 768.6 × 10^24 kg → 2.47×)
  // https://science.nasa.gov/jupiter/jupiter-facts/
  // Great Red Spot: https://science.nasa.gov/missions/hubble/nasas-hubble-shows-jupiters-great-red-spot-is-smaller-than-ever-measured/
  //                 https://science.nasa.gov/missions/hubble/nasas-hubble-watches-jupiters-great-red-spot-behave-like-a-stress-ball/
  // Moons (115): https://science.nasa.gov/jupiter/jupiter-moons/ ; https://ssd.jpl.nasa.gov/sats/discovery.html
  {
    id: 'jupiter',
    name: 'Jupiter',
    tagline: 'Outweighs all the others combined',
    fact: 'Jupiter has about 2.5 times the mass of all the other planets put together. It also spins fastest: a day lasts under 10 hours.',
    radiusKm: 69911,
    semiMajorAxisAU: 5.2038,
    distanceFromSunMkm: 778.479,
    siderealRotationHours: 9.925,
    dayLength: '9 h 56 min',
    yearLength: '11.9 Earth years',
    axialTiltDeg: 3.13,
    moons: 115,
    moonsAsOf: 'September 2026 (last additions April 2026)',
    sourceIds: ['nssdc-jupiter', 'nssdc-planetary', 'nasa-jupiter-facts', 'nasa-grs-2014', 'nasa-grs-2024', 'nasa-jupiter-moons', 'jpl-sats'],
    more: ['Its Great Red Spot is shrinking: up to about 41,000 km long in the late 1800s, about 16,500 km in 2014. That’s still wider than Earth.'],
  },
  // Physical data: https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html (687 kg/m³)
  // Rotation 10 h 33 min 38 s (Cassini ring seismology): https://www.jpl.nasa.gov/news/scientists-finally-know-what-time-it-is-on-saturn/
  // Moons (293): https://science.nasa.gov/saturn/moons/ ; https://ssd.jpl.nasa.gov/sats/discovery.html ; https://minorplanetcenter.net/mpec/K26/K26M19.html
  // Rings + density: https://science.nasa.gov/saturn/facts/
  {
    id: 'saturn',
    name: 'Saturn',
    tagline: '293 moons and counting',
    fact: 'Saturn has 293 recognised moons, more than every other planet combined. The latest, announced in June 2026, is a moonlet inside the B ring spotted in 2009 Cassini images.',
    radiusKm: 58232,
    semiMajorAxisAU: 9.5726,
    distanceFromSunMkm: 1432.041,
    siderealRotationHours: 10.5606,
    dayLength: '10 h 34 min',
    yearLength: '29.4 Earth years',
    axialTiltDeg: 26.73,
    moons: 293,
    moonsAsOf: 'September 2026 (last addition 17 June 2026)',
    sourceIds: ['nssdc-saturn', 'jpl-saturn-day', 'nasa-saturn-moons', 'jpl-sats', 'mpc-2026-m19', 'nasa-saturn-facts'],
    more: [
      'Its rings reach up to 282,000 km from the planet, but the main rings are typically about 10 m thick. Scaled to paper thickness, they would reach about 2.8 km.',
      'It’s the only planet less dense than water, at about 69% of water’s density.',
    ],
  },
  // Physical data: https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html ; tilt also https://science.nasa.gov/uranus/facts/
  // 42 years of darkness: https://esahubble.org/images/heic2303f/
  // Rotation 17 h 14 min 52 s (2025): https://esahubble.org/news/heic2503/
  // Moons (29): https://science.nasa.gov/uranus/moons/ ; https://ssd.jpl.nasa.gov/sats/discovery.html
  {
    id: 'uranus',
    name: 'Uranus',
    tagline: 'Rolls around the Sun on its side',
    fact: 'Tipped over by about 98°, Uranus rolls around the Sun on its side. Across its 84-year orbit, parts of each hemisphere get up to 42 years of unbroken darkness.',
    radiusKm: 25362,
    semiMajorAxisAU: 19.165,
    distanceFromSunMkm: 2867.043,
    siderealRotationHours: -17.2478,
    dayLength: '17 h 15 min',
    yearLength: '84 Earth years',
    axialTiltDeg: 97.77,
    moons: 29,
    moonsAsOf: 'September 2026 (last addition August 2025)',
    sourceIds: ['nssdc-uranus', 'nasa-uranus-facts', 'esahubble-uranus-seasons', 'esahubble-uranus-day', 'nasa-uranus-moons', 'jpl-sats'],
    more: ['In 2025, more than a decade of aurora-watching pinned its day at 17 h 14 min 52 s, 28 seconds longer than the old estimate.'],
  },
  // Physical data: https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html (irradiance 1.508 W/m²; sidereal period 60,189 d)
  // Earth irradiance 1,361 W/m²: https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  // Winds + 2011 orbit: https://science.nasa.gov/neptune/neptune-facts/
  // Moons (16): https://science.nasa.gov/neptune/moons/ ; https://ssd.jpl.nasa.gov/sats/discovery.html
  {
    id: 'neptune',
    name: 'Neptune',
    tagline: 'Dim sunlight, wild winds',
    fact: 'Neptune gets about 1/900 of Earth’s sunlight, yet its winds whip clouds of frozen methane along at more than 2,000 km/h.',
    radiusKm: 24622,
    semiMajorAxisAU: 30.1806,
    distanceFromSunMkm: 4514.953,
    siderealRotationHours: 16.11,
    dayLength: '16 h 7 min',
    yearLength: '164.8 Earth years',
    axialTiltDeg: 28.32,
    moons: 16,
    moonsAsOf: 'September 2026 (last additions February 2024)',
    sourceIds: ['nssdc-neptune', 'nssdc-earth', 'nasa-neptune-facts', 'nasa-neptune-moons', 'jpl-sats'],
    more: ['It finished its first full orbit since its 1846 discovery only in 2011. The next lap ends around 2176.'],
  },
];

/* ============================================================== nearby stars */

/**
 * Some of our nearest neighbours, not a strict "N nearest" list: Ross 248, Ross 128,
 * Procyon, 61 Cygni, Epsilon Indi and others are omitted, as are the brown dwarfs
 * Luhman 16 (6.50 ly) and WISE 0855−0714 (7.43 ly).
 * Coordinates: ICRS J2000 from SIMBAD. Distances: 3,261.564 / parallax (mas).
 */
export const NEARBY_STARS: NearbyStar[] = [
  // https://simbad.cds.unistra.fr/simbad/sim-id?Ident=Proxima+Centauri (768.0665 mas → 4.2465 ly; M5.5Ve)
  // https://www.eso.org/public/news/eso1629/ ; https://arxiv.org/abs/2507.21751 (Proxima b 1.055 M⊕ min; Proxima d confirmed)
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri',
    distanceLy: 4.2465,
    raDeg: 217.42894,
    decDeg: -62.67949,
    spectralType: 'M5.5Ve',
    color: '#ffa35c',
    note: 'The nearest known star: a red-dwarf flare star too faint to see without a telescope. Hosts Proxima b, in the habitable zone, and the smaller Proxima d.',
    sourceIds: ['simbad-proxima', 'eso-proxima-b', 'nirps-2025', 'nasa-3star'],
  },
  // https://iopscience.iop.org/article/10.3847/1538-3881/abfaff (750.81 ± 0.38 mas → 4.344 ly)
  // https://science.nasa.gov/exoplanets/other-stars-other-worlds/our-nearest-celestial-neighbor-an-exotic-3-star-system/ (80-year A–B orbit)
  // https://science.nasa.gov/missions/webb/nasas-webb-finds-new-evidence-for-planet-around-closest-solar-twin/ (candidate planet)
  {
    id: 'alpha-centauri-a',
    name: 'Alpha Centauri A',
    distanceLy: 4.344,
    raDeg: 219.90206,
    decDeg: -60.83399,
    spectralType: 'G2V',
    color: '#fff4e8',
    note: 'A Sun-like star. It and B orbit each other every ~80 years. A possible Saturn-mass planet spotted in 2024 infrared images still awaits confirmation.',
    sourceIds: ['akeson-2021', 'nasa-3star', 'nasa-webb-alphacen', 'simbad-tap'],
  },
  // https://iopscience.iop.org/article/10.3847/1538-3881/abfaff
  {
    id: 'alpha-centauri-b',
    name: 'Alpha Centauri B',
    distanceLy: 4.344,
    raDeg: 219.8961,
    decDeg: -60.83753,
    spectralType: 'K1V',
    color: '#ffe0bc',
    note: 'Orange-dwarf partner of Alpha Centauri A. To the naked eye, the pair looks like one bright point.',
    sourceIds: ['akeson-2021', 'nasa-3star', 'simbad-tap'],
  },
  // https://simbad.cds.unistra.fr/simbad/sim-tap/sync (546.9759 mas → 5.963 ly; proper motion ~10.4″/yr)
  // https://aasnova.org/2025/03/11/confirmed-at-last-barnards-star-hosts-four-tiny-planets/
  {
    id: 'barnards-star',
    name: 'Barnard’s Star',
    distanceLy: 5.963,
    raDeg: 269.45208,
    decDeg: 4.69336,
    spectralType: 'M4V',
    color: '#ffb56e',
    note: 'The nearest single star and the fastest-moving across our sky, about 10.4 arcseconds a year. Four small planets confirmed in 2025.',
    sourceIds: ['simbad-tap', 'aasnova-barnard'],
  },
  // https://simbad.cds.unistra.fr/simbad/sim-tap/sync
  {
    id: 'wolf-359',
    name: 'Wolf 359',
    distanceLy: 7.856,
    raDeg: 164.1205,
    decDeg: 7.01472,
    spectralType: 'M6V',
    color: '#ffa35c',
    note: 'A very faint, very low-mass red dwarf.',
    sourceIds: ['simbad-tap'],
  },
  // https://simbad.cds.unistra.fr/simbad/sim-tap/sync
  {
    id: 'lalande-21185',
    name: 'Lalande 21185',
    distanceLy: 8.304,
    raDeg: 165.83415,
    decDeg: 35.96988,
    spectralType: 'M2V',
    color: '#ffbd80',
    note: 'A red dwarf just too faint for the naked eye.',
    sourceIds: ['simbad-tap'],
  },
  // https://simbad.cds.unistra.fr/simbad/sim-tap/sync (Hipparcos 379.21 mas → 8.60 ly; Gaia DR3 for Sirius B gives ~8.71 ly)
  {
    id: 'sirius',
    name: 'Sirius A',
    distanceLy: 8.6,
    raDeg: 101.28716,
    decDeg: -16.71612,
    spectralType: 'A1V',
    color: '#cad7ff',
    note: 'The brightest star in the night sky, with a white-dwarf companion, Sirius B.',
    sourceIds: ['simbad-tap'],
  },
  // https://simbad.cds.unistra.fr/simbad/sim-tap/sync (Gaia DR3 parallax of UV Ceti, 373.84 mas → 8.72 ly)
  {
    id: 'luyten-726-8',
    name: 'Luyten 726-8 (BL + UV Ceti)',
    distanceLy: 8.72,
    raDeg: 24.75574,
    decDeg: -17.95072,
    spectralType: 'M5.5V + M6V',
    color: '#ffa35c',
    note: 'A close pair of red-dwarf flare stars. UV Ceti gave a whole class of flare stars its name.',
    sourceIds: ['simbad-tap'],
  },
  // https://simbad.cds.unistra.fr/simbad/sim-tap/sync
  {
    id: 'ross-154',
    name: 'Ross 154',
    distanceLy: 9.706,
    raDeg: 282.45568,
    decDeg: -23.83624,
    spectralType: 'M3.5Ve',
    color: '#ffb56e',
    note: 'A red-dwarf flare star in Sagittarius.',
    sourceIds: ['simbad-tap'],
  },
  // https://simbad.cds.unistra.fr/simbad/sim-tap/sync
  {
    id: 'epsilon-eridani',
    name: 'Epsilon Eridani',
    distanceLy: 10.502,
    raDeg: 53.23269,
    decDeg: -9.45826,
    spectralType: 'K2V',
    color: '#ffd9b0',
    note: 'A nearby orange dwarf you can see without a telescope.',
    sourceIds: ['simbad-tap'],
  },
  // https://simbad.cds.unistra.fr/simbad/sim-tap/sync
  {
    id: 'tau-ceti',
    name: 'Tau Ceti',
    distanceLy: 11.912,
    raDeg: 26.01701,
    decDeg: -15.93748,
    spectralType: 'G8V',
    color: '#ffedd8',
    note: 'A solitary Sun-like star you can see without a telescope.',
    sourceIds: ['simbad-tap'],
  },
];

/* ================================================================ atmosphere */

/**
 * Bands for the ascent HUD. Boundaries are approximate and move with latitude,
 * season and solar activity; sources disagree by a few km (NASA Science gives
 * ~12/50/80/700 km, UCAR ~10/50/85 km with a 500–1,000 km thermosphere top).
 * Sources: https://www.nasa.gov/image-article/earths-atmospheric-layers-3/
 *          https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/
 *          https://scied.ucar.edu/learning-zone/atmosphere/layers-earths-atmosphere
 */
export const ATMOSPHERE: AtmosphereLayer[] = [
  // Average top ~12 km (NASA Science); 8–14.5 km range (NASA layers graphic)
  { name: 'Troposphere', fromKm: 0, toKm: 12, note: 'Weather happens here. The top ranges from about 8 to 14.5 km.', sourceIds: ['nasa-atmos-cake', 'nasa-atmos-layers'] },
  // Top ~50 km; ozone peak ~32 km: https://ozonewatch.gsfc.nasa.gov/facts/SH.html ; warms with height: https://csl.noaa.gov/assessments/ozone/2022/twentyquestions/
  { name: 'Stratosphere', fromKm: 12, toKm: 50, note: 'Home of the ozone layer. It gets warmer as you climb.', sourceIds: ['nasa-atmos-layers', 'nasa-ozonewatch', 'noaa-ozone-20q'] },
  // Top ~85 km (NASA layers graphic; NASA Science says 80 km)
  { name: 'Mesosphere', fromKm: 50, toKm: 85, note: 'Most meteors burn up here.', sourceIds: ['nasa-atmos-layers', 'nasa-atmos-cake'] },
  // Thermosphere continues to ~600 km (NASA layers graphic); HUD band stops at the Kármán line
  { name: 'Thermosphere', fromKm: 85, toKm: 100, layerTopKm: 600, note: 'Keeps going to about 600 km. The space station orbits inside it.', sourceIds: ['nasa-atmos-layers', 'nasa-atmos-cake'] },
  // Kármán line 100 km: https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/
  // Upper bound = faint hydrogen geocorona traced to ~630,000 km: https://www.esa.int/Science_Exploration/Space_Science/Earth_s_atmosphere_stretches_out_to_the_Moon_and_beyond
  {
    name: 'Beyond the Kármán line',
    fromKm: 100,
    toKm: 630_000,
    note: 'Space, by the usual definition. Thermosphere to ~600 km, then exosphere; its faintest hydrogen reaches past the Moon.',
    sourceIds: ['nasa-atmos-cake', 'nasa-atmos-layers', 'esa-geocorona'],
  },
];

export const ATMOSPHERE_MARKERS: AltitudeMarker[] = [
  // https://ozonewatch.gsfc.nasa.gov/facts/SH.html
  { name: 'Ozone peak', km: 32, sourceIds: ['nasa-ozonewatch'] },
  // https://arxiv.org/abs/1807.07894
  { name: 'Proposed edge of space (2018)', km: 80, sourceIds: ['mcdowell-2018'] },
  // https://www.nesdis.noaa.gov/news/peeling-back-the-layers-of-the-atmosphere (50 statute miles)
  { name: 'US astronaut threshold', km: 80.47, sourceIds: ['noaa-nesdis-layers'] },
  // https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/
  { name: 'Kármán line', km: 100, sourceIds: ['nasa-atmos-cake'] },
  // https://www.nasa.gov/blogs/spacestation/2025/11/19/station-orbiting-higher-as-exercise-research-and-maintenance-continue/ (≈412–427 km)
  { name: 'Space station', km: 420, sourceIds: ['nasa-iss-altitude-2025'] },
  // https://www.nasa.gov/image-article/earths-atmospheric-layers-3/ (NASA convention; other definitions go higher)
  { name: 'Top of the exosphere (by one convention)', km: 10_000, sourceIds: ['nasa-atmos-layers', 'ucar-layers'] },
];

/* =================================================================== numbers */

export const NUMBERS = {
  dataAsOf: '2026-09-25',

  /* ---------------------------------------------------------- T-minus / Earth */
  escapeVelocityKmS: 11.186, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  escapeVelocityKmH: 40_270, // 11.186 × 3,600; https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  equatorSpinKmH: 1_675, // https://spaceplace.nasa.gov/launch-windows/en/
  equatorSpinMS: 465, // 2π × 6,378.137 km / 23.9345 h; https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  kourouLaunchBoostMS: 460, // https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/About_the_launch
  earthRadiusKm: 6_371.0, // mean; https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  earthEquatorialRadiusKm: 6_378.137, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  earthPolarRadiusKm: 6_356.752, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  earthAxialTiltDeg: 23.44, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  earthSiderealDayHours: 23.9345, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html

  /* -------------------------------------------------------- Ascent / atmosphere */
  tropopauseKm: 12, // average; https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/
  tropopauseRangeKm: [8, 14.5], // https://www.nasa.gov/image-article/earths-atmospheric-layers-3/
  stratopauseKm: 50, // https://www.nasa.gov/image-article/earths-atmospheric-layers-3/
  mesopauseKm: 85, // https://www.nasa.gov/image-article/earths-atmospheric-layers-3/
  thermosphereTopKm: 600, // https://www.nasa.gov/image-article/earths-atmospheric-layers-3/
  exosphereTopKm: 10_000, // NASA convention; https://www.nasa.gov/image-article/earths-atmospheric-layers-3/
  geocoronaKm: 630_000, // https://www.esa.int/Science_Exploration/Space_Science/Earth_s_atmosphere_stretches_out_to_the_Moon_and_beyond
  ozonePeakKm: 32, // https://ozonewatch.gsfc.nasa.gov/facts/SH.html
  ozoneInStratospherePct: 90, // https://csl.noaa.gov/assessments/ozone/2022/twentyquestions/
  ozoneColumnMm: 3, // https://csl.noaa.gov/assessments/ozone/2022/twentyquestions/
  karmanLineKm: 100, // https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/
  atmosphereBelowKarmanPct: 99.99997, // https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/
  proposedEdgeOfSpaceKm: 80, // https://arxiv.org/abs/1807.07894
  usAstronautThresholdKm: 80.47, // 50 statute miles; https://www.nesdis.noaa.gov/news/peeling-back-the-layers-of-the-atmosphere
  karmanShareOfEarthRadiusPct: 1.6, // 100 / 6,371; https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html

  /* ------------------------------------------------------------ Orbit / Moon */
  leoSpeedKmS: 7.7, // https://www.esa.int/Enabling_Support/Operations/The_wizards_of_orbits
  issAltitudeKm: 420, // ≈412–427 km after Nov 2025 reboost; https://www.nasa.gov/blogs/spacestation/2025/11/19/station-orbiting-higher-as-exercise-research-and-maintenance-continue/
  issOrbitPeriodMin: 92, // https://www.esa.int/Enabling_Support/Operations/The_wizards_of_orbits (JSC: 90–93 min, https://eol.jsc.nasa.gov/Tools/orbitTutorial.htm)
  issOrbitsPerDay: 15.5, // 15.5–15.9; https://eol.jsc.nasa.gov/Tools/orbitTutorial.htm
  moonRadiusKm: 1_737.4, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
  earthMoonKm: 384_400, // semi-major axis; https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
  earthMoonPerigeeKm: 363_300, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
  earthMoonApogeeKm: 405_500, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
  moonRecessionCmPerYear: 3.8, // https://www.nasa.gov/missions/laser-beams-reflected-between-earth-and-moon-boost-science/
  lightSecondsEarthMoon: 1.28, // 384,400 km / c; "about 1.3 light-seconds": https://www.grc.nasa.gov/www/k-12/Numbers/Math/Mathematical_Thinking/seeing_the_earth_moon.htm
  artemis2MaxDistanceKm: 406_771, // 252,756 mi; https://www.nasa.gov/blogs/missions/2026/04/06/artemis-ii-flight-day-6-crew-wraps-historic-lunar-flyby/
  artemis2ClosestApproachKm: 6_545, // 4,067 mi above the surface; same source
  apollo13RecordKm: 400_171, // 248,655 mi; same source
  planetsSumEquatorialDiametersKm: 387_941, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/
  planetsSumPolarDiametersKm: 364_797, // polar radii from each NSSDC planet sheet (e.g. https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html)
  planetsGapAtMeanKm: 376_292, // 384,400 − 6,371 − 1,737.4; https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
  planetsGapAtApogeeKm: 397_392, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
  planetsGapAtPerigeeKm: 355_192, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html

  /* ------------------------------------------------------------ Solar system */
  auKm: 149_597_870.7, // IAU 2012; https://ssd.jpl.nasa.gov/astro_par.html
  lightSecondsSunEarth: 499.005, // au / c; https://ssd.jpl.nasa.gov/astro_par.html
  lightMinutesSunEarth: 8.3167, // https://ssd.jpl.nasa.gov/astro_par.html ("8 min 20 s": https://spaceplace.nasa.gov/all-about-the-sun/en/)
  lightSecondsSunEarthRange: [490.7, 507.3], // perihelion/aphelion; https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
  sunRadiusKm: 695_700, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
  sunMassKg: 1.9884e30, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
  sunMassEarths: 332_900, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
  sunMassSharePct: 99.8, // https://science.nasa.gov/sun/facts/
  planetsMassSharePct: 0.134, // sum of planet masses; https://nssdc.gsfc.nasa.gov/planetary/factsheet/
  sunMassToEnergyKgPerS: 4.26e9, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
  sunLuminosityW: 3.828e26, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
  sunEffectiveTempK: 5_772, // https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
  asteroidBeltInnerAU: 2.1, // https://lucy.swri.edu/MainBeltDensity.html
  asteroidBeltOuterAU: 3.2, // https://lucy.swri.edu/MainBeltDensity.html
  asteroidBeltMassKg: 2.1e21, // Dawn-based; https://lucy.swri.edu/MainBeltDensity.html (≈2.4e21: https://arxiv.org/abs/1811.05191)
  asteroidBeltMoonMassPctRange: [3, 4], // https://lucy.swri.edu/MainBeltDensity.html
  asteroidsOver1kmRange: [700_000, 1_900_000], // https://lucy.swri.edu/MainBeltDensity.html
  asteroidsOver10km: 10_000, // https://lucy.swri.edu/MainBeltDensity.html
  saturnRingExtentKm: 282_000, // https://science.nasa.gov/saturn/facts/
  saturnMainRingThicknessM: 10, // https://science.nasa.gov/saturn/facts/

  /* ----------------------------------------------------------------- The edge */
  voyagerAsOf: '2026-09-25', // JPL Horizons, predicted trajectory Voyager_1_ST+refit2022_m
  voyager1DistanceKm: 25_709_679_538, // from the Sun; https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='-31'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='2026-09-25'&STOP_TIME='2026-09-26'&STEP_SIZE='1d'&QUANTITIES='19,20'&RANGE_UNITS='KM'&CAL_FORMAT='CAL'
  voyager1DistanceAU: 171.86, // same Horizons query
  voyager1FromEarthKm: 25_741_461_321, // same Horizons query
  voyager1OneWayLightHours: 23.85, // same Horizons query
  voyager1SpeedKmS: 16.9, // 16.92 km/s heliocentric; same Horizons query as voyager1DistanceKm
  voyager1RaDeg: 258.96, // heliocentric direction, J2000; same Horizons source
  voyager1DecDeg: 12.22, // same Horizons source
  voyager1LightDayUtc: '2026-11-18T10:16:07Z', // https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/
  voyager1LightDayKm: 25_902_068_356, // NASA's figure; https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/
  voyager1InstrumentsOn: 2, // magnetometer + plasma waves; https://science.nasa.gov/blogs/voyager/2026/04/17/nasa-shuts-off-instrument-on-voyager-1-to-keep-spacecraft-operating/
  voyager1HeliopauseAU: 121.6, // https://pmc.ncbi.nlm.nih.gov/articles/PMC8092584/
  voyager1HeliopauseDate: '2012-08-25', // https://pmc.ncbi.nlm.nih.gov/articles/PMC8092584/
  voyager2HeliopauseAU: 119.0, // https://pmc.ncbi.nlm.nih.gov/articles/PMC8092584/
  voyager2HeliopauseDate: '2018-11-05', // https://pmc.ncbi.nlm.nih.gov/articles/PMC8092584/
  oortInnerAU: 2_000, // inner edge 2,000–5,000 au; https://science.nasa.gov/solar-system/oort-cloud/facts/
  oortInnerAUMax: 5_000, // https://science.nasa.gov/solar-system/oort-cloud/facts/
  oortOuterAUMin: 10_000, // outer edge 10,000–100,000 au; https://science.nasa.gov/solar-system/oort-cloud/facts/
  oortOuterAU: 100_000, // https://science.nasa.gov/solar-system/oort-cloud/facts/
  voyager1YearsToExitOort: 30_000, // "maybe 30,000 years"; https://science.nasa.gov/solar-system/oort-cloud/facts/

  /* ------------------------------------------------------------- Interstellar */
  lightYearKm: 9_460_730_472_580.8, // https://iauarchive.eso.org/public/themes/measuring/
  lightYearAU: 63_241, // https://iauarchive.eso.org/public/themes/measuring/
  lightDayKm: 25_902_068_371.2, // exact c × 86,400 s; c from https://ssd.jpl.nasa.gov/astro_par.html
  proximaLy: 4.2465, // 768.0665 mas; https://simbad.cds.unistra.fr/simbad/sim-id?Ident=Proxima+Centauri
  alphaCenLy: 4.344, // 750.81 mas; https://iopscience.iop.org/article/10.3847/1538-3881/abfaff
  barnardsStarLy: 5.963, // 546.9759 mas; https://simbad.cds.unistra.fr/simbad/sim-tap/sync
  proximaBPeriodDays: 11.2, // https://www.eso.org/public/news/eso1629/
  proximaBOrbitMkm: 7, // https://www.eso.org/public/news/eso1629/
  proximaBMinMassEarths: 1.055, // https://arxiv.org/abs/2507.21751
  voyagerToProximaYears: 73_000, // "over 73,000 years"; https://imagine.gsfc.nasa.gov/features/cosmic/nearest_star_info.html

  /* ----------------------------------------------------------------- Milky Way */
  mwStarsLow: 100_000_000_000, // https://science.nasa.gov/universe/exoplanets/our-milky-way-galaxy-how-big-is-space/
  mwStarsHigh: 400_000_000_000, // https://science.nasa.gov/universe/exoplanets/our-milky-way-galaxy-how-big-is-space/
  mwDiameterLy: 100_000, // conventional; https://science.nasa.gov/universe/exoplanets/our-milky-way-galaxy-how-big-is-space/
  mwDiskExtendedDiameterLy: 200_000, // https://www.iac.es/en/outreach/news/disc-milky-way-bigger-we-thought (https://arxiv.org/abs/1804.03064)
  sunToCenterLy: 27_000, // 8,277 pc; https://arxiv.org/pdf/2112.07478 (also https://www.eso.org/public/news/eso2208-eht-mw/)
  sunToCenterKpc: 8.277, // https://arxiv.org/pdf/2112.07478
  galacticYearMyr: 230, // https://science.nasa.gov/sun/facts/
  galacticYearRangeMyr: [200, 250], // 250: https://imagine.gsfc.nasa.gov/science/featured_science/milkyway/ ; ~203–222 from R0 and speed
  sunSpeedKmS: 247, // Θ0 + V☉ = 247 ± 4 km/s; https://arxiv.org/abs/1910.03357
  sunCircularSpeedKmS: 236, // Θ0 = 236 ± 7 km/s; https://arxiv.org/abs/1910.03357
  sgrAMassSolar: 4_297_000, // https://arxiv.org/pdf/2112.07478 (2024 refit 4.2996e6: https://arxiv.org/abs/2409.12261)

  /* -------------------------------------------------------------------- Beyond */
  andromedaDistanceLy: 2_500_000, // https://science.nasa.gov/image-article/apod-2021-june-25-andromeda-in-a-single-shot/
  andromedaStars: 1_000_000_000_000, // estimate; https://science.nasa.gov/solar-system/skywatching/night-sky-network/catch-andromeda-rising/
  andromedaApproachKmS: 110, // ~250,000 mph; https://science.nasa.gov/missions/hubble/nasas-hubble-shows-milky-way-is-destined-for-head-on-collision-with-andromeda-galaxy
  mergeOdds10Gyr: 50, // percent, Sawala et al. 2025; https://science.nasa.gov/missions/hubble/apocalypse-when-hubble-casts-doubt-on-certainty-of-galactic-collision/
  mergeOdds10GyrLatest: 90, // percent, Wu et al. 2026; https://arxiv.org/abs/2603.22863
  mergeOdds10GyrLatestRange: [64.7, 100], // 2σ range; https://arxiv.org/abs/2603.22863
  mergeMedianGyrLatest: 6.5, // https://arxiv.org/abs/2603.22863
  mergeOdds5Gyr: 2, // percent chance of a head-on collision within 4–5 Gyr; https://science.nasa.gov/missions/hubble/apocalypse-when-hubble-casts-doubt-on-certainty-of-galactic-collision/
  localGroupMembers: 100, // lower bound ("more than 100"), our sum of ≥65 MW dwarfs (https://arxiv.org/html/2411.07424v1) + 36 M31 satellites (https://esahubble.org/images/opo2509/)
  localGroupDiameterLy: 10_000_000, // "nearly 10 million"; https://imagine.gsfc.nasa.gov/features/cosmic/local_group_info.html
  mwDwarfGalaxiesMin: 65, // https://arxiv.org/html/2411.07424v1
  andromedaSatellitesStudied: 36, // https://esahubble.org/images/opo2509/
} as const;

/* ================================================================== caveats */

/** Honest small print the site can surface (e.g. in a sources drawer). */
export const CAVEATS: Caveat[] = [
  {
    id: 'layers-approximate',
    text: 'Atmospheric layer heights are approximate and shift with latitude, season and solar activity.',
    sourceIds: ['nasa-atmos-layers', 'nasa-atmos-cake', 'ucar-layers'],
  },
  {
    id: 'moon-counts',
    text: 'Moon counts change often. Figures are as of September 2026; some official fact sheets still show older totals.',
    sourceIds: ['jpl-sats', 'nasa-saturn-moons', 'nasa-jupiter-moons', 'nasa-uranus-moons', 'nasa-neptune-moons'],
  },
  {
    id: 'voyager-live',
    text: 'Voyager distances are for 25 September 2026 from a predicted trajectory. The Earth–Voyager distance even shrinks for a few months each year as Earth swings toward it.',
    sourceIds: ['jpl-horizons-v1', 'jpl-horizons-v1-2026', 'nasa-voyager-where'],
  },
  {
    id: 'voyager-power',
    text: 'Voyager 1 runs two science instruments as of April 2026. Engineers are trying power-saving fixes that could extend both probes.',
    sourceIds: ['nasa-voyager1-lecp', 'nasa-voyager2-power'],
  },
  {
    id: 'oort-unseen',
    text: 'The Oort Cloud has never been observed directly. Its edges are estimates.',
    sourceIds: ['nasa-oort-facts', 'nasa-oort-infographic'],
  },
  {
    id: 'nearby-stars-partial',
    text: 'The star field shows some of our nearest neighbours, not a complete list.',
    sourceIds: ['simbad-tap'],
  },
  {
    id: 'galactic-year-range',
    text: 'The Sun’s orbit around the galaxy is often quoted as 230 million years, but estimates run from about 200 to 250 million.',
    sourceIds: ['nasa-sun-facts', 'nasa-imagine-mw', 'reid-2019', 'gravity-2022'],
  },
  {
    id: 'spiral-arms',
    text: 'The Milky Way’s arm layout is still debated; the Sun sits near a small arm called the Orion Spur.',
    sourceIds: ['jpl-spiral-arms'],
  },
  {
    id: 'merger-open',
    text: 'Whether the Milky Way and Andromeda merge is still an open question; published odds range from about 50% to 90% within 10 billion years.',
    sourceIds: ['nasa-sawala-2025', 'wu-2026'],
  },
  {
    id: 'local-group-count',
    text: 'The Local Group’s “more than 100 galaxies” is a running count, and surveys keep finding faint dwarfs.',
    sourceIds: ['pace-2025', 'esahubble-opo2509', 'nasa-imagine-local-group'],
  },
  {
    id: 'andromeda-stars',
    text: 'Andromeda’s trillion stars is an estimate; the largest Hubble mosaic resolves more than 200 million of them.',
    sourceIds: ['nasa-m31-mosaic-2025', 'nasa-nsn-andromeda'],
  },
];
