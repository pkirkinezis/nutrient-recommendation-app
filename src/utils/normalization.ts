import { GOAL_ALIASES, GOAL_CATEGORIES, SYSTEM_ALIASES, SYSTEM_DEFINITIONS } from '../constants/taxonomy';

const GOAL_ID_SET = new Set(GOAL_CATEGORIES.map(goal => goal.id));
const SYSTEM_ID_SET = new Set(SYSTEM_DEFINITIONS.map(system => system.id));

export function normalizeGoalId(goal: string): string | null {
  const normalized = goal.toLowerCase();
  const alias = GOAL_ALIASES[normalized];
  const candidate = alias || normalized;
  if (GOAL_ID_SET.has(candidate)) {
    return candidate;
  }
  return null;
}

export function normalizeGoals(goals: string[] = []): string[] {
  const normalizedGoals = goals
    .map(goal => normalizeGoalId(goal))
    .filter((goal): goal is string => Boolean(goal));
  return Array.from(new Set(normalizedGoals));
}

export function normalizeSystemId(system: string): string | null {
  const normalized = system.toLowerCase();
  const alias = SYSTEM_ALIASES[normalized];
  const candidate = alias || normalized;
  if (SYSTEM_ID_SET.has(candidate)) {
    return candidate;
  }
  return null;
}

export function normalizeSystems(systems: string[] = []): string[] {
  const normalizedSystems = systems
    .map(system => normalizeSystemId(system))
    .filter((system): system is string => Boolean(system));
  return Array.from(new Set(normalizedSystems));
}
