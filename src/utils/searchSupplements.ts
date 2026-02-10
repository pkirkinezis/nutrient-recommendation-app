import { supplements } from '../data/supplements';
import { Supplement } from '../types';
import { searchSupplementsWithScores, SupplementSearchOptions } from './supplementSearchEngine';

type SearchOptions = SupplementSearchOptions;

export const searchSupplements = (query: string, options?: SearchOptions): Supplement[] => {
  const hasQuery = (query?.trim().length || 0) > 0;
  const hasGoal = Boolean(options?.goal?.trim().length);
  if (!hasQuery && !hasGoal) {
    return [];
  }

  return searchSupplementsWithScores(query, supplements, options).map((entry) => entry.supplement);
};
