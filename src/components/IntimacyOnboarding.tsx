import { useMemo, useState } from "react";
import type { UserPreferences } from "../types";

interface IntimacyOnboardingProps {
  preferences: UserPreferences;
  onSave: (next: UserPreferences) => void;
}

const parseListInput = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const IntimacyOnboarding = ({ preferences, onSave }: IntimacyOnboardingProps) => {
  const [boundariesInput, setBoundariesInput] = useState(preferences.boundaries.join(", "));
  const [accessibilityInput, setAccessibilityInput] = useState(
    preferences.accessibilityNeeds.join(", "),
  );

  const canComplete = useMemo(
    () => preferences.ageVerified && preferences.sexualContentOptIn,
    [preferences.ageVerified, preferences.sexualContentOptIn],
  );

  const handleSave = () => {
    onSave({
      ...preferences,
      boundaries: parseListInput(boundariesInput),
      accessibilityNeeds: parseListInput(accessibilityInput),
    });
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <h3 className="text-lg font-bold text-amber-900">Intimacy & Sexual Wellness (18+)</h3>
      <p className="mt-2 text-sm text-amber-800">
        This section is educational and non-graphic. Content stays hidden until you complete both
        gates below.
      </p>

      <div className="mt-4 space-y-3">
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={preferences.ageVerified}
            onChange={(event) => onSave({ ...preferences, ageVerified: event.target.checked })}
            className="mt-1"
          />
          <span>I confirm I am 18+ years old.</span>
        </label>
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={preferences.sexualContentOptIn}
            disabled={!preferences.ageVerified}
            onChange={(event) =>
              onSave({
                ...preferences,
                sexualContentOptIn: event.target.checked,
              })
            }
            className="mt-1"
          />
          <span>I explicitly opt in to educational intimacy content.</span>
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Boundaries (comma separated)
          </label>
          <input
            type="text"
            value={boundariesInput}
            onChange={(event) => setBoundariesInput(event.target.value)}
            placeholder="e.g., slow pacing, frequent pauses"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Accessibility needs (comma separated)
          </label>
          <input
            type="text"
            value={accessibilityInput}
            onChange={(event) => setAccessibilityInput(event.target.value)}
            placeholder="e.g., lower-back support, seated options"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Save Preferences
        </button>
        <span className={`text-xs font-semibold ${canComplete ? "text-emerald-700" : "text-amber-700"}`}>
          {canComplete ? "Unlocked" : "Locked until both gates are complete"}
        </span>
      </div>
    </div>
  );
};
