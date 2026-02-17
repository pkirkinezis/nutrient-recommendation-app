export interface ComfortGuidelineSource {
  label: string;
  url: string;
}

export interface ComfortGuideline {
  id: string;
  title: string;
  summary: string;
  concernTags: string[];
  practicalActions: string[];
  escalateWhen: string[];
  relatedPositionIds: string[];
  sources: ComfortGuidelineSource[];
}

const SOURCES = {
  mayoPainfulIntercourse: {
    label: "Mayo Clinic: Painful intercourse",
    url: "https://www.mayoclinic.org/symptoms/painful-intercourse/basics/definition/sym-20050639",
  },
  aafpDyspareunia2021: {
    label: "AAFP: Dyspareunia in Women (2021)",
    url: "https://www.aafp.org/pubs/afp/issues/2021/0515/p597.html",
  },
  pubmedPelvicRehab2019: {
    label: "PubMed: Pelvic floor rehab and sexual function (2019)",
    url: "https://pubmed.ncbi.nlm.nih.gov/31286158/",
  },
  pubmedPelvicDysfunction2023: {
    label: "PubMed: Sexual function in pelvic floor dysfunction (2023)",
    url: "https://pubmed.ncbi.nlm.nih.gov/37727447/",
  },
  pubmedMaleBiomech2014: {
    label: "PubMed: Male coital spine biomechanics (2014)",
    url: "https://pubmed.ncbi.nlm.nih.gov/24342991/",
  },
  pubmedFemaleBiomech2014: {
    label: "PubMed: Female coital spine biomechanics (2014)",
    url: "https://pubmed.ncbi.nlm.nih.gov/24562134/",
  },
  pubmedSexDisabilityFramework2024: {
    label: "PubMed: Sexual disability in low back pain framework (2024)",
    url: "https://pubmed.ncbi.nlm.nih.gov/38200986/",
  },
  nhsPainDuringSex: {
    label: "NHS: Pain during sex",
    url: "https://www.nhs.uk/conditions/pain-during-sex/",
  },
  clevelandEndometriosis: {
    label: "Cleveland Clinic: Sex positions with endometriosis",
    url: "https://health.clevelandclinic.org/best-sex-positions-for-endometriosis",
  },
  mdpiPainPositionFramework2025: {
    label: "MDPI (2025): Position recommendation framework for painful sex",
    url: "https://www.mdpi.com/1660-4601/22/4/550",
  },
} as const;

export const intimacyComfortGuidelines: ComfortGuideline[] = [
  {
    id: "pace-angle-control",
    title: "Pace and Angle Control",
    summary:
      "Clinical guidance supports slow pacing, controlled angle/range changes, and continuous communication when discomfort appears.",
    concernTags: ["gentle-depth-control", "communication-focused", "dryness-sensitive"],
    practicalActions: [
      "Use positions with easy angle control and stable support points.",
      "Pause frequently for comfort ratings and adjust immediately.",
      "Prefer slow transitions over abrupt movement changes.",
    ],
    escalateWhen: [
      "Discomfort persists despite support and pacing changes.",
      "Pain intensity increases across repeated sessions.",
    ],
    relatedPositionIds: [
      "supported-top-led-control",
      "reclined-pillows",
      "side-lying-support",
      "missionary-supported-pelvis-elevated",
      "coital-alignment-technique-supported",
      "reverse-facing-seated-support",
    ],
    sources: [SOURCES.mayoPainfulIntercourse, SOURCES.aafpDyspareunia2021, SOURCES.mdpiPainPositionFramework2025],
  },
  {
    id: "pelvic-floor-relaxation-first",
    title: "Pelvic Floor Relaxation First",
    summary:
      "Evidence supports pelvic floor downtraining, breath-led relaxation, and low-load positioning when pelvic floor tension is present.",
    concernTags: ["pelvic-floor-tension", "fatigue-aware", "gentle-depth-control"],
    practicalActions: [
      "Start with breathing and muscle downtraining before movement progression.",
      "Use side-lying or reclined support as default low-load entries.",
      "Escalate to pelvic floor physiotherapy referral for recurrent symptoms.",
    ],
    escalateWhen: [
      "Guarding, anxiety, or pain remains despite low-load positioning.",
      "Distress or pain remains after repeated sessions.",
    ],
    relatedPositionIds: [
      "side-lying-support",
      "hip-neutral-pillow-bridge",
      "reclined-pillows",
      "chair-supported-neutral",
      "knee-supported-side-angle",
      "side-lying-face-to-face-variation",
      "semi-reclined-lotus-support",
    ],
    sources: [SOURCES.pubmedPelvicRehab2019, SOURCES.pubmedPelvicDysfunction2023, SOURCES.nhsPainDuringSex],
  },
  {
    id: "low-back-aware-mechanics",
    title: "Low-Back Aware Body Mechanics",
    summary:
      "Biomechanical studies show spinal load differs by posture, supporting individualized position selection for low-back sensitivity.",
    concernTags: ["low-back-sensitive", "balance-support", "short-interval"],
    practicalActions: [
      "Use neutral-spine support and avoid repeatedly painful motion directions.",
      "Prefer positions that reduce lumbar extension if extension-sensitive.",
      "Use short intervals with planned reset breaks.",
    ],
    escalateWhen: [
      "Back symptoms radiate, worsen, or remain elevated after activity.",
      "No improvement after repeated posture-specific adjustments.",
    ],
    relatedPositionIds: [
      "missionary-low-extension-a",
      "missionary-low-extension-b",
      "quadruped-supported-a",
      "quadruped-supported-b",
      "side-lying-support",
      "edge-of-bed-assisted",
      "chair-supported-neutral",
      "supported-standing-wall-shift",
      "counter-height-forearm-supported",
    ],
    sources: [
      SOURCES.pubmedMaleBiomech2014,
      SOURCES.pubmedFemaleBiomech2014,
      SOURCES.pubmedSexDisabilityFramework2024,
      SOURCES.mdpiPainPositionFramework2025,
    ],
  },
  {
    id: "dryness-and-tissue-comfort",
    title: "Lubrication and Tissue Comfort",
    summary:
      "Dryness and tissue irritation are common pain contributors; slower transitions and proactive lubrication reduce friction-related discomfort.",
    concernTags: ["dryness-sensitive", "gentle-depth-control", "communication-focused"],
    practicalActions: [
      "Use lubrication proactively when dryness is present.",
      "Extend warm-up and reduce speed of transitions.",
      "Use supportive, low-friction positions during symptom flares.",
    ],
    escalateWhen: [
      "Burning, tearing sensation, or bleeding symptoms continue.",
      "Discomfort remains despite lubrication and pacing changes.",
    ],
    relatedPositionIds: [
      "supported-top-led-control",
      "reclined-pillows",
      "side-lying-spooning-variation",
      "side-lying-face-to-face-variation",
      "hip-neutral-pillow-bridge",
      "coital-alignment-technique-supported",
      "semi-reclined-lotus-support",
    ],
    sources: [SOURCES.nhsPainDuringSex, SOURCES.mayoPainfulIntercourse, SOURCES.aafpDyspareunia2021],
  },
  {
    id: "endometriosis-comfort-adaptations",
    title: "Endometriosis-Oriented Adaptations",
    summary:
      "Clinical guidance for endometriosis suggests controlled-depth, side-lying, supported top-led options, and posture changes that reduce pelvic pressure.",
    concernTags: ["pelvic-floor-tension", "gentle-depth-control", "fatigue-aware", "low-back-sensitive"],
    practicalActions: [
      "Prioritize top-led or side-lying options with easy range control.",
      "Use pillows to lower pelvic pressure and support spinal alignment.",
      "Favor shorter sessions with explicit stop/switch check-ins.",
    ],
    escalateWhen: [
      "Pelvic pain worsens or persists after adjustments.",
      "Emotional distress remains elevated after sessions.",
    ],
    relatedPositionIds: [
      "supported-top-led-control",
      "side-lying-support",
      "side-lying-spooning-variation",
      "missionary-supported-pelvis-elevated",
      "quadruped-supported-a",
      "edge-of-bed-assisted",
      "chair-supported-neutral",
      "semi-reclined-lotus-support",
    ],
    sources: [SOURCES.clevelandEndometriosis, SOURCES.mdpiPainPositionFramework2025],
  },
  {
    id: "when-to-refer",
    title: "When to Refer Out",
    summary:
      "Persistent pain, trauma responses, or coercion signals require professional support and immediate discontinuation of in-app coaching.",
    concernTags: ["communication-focused", "trauma-aware", "safety-escalation"],
    practicalActions: [
      "Stop coaching when coercion, trauma cues, or persistent pain appears.",
      "Offer pelvic health, sexual health, or mental health referral pathways.",
      "Resume only when safety and consent stability are restored.",
    ],
    escalateWhen: [
      "Coercion, pressure, or fear is disclosed.",
      "Trauma triggers or persistent distress are present.",
    ],
    relatedPositionIds: [
      "side-lying-support",
      "chair-supported-neutral",
      "intimacy-rest-reset",
    ],
    sources: [SOURCES.aafpDyspareunia2021, SOURCES.nhsPainDuringSex, SOURCES.mayoPainfulIntercourse],
  },
];
