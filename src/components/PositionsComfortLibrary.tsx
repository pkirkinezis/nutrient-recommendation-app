import { useMemo, useRef, useState } from "react";
import { intimacyComfortGuidelines } from "../data/intimacyComfortGuidance";
import { getExternalReferenceForPosition } from "../data/intimacyExternalReferences";
import { getPositionIllustrationMeta } from "../data/positionIllustrations";
import { positionSourceMap } from "../data/positionSourceMap";
import type { ConsentCheckIn, ConsentResponse, PositionDifficulty, PositionEntry } from "../types";
import {
  buildPositionImageFallbackSearchUrl,
  buildPositionImageFallbackSearchUrlYandex,
  buildPositionImageSearchUrl,
  buildPositionImageSearchUrlYandex,
} from "../utils/intimacyImageSearch";
import {
  matchPersonalizedPositions,
  type MatchConfidence,
  type MatcherEnergyLevel,
  type MatcherPainFocus,
  type MatcherPriority,
} from "../utils/intimacyMatcher";
import { evaluateSafetyEscalation, type IntimacySafetyResult } from "../utils/intimacySafety";
import { ConsentCheckInDialog } from "./ConsentCheckInDialog";
import { PositionMechanicsIllustration } from "./PositionMechanicsIllustration";

interface PositionsComfortLibraryProps {
  positions: PositionEntry[];
  onConsentCheckIn: (entry: ConsentCheckIn) => void;
  onSafetyEscalation: (result: IntimacySafetyResult) => void;
}

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const confidenceLabel: Record<MatchConfidence, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

export const PositionsComfortLibrary = ({
  positions,
  onConsentCheckIn,
  onSafetyEscalation,
}: PositionsComfortLibraryProps) => {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<PositionDifficulty | "all">("all");
  const [concernTag, setConcernTag] = useState<string>("all");
  const [activePosition, setActivePosition] = useState<PositionEntry | null>(null);
  const [activeGuidelineId, setActiveGuidelineId] = useState<string | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [checkInText, setCheckInText] = useState("");
  const [matcherPainFocus, setMatcherPainFocus] = useState<MatcherPainFocus>("none");
  const [matcherEnergyLevel, setMatcherEnergyLevel] = useState<MatcherEnergyLevel>("medium");
  const [matcherPriority, setMatcherPriority] = useState<MatcherPriority>("comfort");
  const [matcherPreferUpright, setMatcherPreferUpright] = useState(false);
  const [matcherBeginnerOnly, setMatcherBeginnerOnly] = useState(true);
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [allowBroadExternalReferences, setAllowBroadExternalReferences] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const normalizedQuery = normalize(query);

  const positionNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const position of positions) {
      map.set(position.id, position.name);
    }
    return map;
  }, [positions]);

  const concernOptions = useMemo(() => {
    const tags = new Set<string>();
    for (const position of positions) {
      for (const tag of position.comfortTags) tags.add(tag);
    }
    for (const guideline of intimacyComfortGuidelines) {
      for (const tag of guideline.concernTags) tags.add(tag);
    }
    return ["all", ...Array.from(tags).sort()];
  }, [positions]);

  const filteredGuidelines = useMemo(() => {
    return intimacyComfortGuidelines.filter((guideline) => {
      const matchesConcern = concernTag === "all" || guideline.concernTags.includes(concernTag);
      if (!matchesConcern) return false;
      if (!normalizedQuery) return true;

      const searchCorpus = [
        guideline.title,
        guideline.summary,
        guideline.concernTags.join(" "),
        guideline.practicalActions.join(" "),
        guideline.escalateWhen.join(" "),
        guideline.relatedPositionIds.join(" "),
        guideline.sources.map((source) => source.label).join(" "),
      ].join(" ");
      return normalize(searchCorpus).includes(normalizedQuery);
    });
  }, [concernTag, normalizedQuery]);

  const guidelineLinkedPositionIds = useMemo(() => {
    return new Set(filteredGuidelines.flatMap((guideline) => guideline.relatedPositionIds));
  }, [filteredGuidelines]);

  const filteredPositions = useMemo(() => {
    return positions.filter((position) => {
      const matchesDifficulty = difficulty === "all" || position.difficulty === difficulty;
      if (!matchesDifficulty) return false;

      const matchesConcern = concernTag === "all" || position.comfortTags.includes(concernTag);
      if (!matchesConcern) return false;

      if (!normalizedQuery) return true;

      const aliases = positionSourceMap[position.id]?.aliases ?? [];
      const searchCorpus = [
        position.name,
        aliases.join(" "),
        position.inspirationTags.join(" "),
        position.comfortTags.join(" "),
        position.setup.join(" "),
        position.alignmentCues.join(" "),
        position.comfortCues.join(" "),
        position.modifications.join(" "),
        position.documentationSources.map((source) => source.label).join(" "),
      ]
        .join(" ");
      const normalizedCorpus = normalize(searchCorpus);

      if (normalizedCorpus.includes(normalizedQuery)) return true;
      return guidelineLinkedPositionIds.has(position.id);
    });
  }, [positions, difficulty, concernTag, normalizedQuery, guidelineLinkedPositionIds]);

  const activeGuideline = useMemo(() => {
    return filteredGuidelines.find((guideline) => guideline.id === activeGuidelineId) || null;
  }, [filteredGuidelines, activeGuidelineId]);

  const personalizedMatches = useMemo(() => {
    return matchPersonalizedPositions(
      positions,
      {
        painFocus: matcherPainFocus,
        energyLevel: matcherEnergyLevel,
        priority: matcherPriority,
        preferUpright: matcherPreferUpright,
        beginnerFriendlyOnly: matcherBeginnerOnly,
      },
      3,
    );
  }, [
    positions,
    matcherPainFocus,
    matcherEnergyLevel,
    matcherPriority,
    matcherPreferUpright,
    matcherBeginnerOnly,
  ]);

  const activeFilterBadges = useMemo(() => {
    const badges: string[] = [];
    if (normalizedQuery) badges.push(`Query: ${query}`);
    if (difficulty !== "all") badges.push(`Difficulty: ${difficulty}`);
    if (concernTag !== "all") badges.push(`Concern: ${concernTag}`);
    return badges;
  }, [normalizedQuery, query, difficulty, concernTag]);

  const clearAllFilters = () => {
    setQuery("");
    setDifficulty("all");
    setConcernTag("all");
    setActiveGuidelineId(null);
  };

  const applyMatchToFilters = (position: PositionEntry) => {
    setQuery(position.name);
    setConcernTag(position.comfortTags[0] ?? "all");
    setDifficulty(position.difficulty);
    setActiveGuidelineId(null);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleSafetyCheck = () => {
    if (!checkInText.trim()) {
      setStatusMessage("Add a short safety note before running the check.");
      return;
    }

    const result = evaluateSafetyEscalation(checkInText);
    if (!result.requiresEscalation) {
      setStatusMessage(
        "No escalation signals detected. Continue only if comfort and consent remain stable.",
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
    onSafetyEscalation(result);
  };

  const handleConsentResponse = (response: ConsentResponse) => {
    if (!activePosition) return;
    const prompt = `Do you consent to continue with ${activePosition.name}?`;
    onConsentCheckIn({
      prompt,
      userResponse: response,
      timestamp: new Date().toISOString(),
      context: "position",
      contextId: activePosition.id,
    });
    setConsentOpen(false);

    if (response === "continue") {
      setStatusMessage("Consent confirmed. Continue with slow pacing and check-ins.");
      return;
    }

    if (response === "switch") {
      setStatusMessage("Switch selected. Choose another position or return to lessons.");
      return;
    }

    setStatusMessage("Session stopped. Use aftercare and return when ready.");
  };

  return (
    <div className="space-y-4">
      <h4 className="text-base font-bold text-gray-900">Positions & Comfort Library</h4>
      <p className="text-sm text-gray-600">
        Search positions and comfort tips together. Keep language neutral and comfort-first.
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-800">Search & Filters</p>
          {activeFilterBadges.length > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search positions, everyday names, tags, or sources..."
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm sm:col-span-2"
          />
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as PositionDifficulty | "all")}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="all">All difficulty levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            value={concernTag}
            onChange={(event) => setConcernTag(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            {concernOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All comfort concerns" : option}
              </option>
            ))}
          </select>
        </div>
        {activeFilterBadges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {activeFilterBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
        <button
          type="button"
          onClick={() => setMatcherOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-900">
            Personalized Position Matcher
          </p>
          <span className="text-[11px] font-semibold text-violet-700">
            {matcherOpen ? "Hide" : "Show"} recommendations
          </span>
        </button>

        {matcherOpen && (
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <select
                value={matcherPainFocus}
                onChange={(event) => setMatcherPainFocus(event.target.value as MatcherPainFocus)}
                className="rounded-lg border border-violet-200 bg-white px-2 py-1.5 text-xs"
              >
                <option value="none">No specific pain focus</option>
                <option value="low-back">Low-back sensitivity</option>
                <option value="pelvic-floor">Pelvic-floor tension</option>
                <option value="hips-knees">Hip or knee sensitivity</option>
                <option value="mobility-balance">Mobility or balance support</option>
              </select>
              <select
                value={matcherEnergyLevel}
                onChange={(event) => setMatcherEnergyLevel(event.target.value as MatcherEnergyLevel)}
                className="rounded-lg border border-violet-200 bg-white px-2 py-1.5 text-xs"
              >
                <option value="low">Low energy</option>
                <option value="medium">Medium energy</option>
                <option value="high">High energy</option>
              </select>
              <select
                value={matcherPriority}
                onChange={(event) => setMatcherPriority(event.target.value as MatcherPriority)}
                className="rounded-lg border border-violet-200 bg-white px-2 py-1.5 text-xs"
              >
                <option value="comfort">Priority: comfort</option>
                <option value="connection">Priority: connection</option>
                <option value="control">Priority: pace and control</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 text-xs text-violet-900">
                <input
                  type="checkbox"
                  checked={matcherPreferUpright}
                  onChange={(event) => setMatcherPreferUpright(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border-violet-300"
                />
                Prefer upright options
              </label>
              <label className="inline-flex items-center gap-2 text-xs text-violet-900">
                <input
                  type="checkbox"
                  checked={matcherBeginnerOnly}
                  onChange={(event) => setMatcherBeginnerOnly(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border-violet-300"
                />
                Beginner-friendly only
              </label>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {personalizedMatches.map((match, index) => (
                <div key={match.position.id} className="rounded-lg border border-violet-200 bg-white p-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-violet-900">
                      {index + 1}. {match.position.name}
                    </p>
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-800">
                      {confidenceLabel[match.confidence]}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(match.reasons.slice(0, 2).length > 0 ? match.reasons.slice(0, 2) : ["general fit"])
                      .map((reason) => (
                        <span
                          key={reason}
                          className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-800"
                        >
                          {reason}
                        </span>
                      ))}
                  </div>
                  {match.cautions[0] && (
                    <p className="mt-1 text-[11px] text-rose-700">Caution: {match.cautions[0]}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => applyMatchToFilters(match.position)}
                    className="mt-2 rounded-lg bg-violet-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-violet-700"
                  >
                    Apply to Library Filters
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div ref={resultsRef} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Results</p>
        <p className="mt-1 text-xs text-slate-600">
          Comfort tips: {filteredGuidelines.length} | Positions: {filteredPositions.length}
        </p>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Comfort Tips</p>
          <span className="text-[11px] text-blue-700">Tap a tip for details</span>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filteredGuidelines.length === 0 && (
            <div className="rounded-lg border border-blue-200 bg-white p-3 text-xs text-blue-800 sm:col-span-2">
              No comfort tips matched these filters.
            </div>
          )}
          {filteredGuidelines.map((guideline) => (
            <button
              key={guideline.id}
              type="button"
              onClick={() =>
                setActiveGuidelineId((current) => (current === guideline.id ? null : guideline.id))
              }
              className={`rounded-lg border p-3 text-left transition ${
                activeGuidelineId === guideline.id
                  ? "border-blue-400 bg-white"
                  : "border-blue-200 bg-white hover:border-blue-300"
              }`}
            >
              <p className="text-sm font-semibold text-blue-900">{guideline.title}</p>
              <p className="mt-1 text-xs text-blue-800">{guideline.summary}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {guideline.concernTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeGuideline && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{activeGuideline.title}</p>
            <button
              type="button"
              onClick={() => {
                setConcernTag(activeGuideline.concernTags[0] ?? "all");
                setQuery("");
              }}
              className="rounded-lg border border-blue-300 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
            >
              Use This Tip Filter
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-slate-700">
            {activeGuideline.practicalActions.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs font-semibold text-rose-700">Pause and escalate when:</p>
          <ul className="mt-1 space-y-1 text-xs text-rose-700">
            {activeGuideline.escalateWhen.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
          <div className="mt-2">
            <p className="text-xs font-semibold text-slate-700">Linked positions</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {activeGuideline.relatedPositionIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setQuery(positionNameById.get(id) ?? id)}
                  className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  {positionNameById.get(id) ?? id}
                </button>
              ))}
            </div>
          </div>
          <details className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
            <summary className="cursor-pointer text-xs font-semibold text-slate-700">
              View Sources
            </summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {activeGuideline.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </details>
        </div>
      )}

      <div className="space-y-3">
        {filteredPositions.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            No positions matched these filters. Try clearing concern tags or search text.
          </div>
        )}
        {filteredPositions.map((position) => {
          const illustration = getPositionIllustrationMeta(position);
          const externalReference = getExternalReferenceForPosition(position, {
            allowBroadMatches: allowBroadExternalReferences,
          });
          const targetedGoogleImageSearchUrl = buildPositionImageSearchUrl(position);
          const fallbackGoogleImageSearchUrl = buildPositionImageFallbackSearchUrl(position);
          const targetedYandexImageSearchUrl = buildPositionImageSearchUrlYandex(position);
          const fallbackYandexImageSearchUrl = buildPositionImageFallbackSearchUrlYandex(position);
          const safeExecutionSteps = [
            position.setup[0],
            position.setup[1] ?? position.alignmentCues[0],
            position.alignmentCues[0],
            position.comfortCues[0],
          ].filter((step, index, all) => Boolean(step) && all.indexOf(step) === index);

          return (
            <div key={position.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{position.name}</p>
                  <p className="text-xs text-gray-500">{position.inspirationTags.join(" | ")}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                  {position.difficulty}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {position.comfortTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,240px)_1fr]">
                <PositionMechanicsIllustration
                  illustrationKey={illustration.key}
                  caption={illustration.caption}
                />
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                      Comfort mechanics focus
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-slate-700">
                      {illustration.mechanicsFocus.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                      How To Perform Safely
                    </p>
                    <ol className="mt-2 space-y-1 text-xs text-emerald-900">
                      {safeExecutionSteps.map((step, index) => (
                        <li key={step}>
                          {index + 1}. {step}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-2 text-[11px] text-emerald-800">
                      Pause and run a consent check-in before each pace or angle change.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Setup</p>
                  <ul className="mt-1 space-y-1 text-xs text-gray-600">
                    {position.setup.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Alignment cues</p>
                  <ul className="mt-1 space-y-1 text-xs text-gray-600">
                    {position.alignmentCues.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Comfort cues</p>
                  <ul className="mt-1 space-y-1 text-xs text-gray-600">
                    {position.comfortCues.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Modifications</p>
                  <ul className="mt-1 space-y-1 text-xs text-gray-600">
                    {position.modifications.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2">
                <p className="text-xs font-semibold text-rose-800">Contraindications</p>
                <p className="mt-1 text-xs text-rose-700">{position.contraindications.join(" | ")}</p>
              </div>

              <details className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                <summary className="cursor-pointer text-xs font-semibold text-slate-700">
                  View Sources
                </summary>
                <div className="mt-2 flex flex-wrap gap-2">
                  {position.documentationSources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      {source.label}
                    </a>
                  ))}
                </div>
              </details>

              <details className="mt-2 rounded-lg border border-indigo-200 bg-indigo-50 p-2">
                <summary className="cursor-pointer text-xs font-semibold text-indigo-800">
                  Optional external images (not verified)
                </summary>
                <label className="mt-2 inline-flex items-center gap-2 text-[11px] text-indigo-800">
                  <input
                    type="checkbox"
                    checked={allowBroadExternalReferences}
                    onChange={(event) => setAllowBroadExternalReferences(event.target.checked)}
                    className="h-3.5 w-3.5 rounded border-indigo-300"
                  />
                  Include broad external matches (lower confidence)
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {externalReference && (
                    <a
                      href={externalReference.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-lg border border-indigo-400 bg-indigo-100 px-2 py-1 text-[11px] font-semibold text-indigo-900 hover:bg-indigo-200"
                    >
                      Mapped External Reference
                    </a>
                  )}
                  <a
                    href={targetedGoogleImageSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg border border-indigo-300 bg-white px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    Google Targeted Search
                  </a>
                  <a
                    href={targetedYandexImageSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg border border-indigo-300 bg-white px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    Yandex Targeted Search
                  </a>
                  <a
                    href={fallbackGoogleImageSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg border border-indigo-300 bg-white px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    Google Broader Search
                  </a>
                  <a
                    href={fallbackYandexImageSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg border border-indigo-300 bg-white px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    Yandex Broader Search
                  </a>
                </div>
                {externalReference && (
                  <p className="mt-2 text-[11px] text-indigo-700">
                    Matched from {externalReference.sourceName}: {externalReference.externalName}.
                  </p>
                )}
                <p className="mt-2 text-[11px] text-indigo-700">
                  These results can be inaccurate. Use the in-app diagram and safe steps above as
                  the primary guidance. External engines may still apply account or regional
                  filtering.
                </p>
              </details>

              <button
                type="button"
                onClick={() => {
                  setActivePosition(position);
                  setConsentOpen(true);
                }}
                className="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Start with Consent Check-In
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
        <label className="mb-1 block text-xs font-medium text-amber-800">Safety note</label>
        <textarea
          value={checkInText}
          onChange={(event) => setCheckInText(event.target.value)}
          placeholder="Report pressure, trauma signals, pain, or distress."
          className="h-20 w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleSafetyCheck}
          className="mt-2 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
        >
          Run Safety Check
        </button>
      </div>

      {statusMessage && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          {statusMessage}
        </div>
      )}

      <ConsentCheckInDialog
        isOpen={consentOpen}
        prompt={activePosition ? `Do you consent to continue with ${activePosition.name}?` : ""}
        onRespond={handleConsentResponse}
        onClose={() => setConsentOpen(false)}
      />
    </div>
  );
};
