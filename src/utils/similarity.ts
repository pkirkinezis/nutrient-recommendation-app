export interface SimilarityResult<T> {
  item: T;
  score: number;
}

const tokenizeText = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
};

const buildTermFrequency = (tokens: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return counts;
};

const cosineSimilarity = (a: Map<string, number>, b: Map<string, number>): number => {
  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const value of a.values()) {
    magnitudeA += value * value;
  }
  for (const value of b.values()) {
    magnitudeB += value * value;
  }

  for (const [term, value] of a.entries()) {
    const other = b.get(term);
    if (other) {
      dot += value * other;
    }
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

export const rankByCosineSimilarity = <T extends { text: string }>(
  query: string,
  items: T[],
  limit = 3
): SimilarityResult<T>[] => {
  const queryTokens = tokenizeText(query);
  const queryVector = buildTermFrequency(queryTokens);

  return items
    .map((item) => {
      const itemVector = buildTermFrequency(tokenizeText(item.text));
      return { item, score: cosineSimilarity(queryVector, itemVector) };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
