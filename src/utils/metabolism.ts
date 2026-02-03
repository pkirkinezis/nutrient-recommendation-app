import type { UserProfile } from "../types";

const AGE_ESTIMATES: Record<NonNullable<UserProfile["age"]>, number> = {
  "18-29": 24,
  "30-44": 37,
  "45-59": 52,
  "60+": 65,
};

const ACTIVITY_MULTIPLIERS: Record<NonNullable<UserProfile["activityLevel"]>, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export interface MetabolicMetrics {
  bmi: number | null;
  bmr: number | null;
  tdee: number | null;
}

const roundMetric = (value: number, decimals = 1): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

const estimateAge = (profile: UserProfile): number | null => {
  if (!profile.age) return null;
  return AGE_ESTIMATES[profile.age] ?? null;
};

export const calculateBMI = (weightKg?: number, heightCm?: number): number | null => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return null;
  }
  const heightMeters = heightCm / 100;
  const bmi = weightKg / (heightMeters * heightMeters);
  return roundMetric(bmi, 1);
};

export const calculateBMR = (profile: UserProfile): number | null => {
  if (!profile.weightKg || !profile.heightCm || !profile.sex) return null;
  const age = estimateAge(profile);
  if (!age) return null;

  const weight = profile.weightKg;
  const height = profile.heightCm;

  if (profile.sex === "male") {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }
  if (profile.sex === "female") {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
  return null;
};

export const calculateTDEE = (profile: UserProfile): number | null => {
  const bmr = calculateBMR(profile);
  if (!bmr) return null;
  const activity = profile.activityLevel ? ACTIVITY_MULTIPLIERS[profile.activityLevel] : null;
  if (!activity) return null;
  return Math.round(bmr * activity);
};

export const calculateMetabolicMetrics = (profile: UserProfile): MetabolicMetrics => {
  return {
    bmi: calculateBMI(profile.weightKg, profile.heightCm),
    bmr: calculateBMR(profile),
    tdee: calculateTDEE(profile),
  };
};
