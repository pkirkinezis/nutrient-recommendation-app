import { DailyLog, LabResult, LocalSyncMeta, TrackingData, UserProfile } from '../types';

type Validator<T> = (value: unknown) => value is T;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';
const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(isString);
const isRating = (value: unknown): value is 1 | 2 | 3 | 4 | 5 =>
  isFiniteNumber(value) && Number.isInteger(value) && value >= 1 && value <= 5;
const isOptionalEnum = (value: unknown, allowed: readonly string[]): boolean =>
  value === undefined || (isString(value) && allowed.includes(value));

export function readStorageString(key: string, fallback = ''): string {
  if (!key || typeof window === 'undefined') return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function readStorageJson<T>(key: string, validator: Validator<T>, fallback: T): T {
  if (!key || typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return validator(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export const isStoredStringArray = (value: unknown): value is string[] => isStringArray(value);

export const isStoredUserProfile = (value: unknown): value is UserProfile => {
  if (!isRecord(value)) return false;
  const enumFields: Array<[unknown, readonly string[]]> = [
    [value.age, ['18-29', '30-44', '45-59', '60+']],
    [value.ageRange, ['under-30', '30-45', '45-60', 'over-60']],
    [value.sex, ['male', 'female', 'other']],
    [value.diet, ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo']],
    [value.dietType, ['omnivore', 'vegetarian', 'vegan', 'keto', 'other']],
    [value.trainingStyle, ['none', 'light', 'moderate', 'strength', 'endurance', 'mixed', 'yoga']],
    [value.activityLevel, ['sedentary', 'light', 'moderate', 'active', 'athlete']],
    [value.sleepQuality, ['poor', 'fair', 'good', 'excellent']],
    [value.stressLevel, ['low', 'moderate', 'high', 'very-high']],
    [value.caffeineIntake, ['none', 'low', 'moderate', 'high']],
    [value.pregnancyStatus, ['unknown', 'yes', 'no', 'not-applicable']],
    [value.breastfeedingStatus, ['unknown', 'yes', 'no', 'not-applicable']],
    [value.tryingToConceiveStatus, ['unknown', 'yes', 'no', 'not-applicable']],
    [value.medicationStatus, ['unknown', 'none', 'taking']],
    [value.formPreference, ['capsules', 'tablets', 'powders', 'liquids', 'gummies', 'any']],
    [value.budgetLevel, ['budget', 'moderate', 'premium']],
  ];
  if (enumFields.some(([field, allowed]) => !isOptionalEnum(field, allowed))) return false;
  if (value.weightKg !== undefined && !isFiniteNumber(value.weightKg)) return false;
  if (value.heightCm !== undefined && !isFiniteNumber(value.heightCm)) return false;
  if (value.preferNatural !== undefined && typeof value.preferNatural !== 'boolean') return false;
  return ['currentSupplements', 'healthConditions', 'medications'].every(
    (key) => value[key] === undefined || isStringArray(value[key])
  );
};

const isStoredDailyLog = (value: unknown): value is DailyLog => {
  if (!isRecord(value) || !isString(value.date)) return false;
  if (![value.sleepQuality, value.energyLevel, value.mood, value.focus, value.recovery].every(isRating)) return false;
  if (!isStringArray(value.supplementsTaken)) return false;
  if (value.id !== undefined && !isString(value.id)) return false;
  if (value.notes !== undefined && !isString(value.notes)) return false;
  if (value.sideEffects !== undefined && !isStringArray(value.sideEffects)) return false;
  return value.updatedAt === undefined || isFiniteNumber(value.updatedAt);
};

export const isStoredTrackingData = (value: unknown): value is TrackingData =>
  isRecord(value)
  && isString(value.startDate)
  && isStringArray(value.supplements)
  && Array.isArray(value.logs)
  && value.logs.every(isStoredDailyLog);

const isStoredLabResult = (value: unknown): value is LabResult =>
  isRecord(value)
  && isString(value.id)
  && isString(value.name)
  && isFiniteNumber(value.value)
  && isString(value.unit)
  && (value.range === undefined || isString(value.range))
  && (value.note === undefined || isString(value.note))
  && (value.date === undefined || isString(value.date));

export const isStoredLabResults = (value: unknown): value is LabResult[] =>
  Array.isArray(value) && value.every(isStoredLabResult);

export const isStoredSyncMeta = (value: unknown): value is LocalSyncMeta =>
  isRecord(value)
  && isFiniteNumber(value.profileUpdatedAt)
  && isFiniteNumber(value.stackUpdatedAt)
  && isFiniteNumber(value.trackingUpdatedAt)
  && isFiniteNumber(value.labsUpdatedAt);
