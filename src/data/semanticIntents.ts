import type { IntentDatasetEntry } from "../types";

export const semanticIntentDataset: IntentDatasetEntry[] = [
  {
    id: "sleep-recovery",
    text: "I wake up tired and need deeper sleep and recovery.",
    goals: ["sleep", "recovery", "stress"],
    systems: ["nervous", "hormonal"],
  },
  {
    id: "focus-productivity",
    text: "I need sharper focus and sustained concentration at work.",
    goals: ["focus", "energy", "brain-health"],
    systems: ["nervous"],
  },
  {
    id: "stress-burnout",
    text: "High stress, anxious, and feeling burned out lately.",
    goals: ["stress", "mood", "energy"],
    systems: ["nervous", "hormonal"],
  },
  {
    id: "immunity-seasonal",
    text: "I want stronger immunity during cold and flu season.",
    goals: ["immunity"],
    systems: ["immune"],
  },
  {
    id: "gut-bloat",
    text: "Digestive discomfort, bloating, and irregularity.",
    goals: ["digestion"],
    systems: ["digestive"],
  },
  {
    id: "joint-inflammation",
    text: "Joint pain, stiffness, and inflammation after workouts.",
    goals: ["joint", "recovery"],
    systems: ["musculoskeletal", "immune"],
  },
  {
    id: "heart-metabolic",
    text: "Looking to support heart health and metabolic balance.",
    goals: ["cardiovascular", "metabolic"],
    systems: ["cardiovascular", "metabolic"],
  },
  {
    id: "hormone-balance",
    text: "Need help with hormone balance and reproductive health.",
    goals: ["hormones", "reproductive", "libido"],
    systems: ["hormonal", "reproductive"],
  },
  {
    id: "fitness-performance",
    text: "Increase workout performance, strength, and endurance.",
    goals: ["fitness", "energy", "recovery"],
    systems: ["musculoskeletal", "cardiovascular"],
  },
  {
    id: "skin-hair",
    text: "Improve skin clarity and support hair and nails.",
    goals: ["skin", "hair"],
    systems: ["integumentary"],
  },
];
