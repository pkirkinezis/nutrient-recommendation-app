import { supplements } from '../data/supplements';
import { Supplement } from '../types';

interface SearchOptions {
  gender?: 'male' | 'female' | 'other';
  goal?: string;
}

export const searchSupplements = (query: string, options?: SearchOptions): Supplement[] => {
  if (!query?.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const isFertilityQuery = normalizedQuery.includes('fertility') ||
    normalizedQuery.includes('conception') ||
    normalizedQuery.includes('pregnant');
  const evidenceScore = { strong: 3, moderate: 2, limited: 1 } as const;

  return supplements
    .filter(supplement => {
      const matchesQuery =
        supplement.name.toLowerCase().includes(normalizedQuery) ||
        supplement.goals.some(g => g.toLowerCase().includes(normalizedQuery)) ||
        supplement.benefits.some(b => b.toLowerCase().includes(normalizedQuery));

      if (!matchesQuery) {
        return false;
      }

      if (options?.goal) {
        const matchesGoal = supplement.goals.some(g => g.toLowerCase().includes(options.goal.toLowerCase()));
        if (!matchesGoal) {
          return false;
        }
      }

      // Gender filtering logic
      if (isFertilityQuery && options?.gender) {
        const isMaleSpec = supplement.goals.some(g =>
          ['male-reproductive', 'sperm-quality', 'testosterone'].includes(g));
        const isFemaleSpec = supplement.goals.some(g =>
          ['female-reproductive', 'ovulation', 'menstrual-health', 'pcos', 'menopause'].includes(g));

        if (options.gender === 'male' && isFemaleSpec && !isMaleSpec) {
          return false;
        }

        if (options.gender === 'female' && isMaleSpec && !isFemaleSpec) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const scoreA = evidenceScore[a.evidence as keyof typeof evidenceScore] || 0;
      const scoreB = evidenceScore[b.evidence as keyof typeof evidenceScore] || 0;
      return scoreB - scoreA;
    });
};
