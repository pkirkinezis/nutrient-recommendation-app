import { Supplement, SupplementKnowledgeEntry } from '../types';
import { STRONG_INTERACTION_SIGNAL_PATTERN } from '../constants/browse';

export function hasSignificantInteractionRisk(
  supplement?: Supplement,
  knowledge?: SupplementKnowledgeEntry
): boolean {
  if (!supplement) return false;
  const interactionText = [
    ...(supplement.drugInteractions || []),
    ...(supplement.cautions || []),
    ...(supplement.avoidIf || []),
    ...(knowledge?.safetyNotes || []),
  ].join(' ').toLowerCase();

  return STRONG_INTERACTION_SIGNAL_PATTERN.test(interactionText);
}
