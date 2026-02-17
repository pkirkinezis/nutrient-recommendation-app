import type { PositionEntry } from "../types";
import { importedSearchProfileByPositionId } from "../data/importedIntimacyPositions";

interface PositionImageSearchProfile {
  primaryTerm: string;
  secondaryTerms: string[];
}

const SEARCH_PROFILE_BY_ID: Record<string, PositionImageSearchProfile> = {
  "side-lying-support": {
    primaryTerm: "spooning sex position",
    secondaryTerms: ["side lying spooning sex position"],
  },
  "side-lying-spooning-variation": {
    primaryTerm: "spooning sex position with pillows",
    secondaryTerms: ["spooning sex position"],
  },
  "side-lying-face-to-face-variation": {
    primaryTerm: "face to face side lying sex position",
    secondaryTerms: ["face to face spooning sex position"],
  },
  "seated-face-to-face": {
    primaryTerm: "seated face to face sex position",
    secondaryTerms: ["seated partner sex position"],
  },
  "semi-reclined-lotus-support": {
    primaryTerm: "reclined lotus sex position",
    secondaryTerms: ["lotus sex position"],
  },
  "reverse-facing-seated-support": {
    primaryTerm: "reverse seated sex position",
    secondaryTerms: ["seated facing away sex position"],
  },
  "reclined-pillows": {
    primaryTerm: "reclined sex position with pillows",
    secondaryTerms: ["pillow supported sex position"],
  },
  "supported-top-led-control": {
    primaryTerm: "woman on top sex position supported",
    secondaryTerms: ["cowgirl sex position with support"],
  },
  "missionary-supported-pelvis-elevated": {
    primaryTerm: "missionary sex position pillow under hips",
    secondaryTerms: ["supported missionary sex position"],
  },
  "coital-alignment-technique-supported": {
    primaryTerm: "coital alignment technique sex position",
    secondaryTerms: ["cat sex position"],
  },
  "edge-of-bed-assisted": {
    primaryTerm: "edge of bed sex position",
    secondaryTerms: ["bed edge sex position"],
  },
  "chair-supported-neutral": {
    primaryTerm: "chair sex position supported",
    secondaryTerms: ["seated chair sex position"],
  },
  "hip-neutral-pillow-bridge": {
    primaryTerm: "pillow bridge sex position",
    secondaryTerms: ["hip supported sex position"],
  },
  "knee-supported-side-angle": {
    primaryTerm: "side lying sex position knee support",
    secondaryTerms: ["side angle sex position"],
  },
  "missionary-low-extension-a": {
    primaryTerm: "missionary sex position low extension",
    secondaryTerms: ["low back friendly missionary sex position"],
  },
  "missionary-low-extension-b": {
    primaryTerm: "missionary sex position paced range",
    secondaryTerms: ["missionary low extension sex position"],
  },
  "quadruped-supported-a": {
    primaryTerm: "doggy style sex position pillow support",
    secondaryTerms: ["all fours sex position supported"],
  },
  "quadruped-supported-b": {
    primaryTerm: "doggy style sex position elevated support",
    secondaryTerms: ["all fours sex position low back support"],
  },
  "supported-standing-wall-shift": {
    primaryTerm: "standing sex position against wall",
    secondaryTerms: ["wall supported sex position"],
  },
  "counter-height-forearm-supported": {
    primaryTerm: "standing sex position at counter",
    secondaryTerms: ["counter supported standing sex position"],
  },
  "low-load-seated-knee-support": {
    primaryTerm: "low effort seated sex position",
    secondaryTerms: ["seated sex position with knee support"],
  },
  "top-sideways-supported": {
    primaryTerm: "sideways cowgirl sex position",
    secondaryTerms: ["cowgirl sideways sex position"],
  },
  "top-facing-forward-supported": {
    primaryTerm: "cowgirl sex position",
    secondaryTerms: ["woman on top sex position"],
  },
  "top-facing-backward-supported": {
    primaryTerm: "reverse cowgirl sex position",
    secondaryTerms: ["top facing backward sex position"],
  },
  "intimacy-rest-reset": {
    primaryTerm: "aftercare cuddle sex position",
    secondaryTerms: ["post sex aftercare cuddle position"],
  },
};

const compactQuery = (parts: string[]): string => {
  const words = parts
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  const deduped: string[] = [];
  for (const word of words) {
    const previous = deduped[deduped.length - 1];
    if (previous?.toLowerCase() === word.toLowerCase()) continue;
    deduped.push(word);
  }

  return deduped.join(" ");
};

const ensureSexKeyword = (value: string): string => {
  if (!value.trim()) return "sex position";
  if (/\bsex\b/i.test(value)) return compactQuery([value]);
  return compactQuery([value, "sex position"]);
};

const getSearchProfile = (position: PositionEntry): PositionImageSearchProfile =>
  SEARCH_PROFILE_BY_ID[position.id] ??
  importedSearchProfileByPositionId[position.id] ?? {
    primaryTerm: `${position.name} sex position`,
    secondaryTerms: ["sex position"],
  };

export const buildPositionImageSearchQuery = (position: PositionEntry): string => {
  const profile = getSearchProfile(position);
  return ensureSexKeyword(profile.primaryTerm);
};

export const buildPositionImageSearchUrl = (position: PositionEntry): string => {
  const query = buildPositionImageSearchQuery(position);
  return `https://www.google.com/search?tbm=isch&safe=off&q=${encodeURIComponent(query)}`;
};

export const buildPositionImageFallbackSearchQuery = (position: PositionEntry): string => {
  const profile = getSearchProfile(position);
  return ensureSexKeyword(profile.secondaryTerms[0] ?? position.name);
};

export const buildPositionImageFallbackSearchUrl = (position: PositionEntry): string => {
  const query = buildPositionImageFallbackSearchQuery(position);
  return `https://www.google.com/search?tbm=isch&safe=off&q=${encodeURIComponent(query)}`;
};

export const buildPositionImageSearchQueryYandex = (position: PositionEntry): string => {
  const profile = getSearchProfile(position);
  return ensureSexKeyword(profile.primaryTerm);
};

export const buildPositionImageSearchUrlYandex = (position: PositionEntry): string => {
  const query = buildPositionImageSearchQueryYandex(position);
  return `https://yandex.com/images/search?family=no&text=${encodeURIComponent(query)}`;
};

export const buildPositionImageFallbackSearchQueryYandex = (position: PositionEntry): string => {
  const profile = getSearchProfile(position);
  return ensureSexKeyword(profile.secondaryTerms[0] ?? position.name);
};

export const buildPositionImageFallbackSearchUrlYandex = (position: PositionEntry): string => {
  const query = buildPositionImageFallbackSearchQueryYandex(position);
  return `https://yandex.com/images/search?family=no&text=${encodeURIComponent(query)}`;
};
