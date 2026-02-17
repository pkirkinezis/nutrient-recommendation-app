import type { IntimacySafetyResult } from "../utils/intimacySafety";

interface IntimacySafetyEscalationProps {
  result: IntimacySafetyResult;
  onReset: () => void;
}

const severityLabelByLevel: Record<IntimacySafetyResult["severity"], string> = {
  none: "No Escalation",
  pause: "Safety Pause Required",
  urgent: "Urgent Safety Escalation",
  emergency: "Emergency Escalation",
};

const severityClassByLevel: Record<IntimacySafetyResult["severity"], string> = {
  none: "border-slate-300 bg-slate-50 text-slate-700",
  pause: "border-rose-300 bg-rose-50 text-rose-800",
  urgent: "border-amber-300 bg-amber-50 text-amber-800",
  emergency: "border-red-500 bg-red-50 text-red-900",
};

export const IntimacySafetyEscalation = ({ result, onReset }: IntimacySafetyEscalationProps) => {
  const panelClass = severityClassByLevel[result.severity] || severityClassByLevel.pause;
  const headline = severityLabelByLevel[result.severity] || severityLabelByLevel.pause;

  return (
    <div className={`rounded-2xl border p-5 ${panelClass}`}>
      <h3 className="text-lg font-bold">{headline}</h3>
      <p className="mt-2 text-sm">{result.reason || "A safety signal was detected."}</p>

      {result.severity === "emergency" ? (
        <p className="mt-3 text-sm font-semibold">
          Call local emergency services now if danger or severe symptoms are present.
        </p>
      ) : (
        <p className="mt-3 text-sm">
          Coaching is paused. Continue only after clear consent, stable comfort, and safety.
        </p>
      )}

      {result.immediateSteps.length > 0 && (
        <div className="mt-3 rounded-lg border border-current/20 bg-white/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide">Immediate Steps</p>
          <ul className="mt-1 space-y-1 text-xs">
            {result.immediateSteps.map((step) => (
              <li key={step}>- {step}</li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-3 space-y-1 text-xs">
        <li>- Seek clinical support for ongoing pain, trauma, or distress.</li>
        <li>- Use trauma-informed, consent-centered communication before resuming.</li>
        <li>- Resume this module only when both people feel safe and stable.</li>
      </ul>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-lg border border-current/30 bg-white px-3 py-2 text-xs font-semibold hover:bg-white/80"
      >
        Back to Intimacy Settings
      </button>
    </div>
  );
};
