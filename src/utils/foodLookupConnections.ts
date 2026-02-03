import type { FoodSupplementMatch, Supplement } from "../types";

const MIN_TOKEN_LENGTH = 3;

const tokenize = (value: string): string[] => {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= MIN_TOKEN_LENGTH);
};

const buildTokenSet = (value: string): Set<string> => {
  return new Set(tokenize(value));
};

const findGoalMatches = (queryTokens: Set<string>, goals: string[]): string[] => {
  return goals.filter((goal) => tokenize(goal).some((token) => queryTokens.has(token)));
};

const findFoodSourceMatches = (queryTokens: Set<string>, foodSources?: string[]): string[] => {
  if (!foodSources) return [];
  return foodSources.filter((food) => tokenize(food).some((token) => queryTokens.has(token)));
};

export const buildFoodSupplementMatches = (
  query: string,
  foodName: string,
  supplements: Supplement[],
  limit = 3
): FoodSupplementMatch[] => {
  if (!query.trim() && !foodName.trim()) return [];

  const queryTokens = buildTokenSet(`${query} ${foodName}`);
  if (queryTokens.size === 0) return [];

  const matches = supplements
    .map((supplement) => {
      const nameTokens = buildTokenSet(supplement.name);
      const goalMatches = findGoalMatches(queryTokens, supplement.goals);
      const foodSourceMatches = findFoodSourceMatches(queryTokens, supplement.foodSources);

      let score = 0;
      const reasons: string[] = [];

      if ([...nameTokens].some((token) => queryTokens.has(token))) {
        score += 3;
        reasons.push("Name match");
      }

      if (goalMatches.length > 0) {
        score += goalMatches.length * 2;
        reasons.push(`Goals: ${goalMatches.slice(0, 2).join(", ")}`);
      }

      if (foodSourceMatches.length > 0) {
        score += foodSourceMatches.length * 2;
        reasons.push(`Food sources: ${foodSourceMatches.slice(0, 2).join(", ")}`);
      }

      if (score === 0) return null;

      return {
        id: supplement.id,
        name: supplement.name,
        reasons,
        score,
      };
    })
    .filter((match): match is FoodSupplementMatch & { score: number } => Boolean(match));

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...rest }) => rest);
};
