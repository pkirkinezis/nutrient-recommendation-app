import type { FoodSearchResponse } from "../types";
import { searchOpenFoodFacts } from "./openFoodFacts";
import { isUsdaFoodDataCentralConfigured, searchUsdaFoodDataCentral } from "./usdaFoodDataCentral";

export const searchFoodLookup = async (query: string): Promise<FoodSearchResponse> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return { items: [], source: "offline" };
  }

  if (isUsdaFoodDataCentralConfigured()) {
    const usdaResponse = await searchUsdaFoodDataCentral(trimmed);
    if (usdaResponse.items.length > 0) {
      return usdaResponse;
    }
  }

  return await searchOpenFoodFacts(trimmed);
};
