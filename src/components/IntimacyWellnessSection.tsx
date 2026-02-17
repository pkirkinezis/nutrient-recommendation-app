import { useMemo, useState } from "react";
import type { ConsentCheckIn, UserPreferences } from "../types";
import { intimacyLessons } from "../data/intimacyLessons";
import { intimacyPositions } from "../data/intimacyPositions";
import { buildIntimacyFeatureFlags, canAccessIntimacyContent } from "../utils/intimacyFeatureFlags";
import { buildIntimacyExportPayload } from "../utils/intimacyStorage";
import type { IntimacySafetyResult } from "../utils/intimacySafety";
import { IntimacyOnboarding } from "./IntimacyOnboarding";
import { IntimacyLessonPlayer } from "./IntimacyLessonPlayer";
import { IntimacySafetyEscalation } from "./IntimacySafetyEscalation";
import { PositionsComfortLibrary } from "./PositionsComfortLibrary";

interface IntimacyWellnessSectionProps {
  preferences: UserPreferences;
  onPreferencesChange: (next: UserPreferences) => void;
  consentCheckIns: ConsentCheckIn[];
  onAddConsentCheckIn: (entry: ConsentCheckIn) => void;
  onDeleteAllData: () => void;
}

const parseListInput = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const IntimacyWellnessSection = ({
  preferences,
  onPreferencesChange,
  consentCheckIns,
  onAddConsentCheckIn,
  onDeleteAllData,
}: IntimacyWellnessSectionProps) => {
  const [view, setView] = useState<"lessons" | "positions" | "settings">("lessons");
  const [escalationResult, setEscalationResult] = useState<IntimacySafetyResult | null>(null);

  const flags = useMemo(() => buildIntimacyFeatureFlags(preferences), [preferences]);
  const unlocked = canAccessIntimacyContent(flags);

  const handleExport = () => {
    const payload = buildIntimacyExportPayload(preferences, consentCheckIns);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nutricompass-intimacy-data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (escalationResult) {
    return (
      <IntimacySafetyEscalation
        result={escalationResult}
        onReset={() => {
          setEscalationResult(null);
          setView("settings");
        }}
      />
    );
  }

  if (!unlocked) {
    return (
      <div className="space-y-4">
        <IntimacyOnboarding preferences={preferences} onSave={onPreferencesChange} />
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-800">Hidden by default</p>
          <p className="mt-1 text-xs text-slate-600">
            Lessons and position guidance stay hidden until age verification and explicit opt-in are
            both enabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-bold text-gray-900">Intimacy & Sexual Wellness</h3>
        <p className="mt-2 text-sm text-gray-600">
          Educational, non-graphic coaching focused on communication, body mechanics, comfort, and
          consent check-ins.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView("lessons")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              view === "lessons"
                ? "bg-emerald-600 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Lessons
          </button>
          <button
            type="button"
            onClick={() => setView("positions")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              view === "positions"
                ? "bg-emerald-600 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Positions & Comfort
          </button>
          <button
            type="button"
            onClick={() => setView("settings")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              view === "settings"
                ? "bg-emerald-600 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Privacy & Settings
          </button>
        </div>
      </div>

      {view === "lessons" && (
        <IntimacyLessonPlayer
          lessons={intimacyLessons}
          onConsentCheckIn={onAddConsentCheckIn}
          onSafetyEscalation={(result) => setEscalationResult(result)}
        />
      )}

      {view === "positions" && (
        <PositionsComfortLibrary
          positions={intimacyPositions}
          onConsentCheckIn={onAddConsentCheckIn}
          onSafetyEscalation={(result) => setEscalationResult(result)}
        />
      )}

      {view === "settings" && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="text-base font-bold text-gray-900">Privacy & Settings</h4>
          <p className="text-xs text-gray-600">
            Sensitive data is stored locally by default. Export and delete actions are available
            below.
          </p>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Boundaries (comma separated)
            </label>
            <input
              type="text"
              value={preferences.boundaries.join(", ")}
              onChange={(event) =>
                onPreferencesChange({
                  ...preferences,
                  boundaries: parseListInput(event.target.value),
                })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Accessibility needs (comma separated)
            </label>
            <input
              type="text"
              value={preferences.accessibilityNeeds.join(", ")}
              onChange={(event) =>
                onPreferencesChange({
                  ...preferences,
                  accessibilityNeeds: parseListInput(event.target.value),
                })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">Consent check-ins logged</p>
            <p className="mt-1 text-sm text-slate-800">{consentCheckIns.length}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Export Intimacy Data
            </button>
            <button
              type="button"
              onClick={onDeleteAllData}
              className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            >
              Delete Intimacy Data
            </button>
            <button
              type="button"
              onClick={() =>
                onPreferencesChange({
                  ...preferences,
                  sexualContentOptIn: false,
                })
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Turn Off Intimacy Content
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
