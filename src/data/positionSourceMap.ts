import type { PositionEntry } from "../types";
import { importedPositionSourceEntries } from "./importedIntimacyPositions";

export interface PositionSourceProvenance {
  sourceName: string;
  sourceUrl: string;
  license: string;
  attribution: string;
}

export interface PositionSourceMapEntry {
  positionId: string;
  displayName: string;
  aliases: string[];
  provenance: PositionSourceProvenance[];
}

const INTERNAL_MAPPING_PROVENANCE: PositionSourceProvenance = {
  sourceName: "NutriCompass editorial mapping",
  sourceUrl: "https://github.com/panos/nutrient-recommendation-app",
  license: "Project repository license",
  attribution: "NutriCompass contributors",
};

const EXTERNAL_REFERENCE_PROVENANCE: PositionSourceProvenance = {
  sourceName: "TraxDinosaur/SexPositions reference dataset",
  sourceUrl: "https://github.com/TraxDinosaur/SexPositions",
  license: "Use only with explicit license verification before reuse",
  attribution: "TraxDinosaur/SexPositions contributors",
};

const withProvenance = (
  positionId: string,
  displayName: string,
  aliases: string[],
): PositionSourceMapEntry => ({
  positionId,
  displayName,
  aliases,
  provenance: [INTERNAL_MAPPING_PROVENANCE, EXTERNAL_REFERENCE_PROVENANCE],
});

const curatedPositionSourceMap: Record<string, PositionSourceMapEntry> = {
  "side-lying-support": withProvenance(
    "side-lying-support",
    "Spooning (Side-Lying Support)",
    ["spooning", "side lying spooning", "spoon position"],
  ),
  "side-lying-spooning-variation": withProvenance(
    "side-lying-spooning-variation",
    "Spooning (Pillow Variation)",
    ["spooning with pillows", "supported spooning"],
  ),
  "side-lying-face-to-face-variation": withProvenance(
    "side-lying-face-to-face-variation",
    "Face-to-Face Side-Lying",
    ["side lying face to face", "face to face spooning"],
  ),
  "seated-face-to-face": withProvenance(
    "seated-face-to-face",
    "Seated Face-to-Face",
    ["seated partner", "lotus position", "face to face seated"],
  ),
  "semi-reclined-lotus-support": withProvenance(
    "semi-reclined-lotus-support",
    "Reclined Lotus",
    ["semi reclined lotus", "supported lotus", "reclined seated lotus"],
  ),
  "reverse-facing-seated-support": withProvenance(
    "reverse-facing-seated-support",
    "Reverse Seated",
    ["reverse seated", "reverse seated partner", "seated facing away"],
  ),
  "reclined-pillows": withProvenance(
    "reclined-pillows",
    "Reclined with Pillows",
    ["pillow supported reclined", "reclined support position"],
  ),
  "supported-top-led-control": withProvenance(
    "supported-top-led-control",
    "Woman on Top (Supported)",
    ["woman on top", "supported cowgirl", "top led supported"],
  ),
  "missionary-supported-pelvis-elevated": withProvenance(
    "missionary-supported-pelvis-elevated",
    "Missionary (Pillow Under Hips)",
    ["missionary pillow under hips", "elevated missionary"],
  ),
  "coital-alignment-technique-supported": withProvenance(
    "coital-alignment-technique-supported",
    "CAT Position (Supported)",
    ["cat position", "coital alignment technique", "cat supported"],
  ),
  "edge-of-bed-assisted": withProvenance(
    "edge-of-bed-assisted",
    "Edge of Bed",
    ["edge of bed position", "bed edge position"],
  ),
  "chair-supported-neutral": withProvenance(
    "chair-supported-neutral",
    "Chair-Seated (Supported)",
    ["chair position", "seated chair support", "supported chair"],
  ),
  "hip-neutral-pillow-bridge": withProvenance(
    "hip-neutral-pillow-bridge",
    "Pillow Bridge",
    ["pillow bridge", "hip bridge support", "supported bridge"],
  ),
  "knee-supported-side-angle": withProvenance(
    "knee-supported-side-angle",
    "Side-Lying with Knee Support",
    ["knee supported side", "side angle with knee support"],
  ),
  "missionary-low-extension-a": withProvenance(
    "missionary-low-extension-a",
    "Missionary (Low Extension)",
    ["low extension missionary", "missionary low extension"],
  ),
  "missionary-low-extension-b": withProvenance(
    "missionary-low-extension-b",
    "Missionary (Paced Range)",
    ["paced missionary", "missionary paced range"],
  ),
  "quadruped-supported-a": withProvenance(
    "quadruped-supported-a",
    "Doggy Style (Pillow Support)",
    ["doggy style pillow support", "all fours supported"],
  ),
  "quadruped-supported-b": withProvenance(
    "quadruped-supported-b",
    "Doggy Style (Elevated Support)",
    ["doggy style elevated support", "all fours low back support"],
  ),
  "supported-standing-wall-shift": withProvenance(
    "supported-standing-wall-shift",
    "Standing Against Wall (Supported)",
    ["standing against wall", "wall supported standing"],
  ),
  "counter-height-forearm-supported": withProvenance(
    "counter-height-forearm-supported",
    "Standing at Counter (Forearm Support)",
    ["counter supported standing", "standing counter support"],
  ),
  "low-load-seated-knee-support": withProvenance(
    "low-load-seated-knee-support",
    "Low-Effort Seated",
    ["low effort seated", "seated knee support"],
  ),
  "top-sideways-supported": withProvenance(
    "top-sideways-supported",
    "Sideways Cowgirl (Supported)",
    ["sideways cowgirl", "side cowgirl"],
  ),
  "top-facing-forward-supported": withProvenance(
    "top-facing-forward-supported",
    "Cowgirl (Supported)",
    ["cowgirl", "woman on top forward"],
  ),
  "top-facing-backward-supported": withProvenance(
    "top-facing-backward-supported",
    "Reverse Cowgirl (Supported)",
    ["reverse cowgirl", "top facing backward"],
  ),
  "intimacy-rest-reset": withProvenance(
    "intimacy-rest-reset",
    "Aftercare Rest Position",
    ["aftercare rest", "aftercare cuddle", "recovery cuddle position"],
  ),
};

const importedPositionSourceMap: Record<string, PositionSourceMapEntry> = Object.fromEntries(
  Object.entries(importedPositionSourceEntries).map(([positionId, entry]) => [
    positionId,
    {
      positionId: entry.positionId,
      displayName: entry.displayName,
      aliases: entry.aliases,
      provenance: entry.provenance,
    },
  ]),
);

export const positionSourceMap: Record<string, PositionSourceMapEntry> = {
  ...curatedPositionSourceMap,
  ...importedPositionSourceMap,
};

const normalizeAlias = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const aliasLookup: Record<string, string> = {};
for (const entry of Object.values(positionSourceMap)) {
  const aliases = [entry.displayName, ...entry.aliases];
  for (const alias of aliases) {
    const key = normalizeAlias(alias);
    if (!key) continue;
    if (!aliasLookup[key]) aliasLookup[key] = entry.positionId;
  }
}

export const getPositionIdFromExternalName = (value: string): string | null => {
  const key = normalizeAlias(value);
  if (!key) return null;
  return aliasLookup[key] ?? null;
};

export const hasSourceMapForEveryPosition = (positions: PositionEntry[]): boolean =>
  positions.every((position) => Boolean(positionSourceMap[position.id]));

export const validatePositionSourceMetadata = (
  entries: Record<string, PositionSourceMapEntry>,
): string[] => {
  const issues: string[] = [];

  for (const [id, entry] of Object.entries(entries)) {
    if (!entry.displayName.trim()) issues.push(`${id}: displayName is required.`);
    if (entry.aliases.length === 0) issues.push(`${id}: at least one alias is required.`);
    if (entry.provenance.length === 0) issues.push(`${id}: at least one provenance source is required.`);

    for (const source of entry.provenance) {
      if (!source.sourceName.trim()) issues.push(`${id}: sourceName is required.`);
      if (!source.license.trim()) issues.push(`${id}: license is required.`);
      if (!source.attribution.trim()) issues.push(`${id}: attribution is required.`);
      if (!/^https?:\/\/\S+/i.test(source.sourceUrl)) {
        issues.push(`${id}: sourceUrl must be an absolute http(s) URL.`);
      }
    }
  }

  return issues;
};
