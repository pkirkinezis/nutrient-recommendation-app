import { EvidenceLevel, Priority } from '../types';

interface RecommendationEvidenceProps {
  evidence: EvidenceLevel;
  priority?: Priority;
  relevanceScore?: number;
  compact?: boolean;
  showEvidence?: boolean;
}

const EVIDENCE_PRESENTATION: Record<EvidenceLevel, { label: string; className: string; description: string }> = {
  strong: {
    label: 'Strong',
    className: 'bg-emerald-100 text-emerald-800',
    description: 'Multiple human studies support at least one documented use.',
  },
  moderate: {
    label: 'Moderate',
    className: 'bg-amber-100 text-amber-800',
    description: 'Human evidence exists, but results or applicability are mixed.',
  },
  limited: {
    label: 'Limited / traditional',
    className: 'bg-slate-100 text-slate-700',
    description: 'Evidence is preliminary, indirect, or based on traditional use.',
  },
};

const PRIORITY_LABELS: Record<Priority, string> = {
  essential: 'Top match',
  beneficial: 'Good match',
  optional: 'Explore',
};

export function RecommendationEvidence({
  evidence,
  priority,
  relevanceScore,
  compact = false,
  showEvidence = true,
}: RecommendationEvidenceProps): React.ReactElement {
  const presentation = EVIDENCE_PRESENTATION[evidence];
  const safeScore = typeof relevanceScore === 'number'
    ? Math.max(0, Math.min(100, relevanceScore))
    : null;

  return (
    <div className={compact ? 'flex flex-wrap items-center gap-1.5' : 'space-y-2'}>
      {(showEvidence || priority) && <div className="flex flex-wrap items-center gap-1.5">
        {showEvidence && <span
            title={presentation.description}
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${presentation.className}`}
          >
            Overall evidence: {presentation.label}
          </span>}
        {priority && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
            {PRIORITY_LABELS[priority]}
          </span>
        )}
      </div>}
      {!compact && safeScore !== null && (
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>Query and profile match</span>
            <span>{safeScore}/100</span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Query and profile match score"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safeScore}
          >
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${safeScore}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Match score is not proof of effectiveness or a diagnosed need.</p>
        </div>
      )}
    </div>
  );
}
