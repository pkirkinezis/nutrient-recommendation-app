import type { ConsentCheckIn, UserPreferences } from "../types";

export const INTIMACY_STORAGE_KEYS = {
  preferences: "nutricompass_intimacy_preferences",
  consentCheckIns: "nutricompass_intimacy_consent_checkins",
} as const;

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  ageVerified: false,
  sexualContentOptIn: false,
  boundaries: [],
  accessibilityNeeds: [],
};

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const loadIntimacyPreferences = (): UserPreferences => {
  if (typeof window === "undefined") return DEFAULT_USER_PREFERENCES;
  const stored = parseJson<Partial<UserPreferences>>(
    localStorage.getItem(INTIMACY_STORAGE_KEYS.preferences),
    {},
  );
  return {
    ...DEFAULT_USER_PREFERENCES,
    ...stored,
    boundaries: Array.isArray(stored.boundaries) ? stored.boundaries : [],
    accessibilityNeeds: Array.isArray(stored.accessibilityNeeds) ? stored.accessibilityNeeds : [],
  };
};

export const saveIntimacyPreferences = (preferences: UserPreferences): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTIMACY_STORAGE_KEYS.preferences, JSON.stringify(preferences));
};

export const loadIntimacyConsentCheckIns = (): ConsentCheckIn[] => {
  if (typeof window === "undefined") return [];
  const stored = parseJson<ConsentCheckIn[]>(
    localStorage.getItem(INTIMACY_STORAGE_KEYS.consentCheckIns),
    [],
  );
  return Array.isArray(stored) ? stored : [];
};

export const saveIntimacyConsentCheckIns = (entries: ConsentCheckIn[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTIMACY_STORAGE_KEYS.consentCheckIns, JSON.stringify(entries));
};

export interface IntimacyExportPayload {
  exportedAt: string;
  preferences: UserPreferences;
  consentCheckIns: ConsentCheckIn[];
}

export const buildIntimacyExportPayload = (
  preferences: UserPreferences,
  consentCheckIns: ConsentCheckIn[],
): IntimacyExportPayload => ({
  exportedAt: new Date().toISOString(),
  preferences,
  consentCheckIns,
});

export const clearIntimacyLocalData = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(INTIMACY_STORAGE_KEYS.preferences);
  localStorage.removeItem(INTIMACY_STORAGE_KEYS.consentCheckIns);
};
