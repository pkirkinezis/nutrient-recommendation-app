const EXPLICIT_TERMS = [
  "porn",
  "pornographic",
  "explicit sex",
  "graphic sex",
  "orgasm",
  "penetration",
  "genital",
  "nude",
];

export const containsExplicitContent = (text: string): boolean => {
  const normalized = text.toLowerCase();
  return EXPLICIT_TERMS.some((term) => normalized.includes(term));
};
