import { useCallback, useEffect, useMemo, useState } from 'react';
import { Recommendation, Supplement } from '../types';
import { formGuidance } from '../data/supplements';
import { getSupplementKnowledgeById, knowledgeDisclaimers } from '../data/supplementKnowledge';
import NutrientFoodSources from './NutrientFoodSources';
import { SupplementFoodLookup } from './SupplementFoodLookup';

interface SupplementDetailModalProps {
  supplement: Supplement | null;
  isOpen: boolean;
  onClose: () => void;
  weightKg?: number;
  recommendation?: Recommendation;
}

const typeStyles: Record<Supplement['type'], { label: string; color: string }> = {
  vitamin: { label: 'Vitamin', color: 'bg-amber-100 text-amber-700' },
  mineral: { label: 'Mineral', color: 'bg-blue-100 text-blue-700' },
  herb: { label: 'Herb', color: 'bg-green-100 text-green-700' },
  tea: { label: 'Tea Herb', color: 'bg-teal-100 text-teal-700' },
  'amino-acid': { label: 'Amino Acid', color: 'bg-purple-100 text-purple-700' },
  ayurvedic: { label: 'Ayurvedic', color: 'bg-orange-100 text-orange-700' },
  mushroom: { label: 'Mushroom', color: 'bg-rose-100 text-rose-700' },
  probiotic: { label: 'Probiotic', color: 'bg-cyan-100 text-cyan-700' },
  'fatty-acid': { label: 'Fatty Acid', color: 'bg-indigo-100 text-indigo-700' },
  protein: { label: 'Protein', color: 'bg-pink-100 text-pink-700' },
  performance: { label: 'Performance', color: 'bg-red-100 text-red-700' },
  enzyme: { label: 'Enzyme', color: 'bg-lime-100 text-lime-700' },
  antioxidant: { label: 'Antioxidant', color: 'bg-violet-100 text-violet-700' },
  other: { label: 'Supplement', color: 'bg-gray-100 text-gray-700' },
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

const normalizeComparableText = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');

const uniqueNormalized = (values: string[]): string[] => {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const value of values) {
    const normalized = normalizeComparableText(value);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    deduped.push(value);
  }

  return deduped;
};

export function SupplementDetailModal({
  supplement,
  isOpen,
  onClose,
  weightKg,
  recommendation,
}: SupplementDetailModalProps) {
  const [showSafety, setShowSafety] = useState(false);

  const handleClose = useCallback((): void => {
    setShowSafety(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

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
  const knowledge = getSupplementKnowledgeById(supplement.id);

  const descriptionNormalized = normalizeComparableText(supplement.description);
  const knowledgeSummary = knowledge?.evidenceSummary?.trim() || '';
  const showKnowledgeSummary =
    knowledgeSummary.length > 0 && normalizeComparableText(knowledgeSummary) !== descriptionNormalized;

  const overviewChips = uniqueNormalized(
    knowledge?.typicalUseCases.length ? knowledge.typicalUseCases : supplement.benefits
  );
  const overviewChipLabel = knowledge?.typicalUseCases.length ? 'Typical use-cases' : 'Highlights';

  const supplementSafetyText = uniqueNormalized([
    ...(supplement.cautions || []),
    ...(supplement.avoidIf || []),
    ...(supplement.drugInteractions || []).map(
      (interaction) => `Potential medication interactions include: ${interaction}.`
    ),
  ]);

  const knowledgeSafetyNotes = uniqueNormalized(
    (knowledge?.safetyNotes || []).filter(
      (note) =>
        !supplementSafetyText.some(
          (existing) => normalizeComparableText(existing) === normalizeComparableText(note)
        )
    )
  );

  const combinedSources = (() => {
    const entries: Array<{ title: string; url: string; details?: string }> = [];

    for (const source of supplement.evidenceSources || []) {
      entries.push({
        title: source.title,
        url: source.url,
        details: source.note,
      });
    }

    for (const citation of knowledge?.citations || []) {
      entries.push({
        title: citation.title,
        url: citation.url,
        details: `${citation.publisher} (accessed ${citation.accessedAt})`,
      });
    }

    const seen = new Set<string>();
    const deduped: Array<{ title: string; url: string; details?: string }> = [];

    for (const entry of entries) {
      const key = `${normalizeComparableText(entry.title)}|${entry.url.toLowerCase().trim()}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      deduped.push(entry);
    }

    return deduped;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 py-10">
      <div className="absolute inset-0" onClick={handleClose} aria-hidden="true" />
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
              onClick={handleClose}
              className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              &lt;- Back to results
            </button>
            <h2 id="supplement-detail-title" className="text-2xl font-semibold text-gray-900">
              {supplement.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyle.color}`}>
                {typeStyle.label}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${evidence.color}`}>
                {evidence.label}
              </span>
              {recommendation && (
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    recommendation.priority === 'essential'
                      ? 'bg-emerald-500 text-white'
                      : recommendation.priority === 'beneficial'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {recommendation.priority}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close supplement details"
            className="h-10 w-10 rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            X
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{knowledge ? 'Overview & Evidence' : 'Overview'}</h3>
              {knowledge?.evidenceStrengthTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium capitalize text-slate-600"
                >
                  {tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600">{supplement.description}</p>
            {showKnowledgeSummary && (
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-slate-800">Evidence summary:</span> {knowledgeSummary}
              </p>
            )}
            {overviewChips.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{overviewChipLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {overviewChips.map((chip) => (
                    <span key={chip} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {supplement.traditionalUse && (
              <div className="rounded-2xl bg-orange-50 p-4 text-sm text-orange-800">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">Traditional use</p>
                {supplement.traditionalUse}
              </div>
            )}
            {knowledge && <p className="text-xs text-slate-500">{knowledgeDisclaimers.medical}</p>}
          </section>

          <section className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div>
              <h3 className="text-sm font-semibold text-emerald-800">Dosage & Timing</h3>
              <p className="text-xs text-emerald-600">Personalized guidance with suggested timing.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-3">
                <p className="text-xs font-semibold text-gray-600">Suggested dosage</p>
                <p className="text-sm text-gray-800">{supplement.dosage}</p>
                {weightBasedDose && (
                  <p className="mt-1 text-xs text-emerald-600">
                    Est. {weightBasedDose.min.toFixed(1)}-{weightBasedDose.max.toFixed(1)}
                    {weightBasedDose.unit} for {weightKg}kg.
                  </p>
                )}
                {weightBasedDose?.note && <p className="text-xs text-emerald-600">{weightBasedDose.note}</p>}
              </div>
              <div className="rounded-xl bg-white p-3">
                <p className="text-xs font-semibold text-gray-600">Timing</p>
                <p className="text-sm text-gray-800">{supplement.timing}</p>
                <p className="mt-1 text-xs text-gray-500">{supplement.timeframe}</p>
              </div>
            </div>
            {knowledge?.dosageRangeNote && (
              <p className="text-xs text-emerald-700">
                <span className="font-semibold">Knowledge dosage range note:</span> {knowledge.dosageRangeNote}
              </p>
            )}
          </section>

          {supplement.mechanism && (
            <section className="rounded-2xl bg-slate-50 p-4">
              <h3 className="mb-1 text-sm font-semibold text-slate-700">Mechanism</h3>
              <p className="text-sm text-slate-600">{supplement.mechanism}</p>
            </section>
          )}

          <NutrientFoodSources supplement={supplement} />

          <SupplementFoodLookup supplementName={supplement.name} />

          {supplement.synergies && supplement.synergies.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Works Well With</h3>
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
              className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600">Cautions</p>
                    <ul className="space-y-1">
                      {supplement.cautions.map((caution) => (
                        <li key={caution}>- {caution}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {supplement.drugInteractions && supplement.drugInteractions.length > 0 && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-600">Drug interactions</p>
                    {supplement.drugInteractions.join(', ')}
                  </div>
                )}
                {supplement.avoidIf && supplement.avoidIf.length > 0 && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-600">Avoid if</p>
                    <ul className="space-y-1">
                      {supplement.avoidIf.map((avoid) => (
                        <li key={avoid}>- {avoid}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {supplement.cycleTiming && (
                  <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Cycling</p>
                    {supplement.cycleTiming}
                  </div>
                )}
                {formGuide && (
                  <div className="rounded-xl bg-purple-50 p-3 text-sm text-purple-700">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-600">Form intelligence</p>
                    <div className="space-y-2">
                      {formGuide.forms.slice(0, 4).map((form) => (
                        <div
                          key={form.name}
                          className={`rounded-lg px-2 py-1 text-xs ${
                            form.avoid ? 'bg-red-100 text-red-700' : 'bg-white text-gray-700'
                          }`}
                        >
                          <span className="font-medium">{form.name}</span>
                          <span className="ml-1 text-gray-500">({form.bioavailability})</span>
                          {form.avoid && <span className="ml-1 text-red-600">[!]</span>}
                          <p className="text-[11px] text-gray-500">{form.bestFor}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs">
                      <p>
                        <span className="font-semibold text-green-700">Enhancers:</span> {formGuide.enhancers.join(', ')}
                      </p>
                      {formGuide.blockers.length > 0 && (
                        <p>
                          <span className="font-semibold text-red-600">Blockers:</span> {formGuide.blockers.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {knowledge && knowledgeSafetyNotes.length > 0 && (
                  <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">Knowledge safety notes</p>
                    <ul className="space-y-1">
                      {knowledgeSafetyNotes.map((note) => (
                        <li key={note}>- {note}</li>
                      ))}
                    </ul>
                    {knowledge.safetyFlags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {knowledge.safetyFlags.map((flag) => (
                          <span key={flag} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-amber-700">
                            {flag.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
            <div>
              <h3 className="mb-1 text-sm font-semibold text-slate-700">Evidence & Sources</h3>
              <p className="text-sm text-slate-600">{evidence.description}</p>
            </div>
            {combinedSources.length > 0 && (
              <ul className="space-y-2 text-xs text-slate-600">
                {combinedSources.map((source) => (
                  <li key={`${source.url}-${source.title}`}>
                    <a className="text-emerald-700 hover:underline" href={source.url} target="_blank" rel="noreferrer">
                      {source.title}
                    </a>
                    {source.details && <span className="text-slate-400"> - {source.details}</span>}
                  </li>
                ))}
              </ul>
            )}
            {knowledge && <p className="text-[11px] text-slate-500">{knowledgeDisclaimers.safety}</p>}
          </section>
        </div>
      </div>
    </div>
  );
}
