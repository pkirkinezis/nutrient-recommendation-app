export const REPRODUCTIVE_GOAL_IDS = new Set([
  'hormones',
  'fertility',
  'sexual-health',
  'sexual-function',
  'libido',
  'reproductive'
]);

// Keep query gating aligned with analyzer reproductive-goal scope.
export const REPRODUCTIVE_QUERY_SCOPE_PATTERN =
  /pregnan|breastfeed|lactation|trying to conceive|conceive|ttc|fertility|ovulation|preconception|prenatal|libido|sexual|hormonal?|reproductive/;

export const PREGNANCY_TEXT_PATTERN = /pregnan|prenatal|gestation|trimester/;
export const BREASTFEEDING_TEXT_PATTERN = /breastfeed|lactation|nursing/;
export const TTC_TEXT_PATTERN = /trying to conceive|ttc|conceive|ovulation|preconception/;
export const REPRODUCTIVE_RISK_TEXT_PATTERN =
  /pregnan|breastfeed|lactation|trying to conceive|conceive|ovulation|preconception|prenatal/;

export function isReproductiveScopeQuery(query: string): boolean {
  return REPRODUCTIVE_QUERY_SCOPE_PATTERN.test(query.toLowerCase());
}

export function hasReproductiveRiskSignalInText(text: string): boolean {
  return REPRODUCTIVE_RISK_TEXT_PATTERN.test(text.toLowerCase());
}
