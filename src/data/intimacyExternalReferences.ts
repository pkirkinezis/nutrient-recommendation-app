import importedPositionData from "./importedPositionData.json";
import { importedExternalReferenceByPositionId } from "./importedIntimacyPositions";
import type { PositionEntry } from "../types";

type MappingConfidence = "exact" | "alias" | "keyword" | "unmapped" | "manual";

interface ImportedReferenceRow {
  externalId: string;
  externalName: string;
  mappedPositionId: string | null;
  mappingConfidence: MappingConfidence;
  imageUrl?: string;
  imageAlt?: string;
  source: {
    sourceName: string;
    sourceUrl: string;
    license: string;
    attribution: string;
  };
}

interface ImportedReferenceRowWithImage extends ImportedReferenceRow {
  imageUrl: string;
}

interface ImportedPayload {
  rows?: ImportedReferenceRow[];
}

export interface ExternalPositionReference {
  externalId: string;
  externalName: string;
  imageUrl: string;
  imageAlt?: string;
  sourceName: string;
  sourceUrl: string;
  license: string;
  attribution: string;
  mappedPositionId: string;
  mappingConfidence: MappingConfidence;
}

const confidenceRank: Record<MappingConfidence, number> = {
  manual: 4,
  exact: 3,
  alias: 2,
  keyword: 1,
  unmapped: 0,
};

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const isValidImageUrl = (value: string | undefined): value is string =>
  Boolean(value && /^https?:\/\/\S+/i.test(value));

const rawRows = ((importedPositionData as ImportedPayload).rows ?? []).filter(
  (row): row is ImportedReferenceRowWithImage =>
    Boolean(row && row.externalId && row.externalName && row.source && isValidImageUrl(row.imageUrl)),
);

const rowsByNormalizedName = new Map<string, ImportedReferenceRowWithImage[]>();
for (const row of rawRows) {
  const key = normalize(row.externalName);
  const list = rowsByNormalizedName.get(key) ?? [];
  list.push(row);
  rowsByNormalizedName.set(key, list);
}

const pickBestRow = (rows: ImportedReferenceRowWithImage[]): ImportedReferenceRowWithImage | null => {
  if (rows.length === 0) return null;
  const sorted = [...rows].sort((a, b) => {
    const byConfidence = confidenceRank[b.mappingConfidence] - confidenceRank[a.mappingConfidence];
    if (byConfidence !== 0) return byConfidence;
    return a.externalName.length - b.externalName.length;
  });
  return sorted[0] ?? null;
};

const preferredTitlesByPositionId: Record<string, string[]> = {
  "missionary-supported-pelvis-elevated": ["Missionary"],
  "side-lying-support": ["Spoon", "Ribbon (reverse spoon)"],
  "semi-reclined-lotus-support": ["Lotus Flower"],
  "chair-supported-neutral": ["Chair", "Soft chair", "Rocking chair"],
  "top-facing-forward-supported": ["Cowgirl"],
  "top-facing-backward-supported": ["Reverse Cowgirl", "Backwards Cowgirl"],
  "top-sideways-supported": ["Bent cowgirl", "Asian Cowgirl"],
  "supported-standing-wall-shift": ["Wall"],
  "quadruped-supported-a": ["Doggy Style", "Low doggy", "Passive doggy"],
  "quadruped-supported-b": ["Doggy on the edge", "Doggy on the edge 2", "Reverse doggy"],
  "edge-of-bed-assisted": ["Doggy on the edge", "Doggy on the edge 2"],
};

const toReference = (row: ImportedReferenceRowWithImage, mappedPositionId: string): ExternalPositionReference => ({
  externalId: row.externalId,
  externalName: row.externalName,
  imageUrl: row.imageUrl,
  imageAlt: row.imageAlt,
  sourceName: row.source.sourceName,
  sourceUrl: row.source.sourceUrl,
  license: row.source.license,
  attribution: row.source.attribution,
  mappedPositionId,
  mappingConfidence: row.mappingConfidence,
});

interface ReferenceBuildOptions {
  allowKeywordMatches: boolean;
}

const isStrictConfidence = (confidence: MappingConfidence): boolean =>
  confidence === "exact" || confidence === "alias";

const buildReferenceMap = (options: ReferenceBuildOptions): Record<string, ExternalPositionReference> => {
  const references: Record<string, ExternalPositionReference> = {};

  for (const [positionId, preferredTitles] of Object.entries(preferredTitlesByPositionId)) {
    let selected: ImportedReferenceRowWithImage | null = null;
    for (const title of preferredTitles) {
      const candidates = rowsByNormalizedName.get(normalize(title)) ?? [];
      const candidate = pickBestRow(
        options.allowKeywordMatches
          ? candidates
          : candidates.filter((row) => isStrictConfidence(row.mappingConfidence)),
      );
      if (!candidate) continue;
      selected = candidate;
      break;
    }

    if (selected) {
      references[positionId] = toReference(selected, positionId);
    }
  }

  // Safe fallback: include only explicit high-confidence matches from importer.
  const groupedFallback = new Map<string, ImportedReferenceRowWithImage[]>();
  for (const row of rawRows) {
    if (!row.mappedPositionId) continue;
    if (!options.allowKeywordMatches && !isStrictConfidence(row.mappingConfidence)) continue;
    const list = groupedFallback.get(row.mappedPositionId) ?? [];
    list.push(row);
    groupedFallback.set(row.mappedPositionId, list);
  }

  for (const [positionId, rows] of groupedFallback.entries()) {
    if (references[positionId]) continue;
    const selected = pickBestRow(rows);
    if (!selected) continue;
    references[positionId] = toReference(selected, positionId);
  }

  return references;
};

export const externalReferenceByPositionId = buildReferenceMap({ allowKeywordMatches: false });
export const externalReferenceByPositionIdBroad = buildReferenceMap({ allowKeywordMatches: true });

export const getExternalReferenceForPosition = (
  position: Pick<PositionEntry, "id">,
  options?: { allowBroadMatches?: boolean },
): ExternalPositionReference | null => {
  const importedReference = importedExternalReferenceByPositionId[position.id];
  if (importedReference) return importedReference;

  if (options?.allowBroadMatches) {
    return externalReferenceByPositionIdBroad[position.id] ?? null;
  }
  return externalReferenceByPositionId[position.id] ?? null;
};
