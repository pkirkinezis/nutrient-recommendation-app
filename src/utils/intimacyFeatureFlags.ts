import type { IntimacyFeatureFlags, UserPreferences } from "../types";

export const buildIntimacyFeatureFlags = (
  preferences: UserPreferences,
): IntimacyFeatureFlags => ({
  ageVerified: preferences.ageVerified,
  sexualContentOptIn: preferences.sexualContentOptIn,
  hiddenByDefault: true,
});

export const canAccessIntimacyContent = (flags: IntimacyFeatureFlags): boolean =>
  flags.ageVerified && flags.sexualContentOptIn;
