export type IntimacySafetySeverity = "none" | "pause" | "urgent" | "emergency";

interface SafetyRule {
  pattern: RegExp;
  reason: string;
  severity: Exclude<IntimacySafetySeverity, "none">;
  immediateSteps: string[];
}

const ESCALATION_RULES: SafetyRule[] = [
  {
    pattern: /\b(bleeding|hemorrhage|faint|fainted|fainting|passed out|unconscious|chest pain|can'?t breathe|trouble breathing|self[-\s]?harm|suicidal)\b/i,
    reason: "Emergency warning signs were detected.",
    severity: "emergency",
    immediateSteps: [
      "Stop immediately and move to a safe position.",
      "Call local emergency services right now.",
      "Do not resume coaching until urgent care guidance is completed.",
    ],
  },
  {
    pattern: /\b(force|forced|coerce|coercion|pressured|pressure|threat|violence)\b/i,
    reason: "Potential coercion or pressure was detected.",
    severity: "urgent",
    immediateSteps: [
      "Stop immediately and prioritize physical safety.",
      "Move to a private safe location away from pressure.",
      "Reach out to trusted support or crisis resources.",
    ],
  },
  {
    pattern: /\b(trauma|flashback|triggered|assault|abuse)\b/i,
    reason: "Potential trauma-related distress was detected.",
    severity: "urgent",
    immediateSteps: [
      "Pause all activity and return to steady breathing.",
      "Use grounding and emotional support before any next step.",
      "Resume only with clear consent and emotional stability.",
    ],
  },
  {
    pattern: /\b(severe pain|persistent pain|ongoing pain|painful|pain|hurt|hurts|distress|panic)\b/i,
    reason: "Potential pain or high distress was detected.",
    severity: "pause",
    immediateSteps: [
      "Stop movement and switch to a low-load rest position.",
      "Reassess comfort after a short pause and hydration.",
      "Seek clinical support if symptoms continue or worsen.",
    ],
  },
];

export interface IntimacySafetyResult {
  requiresEscalation: boolean;
  severity: IntimacySafetySeverity;
  reason?: string;
  immediateSteps: string[];
}

export const evaluateSafetyEscalation = (text: string): IntimacySafetyResult => {
  const normalized = text.trim();
  if (!normalized) {
    return {
      requiresEscalation: false,
      severity: "none",
      immediateSteps: [],
    };
  }

  for (const rule of ESCALATION_RULES) {
    if (rule.pattern.test(normalized)) {
      return {
        requiresEscalation: true,
        severity: rule.severity,
        reason: rule.reason,
        immediateSteps: rule.immediateSteps,
      };
    }
  }

  return {
    requiresEscalation: false,
    severity: "none",
    immediateSteps: [],
  };
};
