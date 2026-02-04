import type { FoodSearchItem, FoodSearchResponse, NutrimentEntry } from "../types";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const USDA_PROXY_PATH = "/api/usda/foods/search";
const USDA_PROXY_BASE_URL = (import.meta.env.VITE_USDA_FDC_PROXY_URL as string | undefined)?.trim();
const USDA_API_KEY = (import.meta.env.VITE_USDA_FDC_API_KEY as string | undefined)?.trim();

const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const CACHE_PREFIX = "nutricompass_usda_cache_";
const USDA_DATA_TYPES = ["Foundation", "SR Legacy"];


interface UsdaFoodNutrient {
  number?: string | number;
  nutrientNumber?: string | number;
  name?: string;
  nutrientName?: string;
  amount?: number;
  value?: number;
  unitName?: string;
}

interface UsdaSearchFood {
  fdcId?: number;
  description?: string;
  brandOwner?: string;
  dataType?: string;
  foodNutrients?: UsdaFoodNutrient[];
}

interface UsdaSearchResponse {
  foods?: UsdaSearchFood[];
}

const safeNumber = (value?: number | string): number | undefined => {
  if (value === undefined || value === null) return undefined;
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? parsed : undefined;
};

const buildCacheKey = (query: string): string => {
  return `${CACHE_PREFIX}${query.toLowerCase().trim()}`;
};

const getCachedResponse = (query: string): FoodSearchResponse | null => {
  const key = buildCacheKey(query);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; response: FoodSearchResponse };
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return { ...parsed.response, source: "cache" };
  } catch {
    return null;
  }
};

const setCachedResponse = (query: string, response: FoodSearchResponse): void => {
  const key = buildCacheKey(query);
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), response }));
  } catch {
    // ignore cache write errors
  }
};

const toUnitName = (value?: string): string | undefined => {
  if (!value) return undefined;
  return value.toUpperCase();
};

const normalizeNutrient = (nutrient: UsdaFoodNutrient): {
  number?: string;
  name?: string;
  value?: number;
  unit?: string;
} => {
  const number = nutrient.number ?? nutrient.nutrientNumber;
  const name = nutrient.name ?? nutrient.nutrientName;
  const value = safeNumber(nutrient.amount ?? nutrient.value);
  const unit = toUnitName(nutrient.unitName);
  return {
    number: number !== undefined ? String(number) : undefined,
    name,
    value,
    unit,
  };
};

const findNutrient = (
  nutrients: UsdaFoodNutrient[],
  numbers: string[],
  nameMatches: string[],
): { value?: number; unit?: string } => {
  for (const number of numbers) {
    const match = nutrients.find((item) => {
      const normalized = normalizeNutrient(item);
      return normalized.number === number;
    });
    const normalized = match ? normalizeNutrient(match) : undefined;
    const value = normalized?.value;
    if (value !== undefined) {
      return { value, unit: normalized?.unit };
    }
  }

  const lowerMatches = nameMatches.map((name) => name.toLowerCase());
  const matchByName = nutrients.find((item) => {
    const normalized = normalizeNutrient(item);
    if (!normalized.name) return false;
    const lower = normalized.name.toLowerCase();
    return lowerMatches.some((fragment) => lower.includes(fragment));
  });
  const normalized = matchByName ? normalizeNutrient(matchByName) : undefined;
  const value = normalized?.value;
  if (value !== undefined) {
    return { value, unit: normalized?.unit };
  }

  return {};
};

const parseNutriments = (nutrients: UsdaFoodNutrient[]): NutrimentEntry[] => {
  return nutrients
    .map((nutrient) => {
      const value = safeNumber(nutrient.amount ?? nutrient.value);
      if (value === undefined) return null;
      const name = nutrient.name ?? nutrient.nutrientName;
      const number = nutrient.number ?? nutrient.nutrientNumber;
      const key = name?.trim() ?? (number !== undefined ? `Nutrient ${number}` : "");
      if (!key) return null;
      return {
        key,
        value,
        unit: nutrient.unitName,
      } as NutrimentEntry;
    })
    .filter((entry): entry is NutrimentEntry => Boolean(entry?.key))
    .sort((a, b) => a.key.localeCompare(b.key));
};

const normalizeFoods = (foods: UsdaSearchFood[]): FoodSearchItem[] => {
  return foods
    .map((food) => {
      const nutrients = Array.isArray(food.foodNutrients) ? food.foodNutrients : [];
      const nutriments = parseNutriments(nutrients);

      const energy = findNutrient(nutrients, ["208", "268"], ["energy"]);
      let caloriesPer100g = energy.value;
      if (caloriesPer100g !== undefined && energy.unit === "KJ") {
        caloriesPer100g = Number((caloriesPer100g / 4.184).toFixed(1));
      }

      const protein = findNutrient(nutrients, ["203"], ["protein"]);
      const carbs = findNutrient(nutrients, ["205"], ["carbohydrate"]);
      const fat = findNutrient(nutrients, ["204"], ["total lipid", "fat"]);

      const item: FoodSearchItem = {
        id: food.fdcId ? String(food.fdcId) : "",
        name: food.description ? String(food.description) : "Unknown item",
        brand: food.brandOwner ? String(food.brandOwner) : food.dataType ? String(food.dataType) : undefined,
        caloriesPer100g,
        proteinPer100g: protein.value,
        carbsPer100g: carbs.value,
        fatPer100g: fat.value,
        nutriments: nutriments.length > 0 ? nutriments : undefined,
        source: "usda-fooddata-central",
      };
      return item;
    })
    .filter((item) => item.id && item.name);
};

export const isUsdaFoodDataCentralConfigured = (): boolean => {
  return Boolean(USDA_API_KEY || USDA_PROXY_BASE_URL);
};

const buildDirectUrl = (query: string): string => {
  const params = new URLSearchParams({
    query,
    pageSize: "10",
    pageNumber: "1",
    api_key: USDA_API_KEY ?? "",
  });
  USDA_DATA_TYPES.forEach((type) => {
    params.append("dataType", type);
  });
  return `${USDA_BASE_URL}?${params.toString()}`;
};

const buildProxyUrl = (query: string): string => {
  const params = new URLSearchParams({
    query,
    pageSize: "10",
    pageNumber: "1",
  });
  USDA_DATA_TYPES.forEach((type) => {
    params.append("dataType", type);
  });
  const base = USDA_PROXY_BASE_URL ? USDA_PROXY_BASE_URL.replace(/\/+$/u, "") : "";
  const endpoint = base ? `${base}${USDA_PROXY_PATH}` : USDA_PROXY_PATH;
  return `${endpoint}?${params.toString()}`;
};

export const searchUsdaFoodDataCentral = async (query: string): Promise<FoodSearchResponse> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return { items: [], source: "offline" };
  }

  const cached = getCachedResponse(trimmed);
  if (cached) return cached;

  try {
    const requestUrl = USDA_API_KEY ? buildDirectUrl(trimmed) : buildProxyUrl(trimmed);
    const response = await fetch(requestUrl);
    if (!response.ok) {
      return { items: [], source: "offline" };
    }
    const data = (await response.json()) as UsdaSearchResponse;
    const items = normalizeFoods(data.foods ?? []);
    const result: FoodSearchResponse = {
      items,
      source: "usda-fooddata-central",
    };
    setCachedResponse(trimmed, result);
    return result;
  } catch {
    return { items: [], source: "offline" };
  }
};
