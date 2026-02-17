import importedPositionData from "./importedPositionData.json";
import curatedPositionTemplates from "./curatedPositionTemplates.json";
import type { PositionDifficulty, PositionDocumentationSource, PositionEntry } from "../types";

type ImportedMappingConfidence = "exact" | "alias" | "keyword" | "unmapped" | "manual";

interface ImportedRowSource {
  sourceName?: string;
  sourceUrl?: string;
  license?: string;
  attribution?: string;
}

interface ImportedReferenceRow {
  externalId?: string;
  externalName?: string;
  aliases?: string[];
  mappedPositionId?: string | null;
  mappingConfidence?: ImportedMappingConfidence;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  source?: ImportedRowSource;
}

interface ImportedPayload {
  rows?: ImportedReferenceRow[];
}

export type ImportedPostureFamily =
  | "side-lying"
  | "seated"
  | "standing"
  | "quadruped"
  | "top-led"
  | "oral-support"
  | "supine-support";

export interface ImportedPositionSourceProvenance {
  sourceName: string;
  sourceUrl: string;
  license: string;
  attribution: string;
}

export interface ImportedPositionSourceEntry {
  positionId: string;
  displayName: string;
  aliases: string[];
  provenance: ImportedPositionSourceProvenance[];
  externalId: string;
  externalName: string;
}

export interface ImportedPositionExternalReference {
  externalId: string;
  externalName: string;
  imageUrl: string;
  imageAlt?: string;
  sourceName: string;
  sourceUrl: string;
  license: string;
  attribution: string;
  mappedPositionId: string;
  mappingConfidence: ImportedMappingConfidence;
}

export type ImportedIllustrationKeyHint =
  | "side-lying-spooning"
  | "side-lying-face-to-face"
  | "seated-face-to-face"
  | "seated-reverse"
  | "reclined-supported"
  | "supine-supported"
  | "edge-supported"
  | "chair-supported"
  | "quadruped-supported"
  | "standing-wall-supported"
  | "standing-counter-supported"
  | "top-forward-supported"
  | "top-backward-supported"
  | "top-sideways-supported"
  | "rest-reset";

export interface ImportedIllustrationHint {
  key: ImportedIllustrationKeyHint;
  caption: string;
  mechanicsFocus: string[];
}

export interface ImportedSearchProfileHint {
  primaryTerm: string;
  secondaryTerms: string[];
}

interface ImportedCatalogEntry {
  position: PositionEntry;
  sourceEntry: ImportedPositionSourceEntry;
  postureFamily: ImportedPostureFamily;
  signals: RowSignals;
  mappedTemplateId: string;
  externalReference: ImportedPositionExternalReference | null;
  searchProfile: ImportedSearchProfileHint;
}

const SOURCES: Record<string, PositionDocumentationSource> = {
  mayoPainfulIntercourse: {
    label: "Mayo Clinic: Painful intercourse",
    url: "https://www.mayoclinic.org/symptoms/painful-intercourse/basics/definition/sym-20050639",
  },
  aafpDyspareunia2021: {
    label: "AAFP: Dyspareunia in Women (2021)",
    url: "https://www.aafp.org/pubs/afp/issues/2021/0515/p597.html",
  },
  clevelandEndometriosis: {
    label: "Cleveland Clinic: Best sex positions for endometriosis",
    url: "https://health.clevelandclinic.org/best-sex-positions-for-endometriosis",
  },
  pubmedSexDisabilityFramework2024: {
    label: "PubMed: Sexual disability in low back pain framework (2024)",
    url: "https://pubmed.ncbi.nlm.nih.gov/38200986/",
  },
  pubmedMaleBiomech2014: {
    label: "PubMed: Male coital spine biomechanics (2014)",
    url: "https://pubmed.ncbi.nlm.nih.gov/25208042/",
  },
  pubmedFemaleBiomech2014: {
    label: "PubMed: Female coital spine biomechanics (2014)",
    url: "https://pubmed.ncbi.nlm.nih.gov/24562134/",
  },
  pubmedPelvicFloorRehab2019: {
    label: "PubMed: Pelvic floor rehabilitation and female sexual function (2019)",
    url: "https://pubmed.ncbi.nlm.nih.gov/31286158/",
  },
  pubmedPelvicFloorDysfunction2023: {
    label: "PubMed: Sexual function with pelvic floor dysfunction (2023)",
    url: "https://pubmed.ncbi.nlm.nih.gov/37727447/",
  },
  nhsPainDuringSex: {
    label: "NHS: Pain during sex",
    url: "https://www.nhs.uk/conditions/pain-during-sex/",
  },
};

const EDITORIAL_PROVENANCE: ImportedPositionSourceProvenance = {
  sourceName: "NutriCompass imported position normalization",
  sourceUrl: "https://github.com/panos/nutrient-recommendation-app",
  license: "Project repository license",
  attribution: "NutriCompass contributors",
};

const DEFAULT_EXTERNAL_SOURCE: ImportedPositionSourceProvenance = {
  sourceName: "random-sex-position",
  sourceUrl: "https://github.com/raminr77/random-sex-position",
  license: "MIT (repo); verify upstream image rights",
  attribution: "Ramin Rezaei / random-sex-position contributors",
};

const LIVE_SITE_SOURCE: ImportedRowSource = {
  sourceName: "sexpositions.club",
  sourceUrl: "https://sexpositions.club/positions",
  license: "Website content, verify reuse rights before redistribution",
  attribution: "sexpositions.club",
};

const MANUAL_SITE_ROWS: ImportedReferenceRow[] = [
  {
    externalId: "site-row-518",
    externalName: "Fireman",
    description: "Sex position #518 - Fireman (on the chair). (anal sex, doggy style, from behind, rear entry, standing).",
    source: LIVE_SITE_SOURCE,
  },
  {
    externalId: "site-row-517",
    externalName: "Woven rose",
    description: "Sex position #517 - Woven rose (on the bed). (right angle, standing).",
    source: LIVE_SITE_SOURCE,
  },
  {
    externalId: "site-row-516",
    externalName: "Pussy licking",
    description: "Sex position #516 - Pussy licking (on the sofa). (oral sex, cunnilingus, lying down).",
    source: LIVE_SITE_SOURCE,
  },
  {
    externalId: "site-row-515",
    externalName: "Crazy train",
    description: "Sex position #515 - Crazy train (on the couch). (anal sex, doggy style, from behind, rear entry).",
    source: LIVE_SITE_SOURCE,
  },
];

type CuratedTemplateEntry = Omit<PositionEntry, "id" | "name">;

const curatedTemplateById: Record<string, CuratedTemplateEntry> = Object.fromEntries(
  Object.entries(curatedPositionTemplates as Record<string, PositionEntry>).map(([id, value]) => [
    id,
    {
      inspirationTags: value.inspirationTags,
      comfortTags: value.comfortTags,
      setup: value.setup,
      alignmentCues: value.alignmentCues,
      comfortCues: value.comfortCues,
      modifications: value.modifications,
      difficulty: value.difficulty,
      contraindications: value.contraindications,
      documentationSources: value.documentationSources,
    },
  ]),
);

const curatedTemplateNameById: Record<string, string> = Object.fromEntries(
  Object.entries(curatedPositionTemplates as Record<string, PositionEntry>).map(([id, value]) => [
    id,
    value.name,
  ]),
);

const curatedTemplateIds = new Set(Object.keys(curatedTemplateById));

const SEVERITY_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bexplicit sex\b/gi, "intimate activity"],
  [/\bgraphic sex\b/gi, "intimate activity"],
  [/\bpornographic\b/gi, "adult material"],
  [/\bporn\b/gi, "adult material"],
  [/\borgazm\w*\b/gi, "high-intensity"],
  [/\borgasm\w*\b/gi, "high-intensity"],
  [/\bpenetration\b/gi, "direct contact"],
  [/\bgenital\w*\b/gi, "sensitive-area"],
  [/\bnude\b/gi, "minimal-clothing"],
  [/\bpussy\b/gi, "sensual"],
  [/\bdick\b/gi, "partner-led"],
  [/\bfuck\w*\b/gi, "intense"],
];

const NAME_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bpussy\b/gi, "sensual"],
  [/\bdick\b/gi, "partner-led"],
  [/\bfuck\w*\b/gi, "intense"],
  [/\bslave\b/gi, "support"],
  [/\bpunch\b/gi, "dynamic"],
];

const HIGH_RISK_NAME_TERMS: RegExp[] = [/\bincest\b/i, /\brape\b/i, /\bviolen\w*\b/i];

const compactWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

const sanitizeText = (value: string): string => {
  let next = value;
  for (const [pattern, replacement] of SEVERITY_REPLACEMENTS) {
    next = next.replace(pattern, replacement);
  }
  return compactWhitespace(next);
};

const normalize = (value: string): string =>
  sanitizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const dedupe = (values: string[]): string[] => Array.from(new Set(values.map((value) => compactWhitespace(value)).filter(Boolean)));

const toTitleCase = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

const isAllLowercase = (value: string): boolean => value === value.toLowerCase();

const sanitizeName = (value: string, index: number): string => {
  const fallback = `Comfort Variation ${String(index + 1).padStart(3, "0")}`;
  if (!value.trim()) return fallback;

  if (HIGH_RISK_NAME_TERMS.some((pattern) => pattern.test(value))) return fallback;

  let sanitized = sanitizeText(value);
  for (const [pattern, replacement] of NAME_REPLACEMENTS) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  sanitized = compactWhitespace(sanitized);
  if (!sanitized) return fallback;
  return isAllLowercase(sanitized) ? toTitleCase(sanitized) : sanitized;
};

const slugify = (value: string): string =>
  normalize(value)
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

const extractNumber = (externalId: string, index: number): string => {
  const match = externalId.match(/(\d+)/);
  if (match?.[1]) return match[1].padStart(3, "0");
  return String(index + 1).padStart(3, "0");
};

const tokenizeRow = (row: ImportedReferenceRow): string[] => {
  const rawTokens: string[] = [];
  const description = sanitizeText(row.description ?? "");

  for (const group of description.matchAll(/\(([^)]+)\)/g)) {
    const value = group[1];
    rawTokens.push(...value.split(","));
  }

  if (row.externalName) rawTokens.push(row.externalName);
  if (row.imageAlt) rawTokens.push(row.imageAlt);
  if (Array.isArray(row.aliases)) rawTokens.push(...row.aliases);

  return dedupe(rawTokens.map((token) => normalize(token)).filter(Boolean));
};

const includesAnyTerm = (combinedText: string, terms: string[]): boolean =>
  terms.some((term) => combinedText.includes(normalize(term)));

const inferPostureFamily = (tokens: string[]): ImportedPostureFamily => {
  const combined = tokens.join(" ");

  if (includesAnyTerm(combined, ["spooning", "sideways", "side lying", "side-lying", "side by side"])) {
    return "side-lying";
  }

  if (
    includesAnyTerm(combined, [
      "doggy",
      "all fours",
      "rear entry",
      "from behind",
      "wheelbarrow",
      "kneeling",
    ])
  ) {
    return "quadruped";
  }

  if (includesAnyTerm(combined, ["cowgirl", "woman on top", "girl on top", "reverse cowgirl", "straddle"])) {
    return "top-led";
  }

  if (includesAnyTerm(combined, ["oral sex", "blowjob", "cunnilingus", "69 sex position"])) {
    return "oral-support";
  }

  if (includesAnyTerm(combined, ["standing", "wall", "counter"])) {
    return "standing";
  }

  if (includesAnyTerm(combined, ["chair", "seated", "sitting", "lotus"])) {
    return "seated";
  }

  return "supine-support";
};

const curatedFallbackByPosture: Record<ImportedPostureFamily, string> = {
  "side-lying": "side-lying-support",
  seated: "chair-supported-neutral",
  standing: "supported-standing-wall-shift",
  quadruped: "quadruped-supported-a",
  "top-led": "top-facing-forward-supported",
  "oral-support": "chair-supported-neutral",
  "supine-support": "missionary-supported-pelvis-elevated",
};

const inferMappedCuratedTemplateId = (
  row: ImportedReferenceRow,
  tokens: string[],
  posture: ImportedPostureFamily,
): string => {
  const directMappedId = compactWhitespace(row.mappedPositionId ?? "");
  if (curatedTemplateIds.has(directMappedId)) return directMappedId;

  const combined = tokens.join(" ");
  const has = (...terms: string[]): boolean => includesAnyTerm(combined, terms);

  if (has("aftercare", "recovery", "cuddle")) return "intimacy-rest-reset";

  if (has("reverse cowgirl", "backwards cowgirl", "top facing backward")) {
    return "top-facing-backward-supported";
  }

  if (has("sideways cowgirl", "bent cowgirl", "asian cowgirl", "side cowgirl")) {
    return "top-sideways-supported";
  }

  if (has("cowgirl", "woman on top", "girl on top", "straddle", "rider", "tantra chair")) {
    return "top-facing-forward-supported";
  }

  if (has("coital alignment technique", "cat position", "coital alignment")) {
    return "coital-alignment-technique-supported";
  }

  if (has("missionary")) {
    if (has("low extension")) return "missionary-low-extension-a";
    if (has("paced")) return "missionary-low-extension-b";
    return "missionary-supported-pelvis-elevated";
  }

  if (has("spooning", "spoon", "side lying", "side-lying")) {
    if (has("face to face")) return "side-lying-face-to-face-variation";
    if (has("knee support", "knee supported")) return "knee-supported-side-angle";
    return "side-lying-support";
  }

  if (has("lotus")) {
    if (has("reclined", "semi reclined")) return "semi-reclined-lotus-support";
    return "seated-face-to-face";
  }

  if (has("reverse seated", "seated facing away")) return "reverse-facing-seated-support";
  if (has("seated face to face", "face to face seated")) return "seated-face-to-face";
  if (has("reclined", "pillows", "pillow supported")) return "reclined-pillows";
  if (has("edge of bed", "bed edge", "on the edge")) return "edge-of-bed-assisted";
  if (has("counter")) return "counter-height-forearm-supported";
  if (has("bridge")) return "hip-neutral-pillow-bridge";

  if (has("chair")) {
    if (has("face to face")) return "seated-face-to-face";
    return "chair-supported-neutral";
  }

  if (
    has(
      "doggy style",
      "all fours",
      "rear entry",
      "from behind",
      "wheelbarrow",
      "kneeling",
    )
  ) {
    if (has("elevated", "wedge", "counter", "on the edge", "edge")) {
      return "quadruped-supported-b";
    }
    return "quadruped-supported-a";
  }

  if (has("standing", "wall")) return "supported-standing-wall-shift";
  if (has("standing")) return "supported-standing-wall-shift";
  if (has("oral sex", "blowjob", "cunnilingus", "69 sex position")) return "chair-supported-neutral";

  return curatedFallbackByPosture[posture];
};

type SurfaceSignal = "bed" | "chair" | "couch" | "wall" | "counter" | "floor" | "unknown";
type OrientationSignal =
  | "standing"
  | "seated"
  | "side-lying"
  | "supine"
  | "prone"
  | "kneeling"
  | "quadruped";
type InteractionSignal = "face-to-face" | "from-behind" | "reverse" | "sideways" | "right-angle" | "criss-cross";

interface RowSignals {
  surfaces: Set<SurfaceSignal>;
  orientations: Set<OrientationSignal>;
  interactions: Set<InteractionSignal>;
  hasOralContact: boolean;
  hasAnalContact: boolean;
  hasDynamicLoad: boolean;
  hasTopLedCue: boolean;
  hasEdgeCue: boolean;
}

const deriveRowSignals = (tokens: string[], posture: ImportedPostureFamily): RowSignals => {
  const combined = tokens.join(" ");
  const has = (...terms: string[]): boolean => includesAnyTerm(combined, terms);

  const surfaces = new Set<SurfaceSignal>();
  if (has("on the bed", "bed")) surfaces.add("bed");
  if (has("on the chair", "chair", "rocking chair")) surfaces.add("chair");
  if (has("on the couch", "on the sofa", "sofa", "couch")) surfaces.add("couch");
  if (has("wall")) surfaces.add("wall");
  if (has("counter")) surfaces.add("counter");
  if (has("on the floor", "floor")) surfaces.add("floor");
  if (surfaces.size === 0) surfaces.add("unknown");

  const orientations = new Set<OrientationSignal>();
  if (posture === "standing" || has("standing")) orientations.add("standing");
  if (posture === "seated" || has("seated", "sitting", "chair")) orientations.add("seated");
  if (posture === "side-lying" || has("spooning", "sideways", "side lying", "side-lying")) {
    orientations.add("side-lying");
  }
  if (posture === "quadruped" || has("doggy style", "all fours", "wheelbarrow")) orientations.add("quadruped");
  if (has("kneeling")) orientations.add("kneeling");
  if (has("face down")) orientations.add("prone");
  if (has("lying down", "face to face")) orientations.add("supine");
  if (orientations.size === 0) {
    if (posture === "oral-support") orientations.add("seated");
    else orientations.add("supine");
  }

  const interactions = new Set<InteractionSignal>();
  if (has("face to face")) interactions.add("face-to-face");
  if (has("from behind", "rear entry")) interactions.add("from-behind");
  if (has("reverse")) interactions.add("reverse");
  if (has("sideways")) interactions.add("sideways");
  if (has("right angle")) interactions.add("right-angle");
  if (has("criss cross")) interactions.add("criss-cross");

  return {
    surfaces,
    orientations,
    interactions,
    hasOralContact: has("oral sex", "blowjob", "cunnilingus", "69 sex position"),
    hasAnalContact: has("anal sex", "anal play"),
    hasDynamicLoad: has("wheelbarrow", "split", "one leg", "headstand", "acro", "twist"),
    hasTopLedCue: has("woman on top", "girl on top", "cowgirl"),
    hasEdgeCue: has("edge of bed", "bed edge", "on the edge"),
  };
};

const inferDifficulty = (posture: ImportedPostureFamily, tokens: string[]): PositionDifficulty => {
  const combined = tokens.join(" ");

  if (includesAnyTerm(combined, ["easy level"])) return "beginner";
  if (includesAnyTerm(combined, ["medium level", "intermediate level"])) return "intermediate";
  if (includesAnyTerm(combined, ["hard level"])) return "advanced";

  let score = 0;
  if (posture === "standing" || posture === "quadruped") score += 2;
  if (posture === "top-led") score += 1;
  if (posture === "oral-support" || posture === "side-lying" || posture === "supine-support") score -= 1;

  if (
    includesAnyTerm(combined, [
      "reverse",
      "wheelbarrow",
      "right angle",
      "split",
      "bridge",
      "one leg",
      "acro",
      "twist",
      "headstand",
    ])
  ) {
    score += 2;
  }

  if (includesAnyTerm(combined, ["kneeling", "from behind", "rear entry", "standing"])) score += 1;
  if (includesAnyTerm(combined, ["lying down", "face to face", "supported", "pillow", "on the bed"])) score -= 1;

  if (score <= 0) return "beginner";
  if (score <= 2) return "intermediate";
  return "advanced";
};

const difficultyRank: Record<PositionDifficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const elevateDifficulty = (
  baseDifficulty: PositionDifficulty,
  inferredDifficulty: PositionDifficulty,
): PositionDifficulty =>
  difficultyRank[inferredDifficulty] > difficultyRank[baseDifficulty] ? inferredDifficulty : baseDifficulty;

const baseComfortTagsByPosture: Record<ImportedPostureFamily, string[]> = {
  "side-lying": [
    "low-back-sensitive",
    "gentle-depth-control",
    "fatigue-aware",
    "communication-focused",
    "pelvic-floor-tension",
  ],
  seated: [
    "mobility-limited",
    "communication-focused",
    "low-back-sensitive",
    "gentle-depth-control",
    "fatigue-aware",
  ],
  standing: [
    "balance-support",
    "short-interval",
    "communication-focused",
    "low-back-sensitive",
    "gentle-depth-control",
  ],
  quadruped: [
    "low-back-sensitive",
    "balance-support",
    "short-interval",
    "gentle-depth-control",
    "communication-focused",
  ],
  "top-led": [
    "gentle-depth-control",
    "communication-focused",
    "pelvic-floor-tension",
    "low-back-sensitive",
    "fatigue-aware",
  ],
  "oral-support": [
    "communication-focused",
    "fatigue-aware",
    "mobility-limited",
    "gentle-depth-control",
    "short-interval",
  ],
  "supine-support": [
    "gentle-depth-control",
    "pelvic-floor-tension",
    "fatigue-aware",
    "low-back-sensitive",
    "communication-focused",
  ],
};

const prioritizeTag = (tags: string[], tag: string) => {
  const without = tags.filter((current) => current !== tag);
  tags.splice(0, tags.length, tag, ...without);
};

const inferComfortTags = (
  posture: ImportedPostureFamily,
  difficulty: PositionDifficulty,
  tokens: string[],
): string[] => {
  const tags = [...baseComfortTagsByPosture[posture]];
  const combined = tokens.join(" ");

  if (includesAnyTerm(combined, ["standing", "wall", "counter"])) prioritizeTag(tags, "balance-support");
  if (includesAnyTerm(combined, ["face to face"])) prioritizeTag(tags, "communication-focused");
  if (includesAnyTerm(combined, ["lying down", "bed"])) prioritizeTag(tags, "fatigue-aware");
  if (difficulty === "advanced") prioritizeTag(tags, "short-interval");
  if (difficulty === "beginner") prioritizeTag(tags, "gentle-depth-control");

  return dedupe(tags).slice(0, 3);
};

const inferInspirationTags = (
  posture: ImportedPostureFamily,
  difficulty: PositionDifficulty,
  externalName: string,
): string[] => {
  const postureLabel =
    posture === "side-lying"
      ? "side-lying variation"
      : posture === "seated"
        ? "seated variation"
        : posture === "standing"
          ? "standing supported variation"
          : posture === "quadruped"
            ? "quadruped variation"
            : posture === "top-led"
              ? "top-led variation"
              : posture === "oral-support"
                ? "communication-led variation"
                : "supported supine variation";

  return [
    "sexpositions club import",
    postureLabel,
    `${difficulty} pacing`,
    `based on ${sanitizeText(externalName)}`.toLowerCase(),
  ];
};

const inferCuratedInspirationTags = (
  templateId: string,
  externalName: string,
  template: CuratedTemplateEntry,
): string[] => {
  const templateName = curatedTemplateNameById[templateId] ?? templateId.replace(/-/g, " ");
  return dedupe([
    "sexpositions club curated import",
    ...template.inspirationTags.slice(0, 2),
    `style matched to ${sanitizeText(templateName).toLowerCase()}`,
    `based on ${sanitizeText(externalName)}`.toLowerCase(),
  ]).slice(0, 4);
};

const getSurfaceSetupCue = (signals: RowSignals): string => {
  if (signals.surfaces.has("chair")) {
    return "Use a stable chair with non-slip footing and nearby hand support.";
  }
  if (signals.surfaces.has("counter")) {
    return "Use a stable counter-height support with non-slip stance setup.";
  }
  if (signals.surfaces.has("wall")) {
    return "Use wall contact as a balance anchor before changing pace or angle.";
  }
  if (signals.surfaces.has("bed")) {
    return "Use a firm bed surface and keep pillows nearby for support changes.";
  }
  if (signals.surfaces.has("couch")) {
    return "Use a stable sofa or couch and avoid deep sink-in cushions.";
  }
  if (signals.surfaces.has("floor")) {
    return "Use padded floor support and keep joints cushioned before loading.";
  }
  return "Set up a stable surface with pillows and clear communication before starting.";
};

const getOrientationSetupCue = (signals: RowSignals): string => {
  if (signals.orientations.has("quadruped")) {
    return "Use forearm or hand support with cushioned knees and gradual range changes.";
  }
  if (signals.orientations.has("standing")) {
    return "Keep feet shoulder-width, knees soft, and at least one stable support point.";
  }
  if (signals.orientations.has("seated")) {
    return "Keep feet grounded and use back support to maintain neutral posture.";
  }
  if (signals.orientations.has("side-lying")) {
    return "Start side-lying with head and knee support to reduce rotational strain.";
  }
  if (signals.orientations.has("prone")) {
    return "Use chest and pelvic support to avoid excessive low-back extension.";
  }
  if (signals.orientations.has("supine")) {
    return "Use pillow support under knees or hips to keep alignment neutral.";
  }
  return "Begin with low-range pacing and steady breathing before progression.";
};

const getAlignmentCuePrimary = (signals: RowSignals): string => {
  if (signals.orientations.has("quadruped")) return "Maintain neutral lumbar curve and avoid abrupt extension.";
  if (signals.orientations.has("standing")) return "Keep rib cage stacked over pelvis and avoid locked knees.";
  if (signals.orientations.has("seated")) return "Maintain tall seated alignment with even hip loading.";
  if (signals.orientations.has("side-lying")) return "Keep shoulders and hips aligned without forced twisting.";
  if (signals.orientations.has("prone")) return "Keep neck neutral and avoid end-range lumbar arching.";
  return "Keep pelvis and trunk supported in a neutral line.";
};

const getAlignmentCueSecondary = (signals: RowSignals): string => {
  if (signals.interactions.has("right-angle")) return "Limit end-range angles and keep transitions deliberate.";
  if (signals.interactions.has("reverse")) return "Use small rotational changes and reset to neutral often.";
  if (signals.interactions.has("from-behind")) return "Use arm or forearm support to avoid trunk collapse.";
  if (signals.interactions.has("face-to-face")) return "Keep shoulders relaxed and synchronize breathing.";
  if (signals.interactions.has("criss-cross")) return "Avoid forced knee rotation and keep hips in mid-range.";
  return "Use small range adjustments before any pace increase.";
};

const getComfortCuePrimary = (signals: RowSignals, difficulty: PositionDifficulty): string => {
  if (difficulty === "advanced" || signals.hasDynamicLoad) {
    return "Use short rounds with planned recovery pauses and check-ins.";
  }
  if (signals.orientations.has("standing")) {
    return "Run frequent balance and fatigue check-ins every one to two minutes.";
  }
  if (signals.hasOralContact) {
    return "Pause regularly for jaw, neck, and shoulder comfort resets.";
  }
  return "Use verbal comfort ratings before each pace or angle change.";
};

const getComfortCueSecondary = (signals: RowSignals): string => {
  if (signals.orientations.has("quadruped")) return "Monitor low-back response and reduce range if strain rises.";
  if (signals.orientations.has("side-lying")) return "Adjust knee spacing to reduce pelvic or hip pressure.";
  if (signals.orientations.has("seated")) return "Reset posture when trunk fatigue or hip strain appears.";
  if (signals.orientations.has("standing")) return "Switch to seated support early if balance confidence drops.";
  return "Pause and reset as soon as discomfort trends upward.";
};

const getModificationPrimary = (signals: RowSignals): string => {
  if (signals.orientations.has("quadruped")) return "Raise torso support height to reduce lumbar extension load.";
  if (signals.orientations.has("standing")) return "Move closer to wall or chair support to lower balance demand.";
  if (signals.orientations.has("side-lying")) return "Place a pillow between knees to reduce hip and SI strain.";
  if (signals.orientations.has("seated")) return "Add a lumbar roll or backrest to maintain neutral trunk posture.";
  return "Increase support points before increasing range or pace.";
};

const getModificationSecondary = (signals: RowSignals): string => {
  if (signals.interactions.has("right-angle")) return "Lower the angle and shorten range if pressure increases.";
  if (signals.orientations.has("kneeling")) return "Use extra knee padding or switch to seated support variation.";
  if (signals.hasOralContact) return "Switch to side-lying or seated support if neck effort builds.";
  if (signals.surfaces.has("couch")) return "Move to a firmer surface if deep cushion sink affects alignment.";
  return "Shorten intervals and add rest resets between movement blocks.";
};

const getContraindicationPrimary = (signals: RowSignals): string => {
  if (signals.orientations.has("standing")) return "Current dizziness or balance instability without support";
  if (signals.orientations.has("quadruped")) return "Acute wrist or knee pain under load";
  if (signals.orientations.has("kneeling")) return "Acute knee pain with loaded flexion";
  if (signals.hasOralContact) return "Acute neck or jaw pain with sustained effort";
  return "Current severe pelvic pain without symptom-guided support adjustments";
};

const getContraindicationSecondary = (signals: RowSignals): string => {
  if (signals.interactions.has("right-angle") || signals.hasDynamicLoad) {
    return "Extension-sensitive low-back flare or current radicular symptoms";
  }
  if (signals.hasTopLedCue) return "Acute hip impingement symptoms with loaded range";
  if (signals.interactions.has("from-behind")) return "Current low-back instability flare";
  return "Persistent pain that does not improve with support and range reduction";
};

interface PositionGuidanceTemplate {
  setup: [string, string];
  alignmentCues: [string, string];
  comfortCues: [string, string];
  modifications: [string, string];
  contraindications: [string, string];
}

const buildGuidanceTemplate = (
  posture: ImportedPostureFamily,
  difficulty: PositionDifficulty,
  signals: RowSignals,
): PositionGuidanceTemplate => {
  const surfaceCue = getSurfaceSetupCue(signals);

  const byPosture: Record<ImportedPostureFamily, PositionGuidanceTemplate> = {
    "side-lying": {
      setup: [surfaceCue, "Begin in side-lying alignment with hips stacked and movement kept gradual."],
      alignmentCues: [
        "Keep shoulders and hips aligned to avoid rotational strain.",
        "Adjust pillow height to keep neck relaxed.",
      ],
      comfortCues: [
        "Pause often for comfort and consent check-ins.",
        "Reduce range immediately if pressure or pull sensations rise.",
      ],
      modifications: [
        "Place a folded blanket between knees for joint comfort.",
        "Switch to face-to-face side-lying if trunk rotation feels easier.",
      ],
      contraindications: [
        "Acute shoulder compression pain",
        "Current lateral hip flare without support adjustments",
      ],
    },
    seated: {
      setup: [surfaceCue, "Use upright seated posture with grounded feet and optional back support."],
      alignmentCues: [
        "Maintain rib-to-pelvis stacking and relaxed shoulders.",
        "Keep both partners close to a neutral spine position.",
      ],
      comfortCues: [
        "Use short check-ins before each pace or angle change.",
        "Reset posture when back fatigue starts to build.",
      ],
      modifications: [
        "Add a cushion under hips to reduce hip flexion load.",
        "Use a wall or headboard for extra trunk support.",
      ],
      contraindications: [
        "Acute coccyx pain with seated loading",
        "Current dizziness when upright",
      ],
    },
    standing: {
      setup: [surfaceCue, "Stand near a wall or stable support and keep knees soft."],
      alignmentCues: [
        "Keep pelvis neutral and avoid lumbar over-arching.",
        "Distribute weight evenly across both feet.",
      ],
      comfortCues: [
        "Use short intervals with frequent rest resets.",
        "Stop and transition to seated support if balance drops.",
      ],
      modifications: [
        "Use a nearby chair for transition support.",
        "Reduce duration and range to maintain breathing control.",
      ],
      contraindications: [
        "Current balance instability without support",
        "Acute ankle, knee, or hip flare during weight-bearing",
      ],
    },
    quadruped: {
      setup: [surfaceCue, "Use hand, forearm, or pillow support to keep trunk loading controlled."],
      alignmentCues: [
        "Maintain a neutral lower-back curve with gradual transitions.",
        "Keep knees cushioned and avoid abrupt range shifts.",
      ],
      comfortCues: [
        "Run one-minute comfort check-ins to track tension.",
        "Switch position quickly if low-back strain increases.",
      ],
      modifications: [
        "Raise upper-body support height to reduce extension load.",
        "Shorten active rounds and add recovery pauses.",
      ],
      contraindications: [
        "Acute wrist or knee pain under load",
        "Current extension-sensitive low-back flare",
      ],
    },
    "top-led": {
      setup: [surfaceCue, "Use a supported base and let the leading partner control pace and angle."],
      alignmentCues: [
        "Keep trunk stacked with stable hand support available.",
        "Avoid abrupt rotation or high-amplitude transitions.",
      ],
      comfortCues: [
        "Use verbal comfort ratings each minute.",
        "Reduce movement amplitude when pressure increases.",
      ],
      modifications: [
        "Add side bolsters to reduce balance demand.",
        "Increase recline support to lower joint load.",
      ],
      contraindications: [
        "Acute knee pain in loaded flexion",
        "Current severe pelvic pain without clinician guidance",
      ],
    },
    "oral-support": {
      setup: [surfaceCue, "Use seated or side-lying support that keeps neck and shoulders relaxed."],
      alignmentCues: [
        "Keep cervical posture neutral and avoid sustained neck strain.",
        "Use trunk support so breathing remains steady.",
      ],
      comfortCues: [
        "Set clear pause and stop cues before pacing changes.",
        "Take regular breaks for jaw, neck, and shoulder reset.",
      ],
      modifications: [
        "Use extra pillows to reduce upper-body load.",
        "Switch to side-lying support when fatigue rises.",
      ],
      contraindications: [
        "Acute neck strain with flexion",
        "Current jaw pain that worsens with sustained effort",
      ],
    },
    "supine-support": {
      setup: [surfaceCue, "Use pillow support under knees or hips for a neutral resting base."],
      alignmentCues: [
        "Keep lower back supported without forced arching.",
        "Maintain relaxed jaw and shoulder positioning.",
      ],
      comfortCues: [
        "Use slow transitions and frequent consent check-ins.",
        "Pause and reset if pressure trends upward.",
      ],
      modifications: [
        "Lower pillow height if back pressure increases.",
        "Transition to side-lying support if symptoms persist.",
      ],
      contraindications: [
        "Current abdominal pain with supine loading",
        "Extension-sensitive low-back pain without symptom control",
      ],
    },
  };

  const guidance = byPosture[posture];

  guidance.setup[0] = surfaceCue;
  guidance.setup[1] = getOrientationSetupCue(signals);
  guidance.alignmentCues[0] = getAlignmentCuePrimary(signals);
  guidance.alignmentCues[1] = getAlignmentCueSecondary(signals);
  guidance.comfortCues[0] = getComfortCuePrimary(signals, difficulty);
  guidance.comfortCues[1] = getComfortCueSecondary(signals);
  guidance.modifications[0] = getModificationPrimary(signals);
  guidance.modifications[1] = getModificationSecondary(signals);
  guidance.contraindications[0] = getContraindicationPrimary(signals);
  guidance.contraindications[1] = getContraindicationSecondary(signals);

  if (difficulty === "advanced") {
    guidance.comfortCues[0] = "Use short rounds with planned recovery pauses.";
    guidance.modifications[1] = "Keep movement range small and switch early if strain increases.";
  }

  if (difficulty === "beginner") {
    guidance.setup[1] = `${guidance.setup[1]} Start with low-range pacing and steady breathing.`;
  }

  return guidance;
};

const inferDocumentationSources = (signals: RowSignals, posture: ImportedPostureFamily): PositionDocumentationSource[] => {
  const keys: Array<keyof typeof SOURCES> = [];

  keys.push("mayoPainfulIntercourse", "aafpDyspareunia2021");

  if (posture === "side-lying" || posture === "top-led") {
    keys.push("clevelandEndometriosis");
  }

  if (
    signals.orientations.has("standing") ||
    signals.orientations.has("quadruped") ||
    signals.interactions.has("right-angle") ||
    signals.interactions.has("from-behind")
  ) {
    keys.push("pubmedMaleBiomech2014", "pubmedFemaleBiomech2014", "pubmedSexDisabilityFramework2024");
  }

  if (signals.hasOralContact || posture === "oral-support") {
    keys.push("nhsPainDuringSex");
  }

  if (signals.orientations.has("seated") || signals.orientations.has("side-lying")) {
    keys.push("pubmedPelvicFloorRehab2019", "pubmedPelvicFloorDysfunction2023");
  }

  const uniqueKeys = Array.from(new Set(keys));
  return uniqueKeys.map((key) => SOURCES[key]);
};

const buildCuratedLikeFields = (
  templateId: string,
  posture: ImportedPostureFamily,
  inferredDifficulty: PositionDifficulty,
  externalName: string,
  tokens: string[],
  signals: RowSignals,
): Omit<PositionEntry, "id" | "name"> => {
  const template = curatedTemplateById[templateId];
  if (!template) {
    const fallbackGuidance = buildGuidanceTemplate(posture, inferredDifficulty, signals);
    return {
      inspirationTags: inferInspirationTags(posture, inferredDifficulty, externalName),
      comfortTags: inferComfortTags(posture, inferredDifficulty, tokens),
      setup: [...fallbackGuidance.setup],
      alignmentCues: [...fallbackGuidance.alignmentCues],
      comfortCues: [...fallbackGuidance.comfortCues],
      modifications: [...fallbackGuidance.modifications],
      difficulty: inferredDifficulty,
      contraindications: [...fallbackGuidance.contraindications],
      documentationSources: inferDocumentationSources(signals, posture),
    };
  }

  const effectiveDifficulty = elevateDifficulty(template.difficulty, inferredDifficulty);
  const fallbackGuidance = buildGuidanceTemplate(posture, effectiveDifficulty, signals);
  const surfaceCue = getSurfaceSetupCue(signals);

  return {
    inspirationTags: inferCuratedInspirationTags(templateId, externalName, template),
    comfortTags: dedupe([
      ...template.comfortTags,
      ...inferComfortTags(posture, effectiveDifficulty, tokens),
    ]).slice(0, 3),
    setup: dedupe([surfaceCue, fallbackGuidance.setup[1], ...template.setup]).slice(0, 2),
    alignmentCues: dedupe([fallbackGuidance.alignmentCues[0], fallbackGuidance.alignmentCues[1], ...template.alignmentCues]).slice(0, 2),
    comfortCues: dedupe([fallbackGuidance.comfortCues[0], fallbackGuidance.comfortCues[1], ...template.comfortCues]).slice(0, 2),
    modifications: dedupe([fallbackGuidance.modifications[0], fallbackGuidance.modifications[1], ...template.modifications]).slice(0, 2),
    difficulty: effectiveDifficulty,
    contraindications: dedupe([fallbackGuidance.contraindications[0], fallbackGuidance.contraindications[1], ...template.contraindications]).slice(0, 2),
    documentationSources: inferDocumentationSources(signals, posture),
  };
};

const buildExternalProvenance = (row: ImportedReferenceRow): ImportedPositionSourceProvenance => {
  const source = row.source ?? {};
  const sourceUrl = compactWhitespace(source.sourceUrl ?? "");
  return {
    sourceName: compactWhitespace(source.sourceName ?? "") || DEFAULT_EXTERNAL_SOURCE.sourceName,
    sourceUrl: /^https?:\/\/\S+/i.test(sourceUrl) ? sourceUrl : DEFAULT_EXTERNAL_SOURCE.sourceUrl,
    license: compactWhitespace(source.license ?? "") || DEFAULT_EXTERNAL_SOURCE.license,
    attribution: compactWhitespace(source.attribution ?? "") || DEFAULT_EXTERNAL_SOURCE.attribution,
  };
};

const isValidImageUrl = (value: string | undefined): value is string =>
  Boolean(value && /^https?:\/\/\S+/i.test(value));

const buildImportedExternalReference = (
  row: ImportedReferenceRow,
  mappedPositionId: string,
): ImportedPositionExternalReference | null => {
  const externalId = compactWhitespace(row.externalId ?? "");
  const positionNumberMatch = externalId.match(/(\d+)/);
  const fallbackPositionPageUrl = positionNumberMatch
    ? `https://sexpositions.club/positions/${positionNumberMatch[1]}.html`
    : "";
  const resolvedUrl = isValidImageUrl(row.imageUrl) ? row.imageUrl : fallbackPositionPageUrl;
  if (!isValidImageUrl(resolvedUrl)) return null;

  const provenance = buildExternalProvenance(row);
  return {
    externalId,
    externalName: compactWhitespace(row.externalName ?? ""),
    imageUrl: resolvedUrl,
    imageAlt: compactWhitespace(row.imageAlt ?? "") || undefined,
    sourceName: provenance.sourceName,
    sourceUrl: provenance.sourceUrl,
    license: provenance.license,
    attribution: provenance.attribution,
    mappedPositionId,
    mappingConfidence: row.mappingConfidence ?? "manual",
  };
};

const buildIllustrationKeyFromSignals = (
  signals: RowSignals,
  mappedTemplateId: string,
): ImportedIllustrationKeyHint => {
  if (mappedTemplateId === "intimacy-rest-reset") return "rest-reset";
  if (signals.hasEdgeCue) return "edge-supported";

  if (signals.hasTopLedCue) {
    if (signals.interactions.has("reverse")) return "top-backward-supported";
    if (signals.interactions.has("sideways")) return "top-sideways-supported";
    return "top-forward-supported";
  }

  if (signals.orientations.has("quadruped")) return "quadruped-supported";

  if (signals.orientations.has("side-lying")) {
    if (signals.interactions.has("face-to-face")) return "side-lying-face-to-face";
    return "side-lying-spooning";
  }

  if (signals.orientations.has("seated")) {
    if (signals.interactions.has("reverse")) return "seated-reverse";
    if (signals.surfaces.has("chair") || signals.surfaces.has("couch")) return "chair-supported";
    return "seated-face-to-face";
  }

  if (signals.orientations.has("standing")) {
    if (signals.surfaces.has("counter")) return "standing-counter-supported";
    return "standing-wall-supported";
  }

  if (signals.surfaces.has("bed")) return "reclined-supported";
  return "supine-supported";
};

const describeSurface = (signals: RowSignals): string => {
  if (signals.surfaces.has("chair")) return "chair";
  if (signals.surfaces.has("counter")) return "counter";
  if (signals.surfaces.has("wall")) return "wall";
  if (signals.surfaces.has("bed")) return "bed";
  if (signals.surfaces.has("couch")) return "couch";
  if (signals.surfaces.has("floor")) return "floor";
  return "supported surface";
};

const describeInteraction = (signals: RowSignals): string => {
  if (signals.interactions.has("from-behind")) return "from-behind";
  if (signals.interactions.has("face-to-face")) return "face-to-face";
  if (signals.interactions.has("reverse")) return "reverse-facing";
  if (signals.interactions.has("sideways")) return "sideways";
  if (signals.interactions.has("right-angle")) return "right-angle";
  return "comfort-first";
};

const buildIllustrationCaption = (
  signals: RowSignals,
  key: ImportedIllustrationKeyHint,
): string => {
  const surface = describeSurface(signals);
  const interaction = describeInteraction(signals);

  if (key === "quadruped-supported") {
    return `Quadruped ${interaction} orientation with ${surface} support cues.`;
  }
  if (key === "standing-counter-supported" || key === "standing-wall-supported") {
    return `Standing ${interaction} orientation with ${surface}-supported balance focus.`;
  }
  if (key === "top-forward-supported" || key === "top-backward-supported" || key === "top-sideways-supported") {
    return `Top-led ${interaction} orientation with ${surface} stabilization cues.`;
  }
  if (key === "side-lying-spooning" || key === "side-lying-face-to-face") {
    return `Side-lying ${interaction} orientation adapted to ${surface} support.`;
  }
  if (key === "seated-face-to-face" || key === "seated-reverse" || key === "chair-supported") {
    return `Seated ${interaction} orientation with ${surface}-based trunk support.`;
  }
  if (key === "edge-supported") {
    return "Edge-supported orientation emphasizing controlled stance and load transfer.";
  }
  if (key === "rest-reset") {
    return "Recovery orientation with low-load support and paced breathing reset.";
  }
  return `Supported ${interaction} orientation with ${surface} alignment cues.`;
};

const buildIllustrationMechanicsFocus = (signals: RowSignals): [string, string] => {
  const first =
    signals.orientations.has("quadruped")
      ? "Keep trunk braced and limit lumbar extension through small range changes."
      : signals.orientations.has("standing")
        ? "Use stable contact points and soft knees to maintain balance control."
        : signals.orientations.has("seated")
          ? "Keep rib cage stacked over pelvis and avoid trunk collapse."
          : signals.orientations.has("side-lying")
            ? "Keep shoulders and hips aligned with knee support for rotation control."
            : "Maintain neutral pelvic support and smooth pacing transitions.";

  const second =
    signals.interactions.has("from-behind")
      ? "Use forearm or hand support to reduce abrupt loading during angle changes."
      : signals.interactions.has("face-to-face")
        ? "Synchronize breathing and use frequent comfort check-ins."
        : signals.interactions.has("right-angle")
          ? "Limit end-range angles and recheck comfort before progressing."
          : signals.hasDynamicLoad
            ? "Use short rounds with recovery pauses to prevent strain accumulation."
            : "Adjust support points first, then increase pace gradually.";

  return [first, second];
};

const buildImportedIllustrationHint = (
  signals: RowSignals,
  mappedTemplateId: string,
): ImportedIllustrationHint => {
  const key = buildIllustrationKeyFromSignals(signals, mappedTemplateId);
  const mechanics = buildIllustrationMechanicsFocus(signals);
  return {
    key,
    caption: buildIllustrationCaption(signals, key),
    mechanicsFocus: [mechanics[0], mechanics[1]],
  };
};

const buildImportedSearchProfile = (
  row: ImportedReferenceRow,
  signals: RowSignals,
): ImportedSearchProfileHint => {
  const externalName = compactWhitespace(row.externalName ?? "");
  const externalId = compactWhitespace(row.externalId ?? "");
  const positionNumber = externalId.match(/(\d+)/)?.[1] ?? "";
  const surfaceHint = describeSurface(signals);
  const interactionHint = describeInteraction(signals);

  const primaryParts = [
    externalName || "imported position",
    "sex position",
    "sexpositions club",
    positionNumber,
  ].filter(Boolean);

  const secondaryParts = [
    externalName || "imported position",
    "sex position",
    interactionHint === "comfort-first" ? "" : interactionHint,
    surfaceHint === "supported surface" ? "" : surfaceHint,
  ].filter(Boolean);

  return {
    primaryTerm: primaryParts.join(" "),
    secondaryTerms: [secondaryParts.join(" "), `${externalName} sexpositions club`.trim()],
  };
};

const buildCatalogEntry = (row: ImportedReferenceRow, index: number): ImportedCatalogEntry | null => {
  const externalId = compactWhitespace(row.externalId ?? "");
  const externalName = compactWhitespace(row.externalName ?? "");
  if (!externalId || !externalName) return null;

  const safeName = sanitizeName(externalName, index);
  const tokens = tokenizeRow(row);
  const posture = inferPostureFamily(tokens);
  const signals = deriveRowSignals(tokens, posture);
  const inferredDifficulty = inferDifficulty(posture, tokens);
  const mappedTemplateId = inferMappedCuratedTemplateId(row, tokens, posture);
  const curatedLike = buildCuratedLikeFields(
    mappedTemplateId,
    posture,
    inferredDifficulty,
    externalName,
    tokens,
    signals,
  );
  const rowNumber = extractNumber(externalId, index);
  const slug = slugify(safeName) || `position-${rowNumber}`;
  const positionId = `club-${rowNumber}-${slug.slice(0, 52)}`;

  const position: PositionEntry = {
    id: positionId,
    name: `${safeName} (Imported #${rowNumber})`,
    inspirationTags: curatedLike.inspirationTags,
    comfortTags: curatedLike.comfortTags,
    setup: curatedLike.setup,
    alignmentCues: curatedLike.alignmentCues,
    comfortCues: curatedLike.comfortCues,
    modifications: curatedLike.modifications,
    difficulty: curatedLike.difficulty,
    contraindications: curatedLike.contraindications,
    documentationSources: curatedLike.documentationSources,
  };

  const sourceEntry: ImportedPositionSourceEntry = {
    positionId,
    displayName: position.name,
    aliases: dedupe([safeName, externalName, externalId]),
    provenance: [EDITORIAL_PROVENANCE, buildExternalProvenance(row)],
    externalId,
    externalName,
  };

  return {
    position,
    sourceEntry,
    postureFamily: posture,
    signals,
    mappedTemplateId,
    externalReference: buildImportedExternalReference(row, positionId),
    searchProfile: buildImportedSearchProfile(row, signals),
  };
};

const importedRows = [...MANUAL_SITE_ROWS, ...((importedPositionData as ImportedPayload).rows ?? [])]
  .filter((row): row is ImportedReferenceRow => Boolean(row))
  .filter((row, index, all) => {
    const externalId = compactWhitespace(row.externalId ?? "");
    if (!externalId) return false;
    return all.findIndex((candidate) => compactWhitespace(candidate.externalId ?? "") === externalId) === index;
  });
const catalogEntries: ImportedCatalogEntry[] = importedRows
  .map((row, index) => buildCatalogEntry(row, index))
  .filter((entry): entry is ImportedCatalogEntry => Boolean(entry));

export const importedIntimacyPositions: PositionEntry[] = catalogEntries.map((entry) => entry.position);

export const importedPositionSourceEntries: Record<string, ImportedPositionSourceEntry> = Object.fromEntries(
  catalogEntries.map((entry) => [entry.position.id, entry.sourceEntry]),
);

export const importedPositionPostureById: Record<string, ImportedPostureFamily> = Object.fromEntries(
  catalogEntries.map((entry) => [entry.position.id, entry.postureFamily]),
);

export const importedTemplateIdByPositionId: Record<string, string> = Object.fromEntries(
  catalogEntries.map((entry) => [entry.position.id, entry.mappedTemplateId]),
);

export const importedExternalReferenceByPositionId: Record<string, ImportedPositionExternalReference> =
  Object.fromEntries(
    catalogEntries
      .filter((entry): entry is ImportedCatalogEntry & { externalReference: ImportedPositionExternalReference } =>
        Boolean(entry.externalReference),
      )
      .map((entry) => [entry.position.id, entry.externalReference]),
  );

export const importedIllustrationHintByPositionId: Record<string, ImportedIllustrationHint> =
  Object.fromEntries(
    catalogEntries.map((entry) => [
      entry.position.id,
      buildImportedIllustrationHint(entry.signals, entry.mappedTemplateId),
    ]),
  );

export const importedSearchProfileByPositionId: Record<string, ImportedSearchProfileHint> =
  Object.fromEntries(
    catalogEntries.map((entry) => [entry.position.id, entry.searchProfile]),
  );
