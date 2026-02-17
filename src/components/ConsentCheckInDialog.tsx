import type { ConsentResponse } from "../types";

interface ConsentCheckInDialogProps {
  isOpen: boolean;
  prompt: string;
  onRespond: (response: ConsentResponse) => void;
  onClose: () => void;
}

export const ConsentCheckInDialog = ({
  isOpen,
  prompt,
  onRespond,
  onClose,
}: ConsentCheckInDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-checkin-title"
        className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"
      >
        <h3 id="consent-checkin-title" className="text-lg font-bold text-gray-900">
          Consent Check-In
        </h3>
        <p className="mt-2 text-sm text-gray-600">{prompt}</p>
        <p className="mt-2 text-xs text-gray-500">
          Consent is continuous. You can continue, switch activity, or stop now.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onRespond("continue")}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => onRespond("switch")}
            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100"
          >
            Switch
          </button>
          <button
            type="button"
            onClick={() => onRespond("stop")}
            className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};
