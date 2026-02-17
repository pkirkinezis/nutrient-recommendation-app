import type { PositionEntry } from "../types";

export type PositionIllustrationKey =
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

export interface PositionIllustrationMeta {
  key: PositionIllustrationKey;
  caption: string;
  mechanicsFocus: string[];
}

const DEFAULT_ILLUSTRATION: PositionIllustrationMeta = {
  key: "supine-supported",
  caption: "Neutral support diagram with slow pacing and consent check-ins.",
  mechanicsFocus: [
    "Keep trunk and pelvis supported in neutral alignment.",
    "Use low-range movement with frequent comfort checks.",
  ],
};

export const positionIllustrationById: Record<string, PositionIllustrationMeta> = {
  "side-lying-support": {
    key: "side-lying-spooning",
    caption: "Side-lying setup with stacked support and neutral spine.",
    mechanicsFocus: [
      "Support head, waist, and knees to reduce rotational strain.",
      "Keep hips stacked and pace changes gradual.",
    ],
  },
  "side-lying-spooning-variation": {
    key: "side-lying-spooning",
    caption: "Side-lying variation emphasizing shared support and low strain.",
    mechanicsFocus: [
      "Keep both trunks aligned and avoid forced twisting.",
      "Use short check-ins before changing pace or angle.",
    ],
  },
  "side-lying-face-to-face-variation": {
    key: "side-lying-face-to-face",
    caption: "Face-to-face side-lying for communication and gentle pacing.",
    mechanicsFocus: [
      "Keep neck and shoulders relaxed with pillow support.",
      "Use small range adjustments and pause on discomfort.",
    ],
  },
  "seated-face-to-face": {
    key: "seated-face-to-face",
    caption: "Upright seated posture with back support and controlled pacing.",
    mechanicsFocus: [
      "Maintain a tall spine with supported hips.",
      "Center weight and avoid lower-back collapse.",
    ],
  },
  "semi-reclined-lotus-support": {
    key: "reclined-supported",
    caption: "Semi-reclined setup with support under trunk and hips.",
    mechanicsFocus: [
      "Increase recline if lumbar tension rises.",
      "Use bolsters to keep hips in a pain-free range.",
    ],
  },
  "reverse-facing-seated-support": {
    key: "seated-reverse",
    caption: "Seated reverse-facing variant with lumbar support focus.",
    mechanicsFocus: [
      "Keep rib cage stacked over pelvis.",
      "Limit abrupt trunk rotation and reset often.",
    ],
  },
  "reclined-pillows": {
    key: "reclined-supported",
    caption: "Reclined pillow-supported setup for fatigue-aware pacing.",
    mechanicsFocus: [
      "Distribute load through back, hips, and knees.",
      "Recheck pressure points after each movement change.",
    ],
  },
  "supported-top-led-control": {
    key: "top-forward-supported",
    caption: "Supported top-led control with adjustable angle and range.",
    mechanicsFocus: [
      "Use a supported base and small range transitions.",
      "Pause every minute for comfort and consent confirmation.",
    ],
  },
  "missionary-supported-pelvis-elevated": {
    key: "supine-supported",
    caption: "Supported supine posture with controlled pelvis elevation.",
    mechanicsFocus: [
      "Use small support under hips to avoid overextension.",
      "Lower support height if low-back pressure increases.",
    ],
  },
  "coital-alignment-technique-supported": {
    key: "supine-supported",
    caption: "Alignment-focused supported posture with low-amplitude pacing.",
    mechanicsFocus: [
      "Stabilize pelvis and keep lower back supported.",
      "Use synchronized breathing and shallow range changes.",
    ],
  },
  "edge-of-bed-assisted": {
    key: "edge-supported",
    caption: "Edge-supported alignment with stable footing and height control.",
    mechanicsFocus: [
      "Keep feet grounded and trunk supported.",
      "Reset stance when balance or comfort changes.",
    ],
  },
  "chair-supported-neutral": {
    key: "chair-supported",
    caption: "Chair-supported neutral posture with low effort demand.",
    mechanicsFocus: [
      "Use backrest contact to offload lumbar strain.",
      "Keep feet grounded and intervals short.",
    ],
  },
  "hip-neutral-pillow-bridge": {
    key: "supine-supported",
    caption: "Hip-neutral support using pillows to reduce joint strain.",
    mechanicsFocus: [
      "Keep hips in mid-range without forcing flexion/extension.",
      "Lower support if pelvic pressure rises.",
    ],
  },
  "knee-supported-side-angle": {
    key: "side-lying-face-to-face",
    caption: "Side-angle variation with extra knee and hip support.",
    mechanicsFocus: [
      "Keep pelvis level and reduce twisting load.",
      "Increase knee support height if hip strain appears.",
    ],
  },
  "missionary-low-extension-a": {
    key: "supine-supported",
    caption: "Low-extension supine variant with symptom-guided pacing.",
    mechanicsFocus: [
      "Limit lumbar end-range and keep rib-to-pelvis stacking.",
      "Use short rounds with breathing resets.",
    ],
  },
  "missionary-low-extension-b": {
    key: "supine-supported",
    caption: "Paced low-extension supine variant with frequent resets.",
    mechanicsFocus: [
      "Avoid abrupt range shifts and track symptom trend.",
      "Transition to side support if discomfort persists.",
    ],
  },
  "quadruped-supported-a": {
    key: "quadruped-supported",
    caption: "Quadruped support variant using forearm/pillow load reduction.",
    mechanicsFocus: [
      "Keep lumbar curve neutral and movement low amplitude.",
      "Raise torso support to reduce extension load.",
    ],
  },
  "quadruped-supported-b": {
    key: "quadruped-supported",
    caption: "Quadruped supported variant with elevated torso assistance.",
    mechanicsFocus: [
      "Use even limb loading with trunk bracing.",
      "Switch positions quickly if tension trends upward.",
    ],
  },
  "supported-standing-wall-shift": {
    key: "standing-wall-supported",
    caption: "Standing wall-supported setup for balance-aware pacing.",
    mechanicsFocus: [
      "Keep knees soft and pelvis neutral.",
      "Use short intervals and transition early if fatigue appears.",
    ],
  },
  "counter-height-forearm-supported": {
    key: "standing-counter-supported",
    caption: "Forearm-supported standing alignment using stable counter height.",
    mechanicsFocus: [
      "Use forearm contact to reduce lumbar load.",
      "Distribute weight evenly and keep ranges controlled.",
    ],
  },
  "low-load-seated-knee-support": {
    key: "chair-supported",
    caption: "Low-load seated posture with knee and hip cushioning.",
    mechanicsFocus: [
      "Use back support and neutral neck posture.",
      "Keep rounds brief with explicit stop or switch prompts.",
    ],
  },
  "top-sideways-supported": {
    key: "top-sideways-supported",
    caption: "Top-led sideways variation with lateral support bolsters.",
    mechanicsFocus: [
      "Limit trunk rotation and keep transitions deliberate.",
      "Increase side support when joint strain appears.",
    ],
  },
  "top-facing-forward-supported": {
    key: "top-forward-supported",
    caption: "Top-led forward-facing variation with stable trunk support.",
    mechanicsFocus: [
      "Keep trunk stacked and pace changes gradual.",
      "Reduce amplitude if pressure increases.",
    ],
  },
  "top-facing-backward-supported": {
    key: "top-backward-supported",
    caption: "Top-led backward-facing variation with balance support.",
    mechanicsFocus: [
      "Use stable contact points and avoid hyperextension.",
      "Shorten rounds and reset if balance drops.",
    ],
  },
  "intimacy-rest-reset": {
    key: "rest-reset",
    caption: "Recovery diagram for rest, reassurance, and symptom reset.",
    mechanicsFocus: [
      "Prioritize calm breathing and muscle release.",
      "Resume only after mutual consent and symptom stabilization.",
    ],
  },
};

export const getPositionIllustrationMeta = (position: PositionEntry): PositionIllustrationMeta =>
  positionIllustrationById[position.id] ?? DEFAULT_ILLUSTRATION;

export const hasIllustrationForEveryPosition = (positions: PositionEntry[]): boolean =>
  positions.every((position) => positionIllustrationById[position.id]);
