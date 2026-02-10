
import { analyzeGoal } from '../src/utils/analyzer.ts';
import { searchSupplementsWithScores, suggestClosestSupplementTerm } from '../src/utils/supplementSearchEngine.ts';
import { supplements } from '../src/data/supplements.ts';
import { dedupeSupplementsByCanonical, getCanonicalSupplementKey } from '../src/utils/supplementCanonical.ts';

export {
  analyzeGoal,
  searchSupplementsWithScores,
  suggestClosestSupplementTerm,
  supplements,
  dedupeSupplementsByCanonical,
  getCanonicalSupplementKey,
};
