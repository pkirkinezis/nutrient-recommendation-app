import type { PositionEntry } from "../types";

export type MatcherPainFocus =
  | "none"
  | "low-back"
  | "pelvic-floor"
  | "hips-knees"
  | "mobility-balance";

export type MatcherEnergyLevel = "low" | "medium" | "high";
export type MatcherPriority = "comfort" | "connection" | "control";
export type MatchConfidence = "high" | "medium" | "low";

export interface PositionMatcherInput {
  painFocus: MatcherPainFocus;
  energyLevel: MatcherEnergyLevel;
  priority: MatcherPriority;
  preferUpright: boolean;
  beginnerFriendlyOnly: boolean;
}

export interface MatchedPositionRecommendation {
  position: PositionEntry;
  score: number;
  reasons: string[];
  cautions: string[];
  confidence: MatchConfidence;
  isExcluded: boolean;
  exclusionReason?: string;
}

const UPRIGHT_POSITION_IDS = new Set([
  "seated-face-to-face",
  "semi-reclined-lotus-support",
  "reverse-facing-seated-support",
  "edge-of-bed-assisted",
  "chair-supported-neutral",
  "supported-standing-wall-shift",
  "counter-height-forearm-supported",
  "low-load-seated-knee-support",
]);

const CONNECTION_POSITION_IDS = new Set([
  "side-lying-face-to-face-variation",
  "seated-face-to-face",
  "semi-reclined-lotus-support",
]);

const CONTROL_POSITION_IDS = new Set([
  "supported-top-led-control",
  "top-facing-forward-supported",
  "top-facing-backward-supported",
  "top-sideways-supported",
]);

const HIGH_RISK_TERMS = [
  /\bacute\b/i,
  /\bcurrent\b/i,
  /\bsevere\b/i,
  /\binstability\b/i,
  /\bunmanaged\b/i,
  /\bpersistent\b/i,
];

const FOCUS_TERMS: Record<Exclude<MatcherPainFocus, "none">, RegExp[]> = {
  "low-back": [/\blow-back\b/i, /\blumbar\b/i, /\bradicular\b/i, /\bextension\b/i],
  "pelvic-floor": [/\bpelvic\b/i, /\bpelvis\b/i],
  "hips-knees": [/\bhip\b/i, /\bknee\b/i, /\bankle\b/i],
  "mobility-balance": [/\bbalance\b/i, /\bdizziness\b/i, /\bweight-bearing\b/i],
};

const SCORE = {
  focusPrimary: 5,
  focusSupport: 3,
  comfortPrimary: 2,
  controlPrimary: 2,
  connectionPrimary: 3,
  energyLowPrimary: 3,
  energyLowSupport: 2,
  uprightPreference: 2,
  controlPositionBonus: 2,
  connectionPositionBonus: 1,
  mediumEnergyBase: 1,
  highEnergyBase: 1,
  beginnerBonus: 2,
  intermediatePenalty: -2,
  advancedPenalty: -4,
  advancedLowEnergyPenalty: -3,
  minorMismatchPenalty: -1,
};

const addReason = (
  reasons: string[],
  condition: boolean,
  message: string,
  addPoints: () => void,
) => {
  if (!condition) return;
  addPoints();
  reasons.push(message);
};

const includesAny = (value: string[], patterns: RegExp[]): boolean =>
  patterns.some((pattern) => value.some((item) => pattern.test(item)));

const getMatchConfidence = (score: number): MatchConfidence => {
  if (score >= 10) return "high";
  if (score >= 6) return "medium";
  return "low";
};

const shouldExcludePosition = (
  contraindications: string[],
  painFocus: MatcherPainFocus,
): string | null => {
  if (painFocus === "none") return null;

  const hasFocusTerm = includesAny(contraindications, FOCUS_TERMS[painFocus]);
  if (!hasFocusTerm) return null;

  const hasHighRisk = includesAny(contraindications, HIGH_RISK_TERMS);
  if (!hasHighRisk) return null;

  if (painFocus === "low-back") {
    return "Contraindications mention acute/severe low-back risk.";
  }
  if (painFocus === "pelvic-floor") {
    return "Contraindications mention acute/severe pelvic risk.";
  }
  if (painFocus === "hips-knees") {
    return "Contraindications mention acute hip/knee risk.";
  }
  return "Contraindications mention acute mobility/balance risk.";
};

const scorePosition = (
  position: PositionEntry,
  input: PositionMatcherInput,
): MatchedPositionRecommendation => {
  let score = 0;
  const reasons: string[] = [];
  const cautions: string[] = [];

  const tags = new Set(position.comfortTags);
  const contraindications = position.contraindications.map((entry) => entry.toLowerCase());
  const isUpright = UPRIGHT_POSITION_IDS.has(position.id);
  const exclusionReason = shouldExcludePosition(contraindications, input.painFocus);
  const isExcluded = Boolean(exclusionReason);

  if (input.painFocus === "low-back") {
    addReason(
      reasons,
      tags.has("low-back-sensitive"),
      "low-back-sensitive tag",
      () => {
        score += SCORE.focusPrimary;
      },
    );
    if (includesAny(contraindications, [/\blow-back\b/, /\bradicular\b/, /\bextension\b/])) {
      score += SCORE.intermediatePenalty;
      cautions.push("Contraindications mention low-back or extension sensitivity.");
    }
  }

  if (input.painFocus === "pelvic-floor") {
    addReason(
      reasons,
      tags.has("pelvic-floor-tension"),
      "pelvic-floor-tension tag",
      () => {
        score += SCORE.focusPrimary;
      },
    );
    addReason(
      reasons,
      tags.has("gentle-depth-control"),
      "gentle-depth-control support",
      () => {
        score += SCORE.focusSupport;
      },
    );
  }

  if (input.painFocus === "hips-knees") {
    addReason(
      reasons,
      tags.has("mobility-limited"),
      "mobility-limited support",
      () => {
        score += SCORE.focusPrimary;
      },
    );
    if (includesAny(contraindications, [/\bhip\b/, /\bknee\b/])) {
      score += SCORE.intermediatePenalty;
      cautions.push("Contraindications mention hip or knee pain.");
    }
  }

  if (input.painFocus === "mobility-balance") {
    addReason(
      reasons,
      tags.has("balance-support"),
      "balance-support tag",
      () => {
        score += SCORE.focusPrimary;
      },
    );
    addReason(
      reasons,
      tags.has("mobility-limited"),
      "mobility-limited support",
      () => {
        score += SCORE.focusSupport;
      },
    );
  }

  if (input.energyLevel === "low") {
    addReason(
      reasons,
      tags.has("fatigue-aware"),
      "fatigue-aware pacing",
      () => {
        score += SCORE.energyLowPrimary;
      },
    );
    addReason(
      reasons,
      tags.has("short-interval"),
      "short-interval support",
      () => {
        score += SCORE.energyLowSupport;
      },
    );
    if (position.difficulty === "beginner") score += SCORE.beginnerBonus;
    if (position.difficulty === "advanced") {
      score += SCORE.advancedLowEnergyPenalty;
      cautions.push("Advanced difficulty may be tiring for low-energy days.");
    }
  }

  if (input.energyLevel === "medium") {
    if (position.difficulty !== "advanced") score += SCORE.mediumEnergyBase;
  }

  if (input.energyLevel === "high") {
    if (position.difficulty !== "beginner") score += SCORE.highEnergyBase;
  }

  if (input.priority === "comfort") {
    addReason(
      reasons,
      tags.has("gentle-depth-control"),
      "comfort-first range control",
      () => {
        score += SCORE.comfortPrimary;
      },
    );
    addReason(
      reasons,
      tags.has("fatigue-aware"),
      "low-exertion comfort fit",
      () => {
        score += SCORE.comfortPrimary;
      },
    );
  }

  if (input.priority === "connection") {
    addReason(
      reasons,
      tags.has("communication-focused"),
      "communication-focused structure",
      () => {
        score += SCORE.connectionPrimary;
      },
    );
    if (CONNECTION_POSITION_IDS.has(position.id)) score += SCORE.connectionPositionBonus;
  }

  if (input.priority === "control") {
    addReason(
      reasons,
      tags.has("gentle-depth-control"),
      "controlled range support",
      () => {
        score += SCORE.controlPrimary;
      },
    );
    if (CONTROL_POSITION_IDS.has(position.id)) score += SCORE.controlPositionBonus;
  }

  if (input.preferUpright) {
    if (isUpright) {
      score += SCORE.uprightPreference;
      reasons.push("upright posture preference");
    } else {
      score += SCORE.minorMismatchPenalty;
    }
  }

  if (input.beginnerFriendlyOnly) {
    if (position.difficulty === "beginner") {
      score += SCORE.beginnerBonus;
    } else if (position.difficulty === "intermediate") {
      score += SCORE.intermediatePenalty;
      cautions.push("Intermediate difficulty may not fit beginner-only preference.");
    } else {
      score += SCORE.advancedPenalty;
      cautions.push("Advanced difficulty conflicts with beginner-only preference.");
    }
  }

  if (isExcluded && exclusionReason) {
    cautions.unshift(exclusionReason);
  }

  return {
    position,
    score,
    reasons,
    cautions,
    confidence: getMatchConfidence(score),
    isExcluded,
    exclusionReason: exclusionReason ?? undefined,
  };
};

export const matchPersonalizedPositions = (
  positions: PositionEntry[],
  input: PositionMatcherInput,
  limit = 3,
): MatchedPositionRecommendation[] => {
  const ranked = positions
    .map((position) => scorePosition(position, input))
    .sort((a, b) => b.score - a.score || a.position.name.localeCompare(b.position.name));

  const nonExcluded = ranked.filter((item) => !item.isExcluded);
  const nonExcludedStrongMatches = nonExcluded.filter((item) => item.score > 0).slice(0, limit);
  if (nonExcludedStrongMatches.length > 0) return nonExcludedStrongMatches;

  const nonExcludedFallback = nonExcluded.slice(0, limit);
  if (nonExcludedFallback.length > 0) return nonExcludedFallback;

  return ranked.slice(0, limit);
};
