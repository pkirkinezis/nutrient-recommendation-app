import { useEffect, useMemo, useState } from 'react';
import { Recommendation, Supplement } from '../types';
import { formGuidance } from '../data/supplements';

interface SupplementDetailModalProps {
  supplement: Supplement | null;
  isOpen: boolean;
  onClose: () => void;
  weightKg?: number;
  recommendation?: Recommendation;
}

const typeStyles: Record<Supplement['type'], { label: string; color: string }> = {
  'vitamin': { label: 'Vitamin', color: 'bg-amber-100 text-amber-700' },
  'mineral': { label: 'Mineral', color: 'bg-blue-100 text-blue-700' },
  'herb': { label: 'Herb', color: 'bg-green-100 text-green-700' },
  'tea': { label: 'Tea Herb', color: 'bg-teal-100 text-teal-700' },
  'amino-acid': { label: 'Amino Acid', color: 'bg-purple-100 text-purple-700' },
  'ayurvedic': { label: 'Ayurvedic', color: 'bg-orange-100 text-orange-700' },
  'mushroom': { label: 'Mushroom', color: 'bg-rose-100 text-rose-700' },
  'probiotic': { label: 'Probiotic', color: 'bg-cyan-100 text-cyan-700' },
  'fatty-acid': { label: 'Fatty Acid', color: 'bg-indigo-100 text-indigo-700' },
  'protein': { label: 'Protein', color: 'bg-pink-100 text-pink-700' },
  'performance': { label: 'Performance', color: 'bg-red-100 text-red-700' },
  'enzyme': { label: 'Enzyme', color: 'bg-lime-100 text-lime-700' },
  'antioxidant': { label: 'Antioxidant', color: 'bg-violet-100 text-violet-700' },
  'other': { label: 'Supplement', color: 'bg-gray-100 text-gray-700' },
};

const evidenceInfo: Record<Supplement['evidence'], { label: string; color: string; description: string }> = {
  strong: {
    label: 'Strong Evidence',
    color: 'bg-emerald-100 text-emerald-700',
    description: 'Multiple human clinical trials support this',
  },
  moderate: {
    label: 'Moderate Evidence',
    color: 'bg-yellow-100 text-yellow-700',
    description: 'Some clinical research supports this',
  },
  limited: {
    label: 'Traditional/Limited',
    color: 'bg-gray-100 text-gray-600',
    description: 'Primarily traditional use or early research',
  },
};

export function SupplementDetailModal({
  supplement,
  isOpen,
  onClose,
  weightKg,
  recommendation,
}: SupplementDetailModalProps) {
  const [showSafety, setShowSafety] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowSafety(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const weightBasedDose = useMemo(() => {
    if (!supplement?.dosagePerKg || !weightKg) {
      return null;
    }
    return {
      min: supplement.dosagePerKg.min * weightKg,
      max: supplement.dosagePerKg.max * weightKg,
      unit: supplement.dosagePerKg.unit,
      note: supplement.dosagePerKg.note,
    };
  }, [supplement, weightKg]);

  if (!isOpen || !supplement) {
    return null;
  }

  const typeStyle = typeStyles[supplement.type];
  const evidence = evidenceInfo[supplement.evidence];
  const formGuide = formGuidance[supplement.id];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 py-10">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplement-detail-title"
        className="relative w-full max-w-3xl rounded-3xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="space-y-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full px-2 py-1"
            >
              ← Back to results
            </button>
            <h2 id="supplement-detail-title" className="text-2xl font-semibold text-gray-900">
              {supplement.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeStyle.color}`}>
                {typeStyle.label}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${evidence.color}`}>
                {evidence.label}
              </span>
              {recommendation && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  recommendation.priority === 'essential'
                    ? 'bg-emerald-500 text-white'
                    : recommendation.priority === 'beneficial'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {recommendation.priority}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close supplement details"
            className="h-10 w-10 rounded-full border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
            <p className="text-sm text-gray-600">{supplement.description}</p>
            <div className="flex flex-wrap gap-2">
              {supplement.benefits.map((benefit) => (
                <span key={benefit} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {benefit}
                </span>
              ))}
            </div>
            {supplement.traditionalUse && (
              <div className="rounded-2xl bg-orange-50 p-4 text-sm text-orange-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 mb-1">Traditional use</p>
                {supplement.traditionalUse}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-emerald-800">Dosage & Timing</h3>
              <p className="text-xs text-emerald-600">Personalized guidance with suggested timing.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-3">
                <p className="text-xs font-semibold text-gray-600">Suggested dosage</p>
                <p className="text-sm text-gray-800">{supplement.dosage}</p>
                {weightBasedDose && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Est. {weightBasedDose.min.toFixed(1)}-{weightBasedDose.max.toFixed(1)}{weightBasedDose.unit} for {weightKg}kg.
                  </p>
                )}
                {weightBasedDose?.note && (
                  <p className="text-xs text-emerald-600">{weightBasedDose.note}</p>
                )}
              </div>
              <div className="rounded-xl bg-white p-3">
                <p className="text-xs font-semibold text-gray-600">Timing</p>
                <p className="text-sm text-gray-800">{supplement.timing}</p>
                <p className="text-xs text-gray-500 mt-1">{supplement.timeframe}</p>
              </div>
            </div>
          </section>

          {supplement.mechanism && (
            <section className="rounded-2xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-1">Mechanism</h3>
              <p className="text-sm text-slate-600">{supplement.mechanism}</p>
            </section>
          )}

          {supplement.foodSources && supplement.foodSources.length > 0 && (
            <section className="rounded-2xl bg-green-50 p-4">
              <h3 className="text-sm font-semibold text-green-700 mb-1">Food Sources</h3>
              <p className="text-sm text-green-800">{supplement.foodSources.join(', ')}</p>
            </section>
          )}

          {supplement.synergies && supplement.synergies.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Works Well With</h3>
              <div className="flex flex-wrap gap-2">
                {supplement.synergies.map((syn) => (
                  <span key={syn} className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                    {syn}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setShowSafety((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-2xl"
            >
              Safety & Interactions
              <span className={`text-xs ${showSafety ? 'text-emerald-600' : 'text-slate-400'}`}>
                {showSafety ? 'Hide' : 'Expand'}
              </span>
            </button>
            {showSafety && (
              <div className="space-y-3 border-t border-slate-100 px-4 pb-4">
                {supplement.cautions && supplement.cautions.length > 0 && (
                  <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-1">Cautions</p>
                    <ul className="space-y-1">
                      {supplement.cautions.map((caution) => (
                        <li key={caution}>• {caution}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {supplement.drugInteractions && supplement.drugInteractions.length > 0 && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">Drug interactions</p>
                    {supplement.drugInteractions.join(', ')}
                  </div>
                )}
                {supplement.avoidIf && supplement.avoidIf.length > 0 && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">Avoid if</p>
                    <ul className="space-y-1">
                      {supplement.avoidIf.map((avoid) => (
                        <li key={avoid}>• {avoid}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {supplement.cycleTiming && (
                  <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Cycling</p>
                    {supplement.cycleTiming}
                  </div>
                )}
                {formGuide && (
                  <div className="rounded-xl bg-purple-50 p-3 text-sm text-purple-700">
                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 mb-2">Form intelligence</p>
                    <div className="space-y-2">
                      {formGuide.forms.slice(0, 4).map((form) => (
                        <div key={form.name} className={`rounded-lg px-2 py-1 text-xs ${form.avoid ? 'bg-red-100 text-red-700' : 'bg-white text-gray-700'}`}>
                          <span className="font-medium">{form.name}</span>
                          <span className="ml-1 text-gray-500">({form.bioavailability})</span>
                          {form.avoid && <span className="ml-1 text-red-600">⚠️</span>}
                          <p className="text-[11px] text-gray-500">{form.bestFor}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs">
                      <p><span className="font-semibold text-green-700">Enhancers:</span> {formGuide.enhancers.join(', ')}</p>
                      {formGuide.blockers.length > 0 && (
                        <p><span className="font-semibold text-red-600">Blockers:</span> {formGuide.blockers.join(', ')}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Evidence Level</h3>
            <p className="text-sm text-slate-600">{evidence.description}</p>
          </section>

          {supplement.evidenceSources && supplement.evidenceSources.length > 0 && (
            <section className="rounded-2xl border border-slate-100 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Evidence Sources</h3>
              <ul className="space-y-1 text-xs text-slate-600">
                {supplement.evidenceSources.map((source) => (
                  <li key={source.url}>
                    <a className="text-emerald-700 hover:underline" href={source.url} target="_blank" rel="noreferrer">
                      {source.title}
                    </a>
                    {source.note && <span className="text-slate-400"> — {source.note}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
