import { useMemo, useState } from "react";
import type { ConsentCheckIn, ConsentResponse, Lesson } from "../types";
import { createConsentFlowState, resolveConsentFlow } from "../utils/intimacyConsent";
import { evaluateSafetyEscalation, type IntimacySafetyResult } from "../utils/intimacySafety";
import { ConsentCheckInDialog } from "./ConsentCheckInDialog";

interface IntimacyLessonPlayerProps {
  lessons: Lesson[];
  onConsentCheckIn: (entry: ConsentCheckIn) => void;
  onSafetyEscalation: (result: IntimacySafetyResult) => void;
}

export const IntimacyLessonPlayer = ({
  lessons,
  onConsentCheckIn,
  onSafetyEscalation,
}: IntimacyLessonPlayerProps) => {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [consentOpen, setConsentOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [checkInText, setCheckInText] = useState("");

  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) || null,
    [lessons, activeLessonId],
  );
  const activeStep = activeLesson ? activeLesson.steps[stepIndex] : null;

  const startLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setStepIndex(0);
    setStatusMessage(null);
    setCheckInText("");
  };

  const handleSafetyCheck = () => {
    if (!checkInText.trim()) {
      setStatusMessage("Add a short safety note before running the check.");
      return;
    }
    const result = evaluateSafetyEscalation(checkInText);
    if (!result.requiresEscalation) {
      setStatusMessage(
        "No escalation signals detected. Continue only if both people remain comfortable.",
      );
      return;
    }

    const severityLabel =
      result.severity === "emergency"
        ? "Emergency"
        : result.severity === "urgent"
          ? "Urgent safety"
          : "Safety";

    setStatusMessage(`${severityLabel} signal detected. Coaching stopped.`);
    setActiveLessonId(null);
    onSafetyEscalation(result);
  };

  const handleConsentResponse = (response: ConsentResponse) => {
    if (!activeLesson || !activeStep) return;

    const entry: ConsentCheckIn = {
      prompt: activeStep.consentPrompt,
      userResponse: response,
      timestamp: new Date().toISOString(),
      context: "lesson",
      contextId: activeLesson.id,
    };
    onConsentCheckIn(entry);
    setConsentOpen(false);

    const currentFlow = {
      ...createConsentFlowState(activeLesson.steps.length),
      stepIndex,
    };
    const resolved = resolveConsentFlow(currentFlow, response);

    if (resolved.status === "active") {
      setStepIndex(resolved.stepIndex);
      setStatusMessage("Consent confirmed. Continue at your own pace.");
      return;
    }

    if (resolved.status === "completed") {
      setStatusMessage("Lesson complete. Continue with aftercare and recovery notes.");
      setActiveLessonId(null);
      return;
    }

    if (resolved.status === "switched") {
      setStatusMessage("Session switched. Choose another lesson or comfort position.");
      setActiveLessonId(null);
      return;
    }

    setStatusMessage("Session stopped. You can return later.");
    setActiveLessonId(null);
  };

  if (!activeLesson || !activeStep) {
    return (
      <div className="space-y-4">
        <h4 className="text-base font-bold text-gray-900">Lesson Player</h4>
        <p className="text-sm text-gray-600">
          Choose an educational lesson focused on alignment, support, comfort, and pacing.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lesson.title}</p>
                  <p className="text-xs text-gray-600">{lesson.goal}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {lesson.timeMinutes} min • {lesson.steps.length} steps
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startLesson(lesson.id)}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Start Lesson
                </button>
              </div>
            </div>
          ))}
        </div>
        {statusMessage && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
            {statusMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{activeLesson.title}</p>
          <p className="text-xs text-gray-500">
            Step {stepIndex + 1} of {activeLesson.steps.length}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setActiveLessonId(null);
            setStatusMessage("Session stopped. You can return later.");
          }}
          className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
        >
          Stop
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-semibold text-gray-800">{activeStep.title}</h5>
          <ul className="mt-1 space-y-1 text-xs text-gray-600">
            {activeStep.bodyMechanics.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Comfort cues</p>
          <ul className="mt-1 space-y-1 text-xs text-gray-600">
            {activeStep.comfortPrompts.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-800">Stop / Switch Prompt</p>
          <p className="mt-1 text-xs text-amber-700">{activeStep.stopSwitchPrompt}</p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Safety check note (optional)
          </label>
          <textarea
            value={checkInText}
            onChange={(event) => setCheckInText(event.target.value)}
            placeholder="Share discomfort, pressure, or distress signals here."
            className="h-20 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleSafetyCheck}
            className="mt-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Run Safety Check
          </button>
        </div>

        <button
          type="button"
          onClick={() => setConsentOpen(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          Complete Step and Check Consent
        </button>
      </div>

      <ConsentCheckInDialog
        isOpen={consentOpen}
        prompt={activeStep.consentPrompt}
        onRespond={handleConsentResponse}
        onClose={() => setConsentOpen(false)}
      />
    </div>
  );
};
