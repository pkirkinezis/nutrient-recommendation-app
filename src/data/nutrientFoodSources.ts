import { nutrientFoodMapping, nutrientFoodSources, getFoodSourcesForNutrient } from './supplements';
import type { FoodSource } from '../types';

type NutrientReference = {
  nutrientId: string;
  nutrientName: string;
  nrv?: {
    amount: number;
    unit: string;
    source: string;
  };
};

const nutrientReferencesById = new Map<string, NutrientReference>(
  (nutrientFoodMapping?.nutrients ?? []).map((nutrient: NutrientReference) => [
    nutrient.nutrientId,
    nutrient
  ])
);

const supplementToNutrientId: Record<string, string> = {
  'vitamin-d3': 'vitamin-d',
  'vitamin-k2': 'vitamin-k',
  'vitamin-e-tocotrienol': 'vitamin-e',
  'biotin': 'vitamin-b7',
  'folate': 'vitamin-b9',
  'acetyl-l-carnitine': 'l-carnitine'
};

export const getNutrientIdForSupplement = (supplementId: string): string | null => {
  if (nutrientFoodSources[supplementId]) return supplementId;
  return supplementToNutrientId[supplementId] ?? null;
};

export const getFoodSourcesForSupplement = (supplementId: string): FoodSource[] => {
  const nutrientId = getNutrientIdForSupplement(supplementId);
  if (!nutrientId) return [];
  return getFoodSourcesForNutrient(nutrientId);
};

export const getNutrientReference = (nutrientId: string): NutrientReference | null => {
  return nutrientReferencesById.get(nutrientId) ?? null;
};

export const getNutrientReferenceForSupplement = (supplementId: string): NutrientReference | null => {
  const nutrientId = getNutrientIdForSupplement(supplementId);
  if (!nutrientId) return null;
  return getNutrientReference(nutrientId);
};
