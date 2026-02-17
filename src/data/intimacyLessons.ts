import type { Lesson } from "../types";

export const intimacyLessons: Lesson[] = [
  {
    id: "communication-comfort-baseline",
    title: "Communication and Comfort Baseline",
    goal: "Build a shared comfort plan before physical intimacy.",
    timeMinutes: 10,
    steps: [
      {
        id: "check-in-intent",
        title: "Intent Check-In",
        bodyMechanics: [
          "Sit face-to-face with neutral posture and relaxed shoulders.",
          "Keep feet grounded and breathing steady for one minute.",
        ],
        comfortPrompts: [
          "State what feels comfortable today.",
          "Name one thing you want to avoid today.",
        ],
        consentPrompt: "Do you both feel ready to continue this check-in?",
        stopSwitchPrompt: "You can pause now, switch to a lighter topic, or continue.",
      },
      {
        id: "boundaries-language",
        title: "Boundary Language Practice",
        bodyMechanics: [
          "Maintain eye-level alignment and calm pacing in speech.",
          "Keep a supportive distance where both can breathe comfortably.",
        ],
        comfortPrompts: [
          "Practice one clear yes phrase and one clear no phrase.",
          "Agree on a simple stop word and a switch word.",
        ],
        consentPrompt: "Are your boundaries clear and acknowledged?",
        stopSwitchPrompt: "If either person feels uncertain, stop and reset.",
      },
      {
        id: "close-baseline",
        title: "Close and Confirm",
        bodyMechanics: [
          "Use a relaxed seated posture with neutral neck alignment.",
          "Slow pace and check emotional comfort before ending.",
        ],
        comfortPrompts: [
          "Confirm one supportive action for aftercare.",
          "Confirm a follow-up time for another check-in.",
        ],
        consentPrompt: "Do you both consent to carry this plan forward?",
        stopSwitchPrompt: "If not, stop coaching and revisit later.",
      },
    ],
    options: [
      "Short version: complete only steps 1 and 2.",
      "Extended version: repeat each prompt with role swap.",
    ],
    aftercare: [
      "Drink water and take 5 minutes of quiet recovery.",
      "Share one appreciation and one adjustment for next time.",
    ],
    safety: [
      "If coercion, trauma responses, or distress appears, stop and seek professional support.",
      "Do not continue if either person reports persistent pain.",
    ],
  },
  {
    id: "breath-pace-alignment",
    title: "Breath, Pace, and Alignment",
    goal: "Use breathing and positioning to reduce strain and improve comfort.",
    timeMinutes: 12,
    steps: [
      {
        id: "breath-sync",
        title: "Breath Synchronization",
        bodyMechanics: [
          "Choose side-by-side or seated support with neutral spine.",
          "Inhale for 4 counts, exhale for 6 counts, for 90 seconds.",
        ],
        comfortPrompts: [
          "Rate comfort from 1 to 5.",
          "Adjust pace until both report at least 4.",
        ],
        consentPrompt: "Do you want to continue to movement pacing?",
        stopSwitchPrompt: "Switch to still breathing if pace feels too fast.",
      },
      {
        id: "micro-adjustments",
        title: "Micro-Adjustments",
        bodyMechanics: [
          "Use pillows or folded blankets to support hips, knees, or lower back.",
          "Keep movement range small and angle changes gradual.",
        ],
        comfortPrompts: [
          "Identify one angle that reduces pressure.",
          "Identify one support point that increases stability.",
        ],
        consentPrompt: "Are the current support points comfortable for both?",
        stopSwitchPrompt: "Stop if sharp pain or emotional distress appears.",
      },
      {
        id: "pace-close",
        title: "Pace Closeout",
        bodyMechanics: [
          "Slow down movement and return to steady breathing.",
          "Finish in a supported resting posture for one minute.",
        ],
        comfortPrompts: [
          "Name one movement to repeat next time.",
          "Name one movement to avoid next time.",
        ],
        consentPrompt: "Do you both consent to close this practice now?",
        stopSwitchPrompt: "Switch to rest-only mode if either person prefers.",
      },
    ],
    options: [
      "Low-energy option: breathing and support only.",
      "Mobility option: add two gentle angle changes with check-ins.",
    ],
    aftercare: [
      "Use heat or light stretching for tense muscle groups.",
      "Record comfort notes for your next session.",
    ],
    safety: [
      "Stop immediately for ongoing pain, dizziness, panic, or pressure.",
      "Escalate to a clinician if discomfort is persistent.",
    ],
  },
  {
    id: "aftercare-recovery-checkin",
    title: "Aftercare and Recovery Check-In",
    goal: "Close sessions with emotional and physical recovery support.",
    timeMinutes: 8,
    steps: [
      {
        id: "immediate-recovery",
        title: "Immediate Recovery",
        bodyMechanics: [
          "Choose a side-lying or seated supported rest position.",
          "Relax jaw, shoulders, and hands while breathing slowly.",
        ],
        comfortPrompts: [
          "Ask: What feels best right now, quiet or conversation?",
          "Ask: Is any area physically uncomfortable?",
        ],
        consentPrompt: "Do you both consent to continue this recovery check?",
        stopSwitchPrompt: "Switch to silent rest if conversation feels heavy.",
      },
      {
        id: "emotional-check",
        title: "Emotional Check",
        bodyMechanics: [
          "Keep posture open and non-threatening.",
          "Use gentle voice and avoid rushed questioning.",
        ],
        comfortPrompts: [
          "Share one positive note and one boundary for next time.",
          "Confirm whether additional support is needed.",
        ],
        consentPrompt: "Do you both feel emotionally settled to continue?",
        stopSwitchPrompt: "Stop and seek outside support if distress remains high.",
      },
      {
        id: "next-session-plan",
        title: "Next Session Plan",
        bodyMechanics: [
          "Write notes while seated with neutral wrist and shoulder support.",
          "Keep the planning window to two to three minutes.",
        ],
        comfortPrompts: [
          "Pick one position modification for next time.",
          "Pick one check-in prompt for the start of next time.",
        ],
        consentPrompt: "Do you consent to this plan for next time?",
        stopSwitchPrompt: "Pause planning if either person is uncertain.",
      },
    ],
    options: [
      "Quiet reset: rest + hydration + written notes.",
      "Talk reset: brief debrief + one shared improvement.",
    ],
    aftercare: [
      "Hydrate, stretch gently, and rest if needed.",
      "If emotional discomfort lasts, connect with a licensed professional.",
    ],
    safety: [
      "Coercion, trauma responses, or persistent pain require immediate stop.",
      "Use professional care pathways for unresolved distress.",
    ],
  },
];
