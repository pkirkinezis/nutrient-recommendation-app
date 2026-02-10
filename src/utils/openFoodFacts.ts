import type { FoodSearchItem, FoodSearchResponse, NutrimentEntry } from "../types";
import { offlineFoods } from "../data/offlineFoods";

const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const CACHE_PREFIX = "nutricompass_off_cache_";

const safeNumber = (value?: unknown): number | undefined => {
  if (value === undefined || value === null) return undefined;
  const parsed = typeof value === "string" ? Number(value) : typeof value === "number" ? value : Number.NaN;
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

const normalizeProducts = (products: Array<Record<string, unknown>>): FoodSearchItem[] => {
  return products
    .map((product) => {
      const nutriments = (product.nutriments ?? {}) as Record<string, unknown>;
      const parsedNutriments = parseNutriments(nutriments);
      const item: FoodSearchItem = {
        id: String(product.code ?? product.id ?? product._id ?? ""),
        name: String(product.product_name ?? product.product_name_en ?? "Unknown item"),
        brand: typeof product.brands === "string" ? product.brands : undefined,
        servingSize: typeof product.serving_size === "string" ? product.serving_size : undefined,
        caloriesPer100g: safeNumber(nutriments["energy-kcal_100g"]),
        proteinPer100g: safeNumber(nutriments["proteins_100g"]),
        carbsPer100g: safeNumber(nutriments["carbohydrates_100g"]),
        fatPer100g: safeNumber(nutriments["fat_100g"]),
        nutriments: parsedNutriments.length > 0 ? parsedNutriments : undefined,
        source: "open-food-facts",
      };
      return item;
    })
    .filter((item) => item.id && item.name);
};

const parseNutriments = (nutriments: Record<string, unknown>): NutrimentEntry[] => {
  const entries: NutrimentEntry[] = [];
  const valueByKey = new Map<string, { value?: number; unit?: string; basis?: "100g" | "serving" }>();

  Object.entries(nutriments).forEach(([key, rawValue]) => {
    if (key.endsWith("_unit") || key.endsWith("_label")) return;
    if (key.endsWith("_value") || key.endsWith("_value_computed")) return;

    const basis = key.endsWith("_100g") ? "100g" : key.endsWith("_serving") ? "serving" : undefined;
    const baseKey = key.replace(/_(100g|serving)$/u, "");
    const value = safeNumber(rawValue);
    if (value === undefined) return;

    const unitKey = `${baseKey}_unit`;
    const unit = typeof nutriments[unitKey] === "string" ? String(nutriments[unitKey]) : undefined;
    valueByKey.set(`${baseKey}:${basis ?? "base"}`, { value, unit, basis });
  });

  valueByKey.forEach((data, compoundKey) => {
    if (data.value === undefined) return;
    const [key] = compoundKey.split(":");
    entries.push({
      key,
      value: data.value,
      unit: data.unit,
      basis: data.basis,
    });
  });

  return entries.sort((a, b) => a.key.localeCompare(b.key));
};

const fallbackOffline = (query: string): FoodSearchResponse => {
  const normalized = query.toLowerCase().trim();
  const items = offlineFoods.filter((food) => food.name.toLowerCase().includes(normalized));
  return { items: items.length > 0 ? items : offlineFoods.slice(0, 4), source: "offline" };
};

export const searchOpenFoodFacts = async (query: string): Promise<FoodSearchResponse> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return { items: [], source: "offline" };
  }

  const cached = getCachedResponse(trimmed);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      search_terms: trimmed,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: "10",
      fields: "code,product_name,product_name_en,brands,serving_size,nutriments",
    });
    const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`);
    if (!response.ok) {
      return fallbackOffline(trimmed);
    }
    const data = (await response.json()) as { products?: Array<Record<string, unknown>> };
    const items = normalizeProducts(data.products ?? []);
    const result: FoodSearchResponse = {
      items: items.length > 0 ? items : fallbackOffline(trimmed).items,
      source: items.length > 0 ? "open-food-facts" : "offline",
    };
    setCachedResponse(trimmed, result);
    return result;
  } catch {
    return fallbackOffline(trimmed);
  }
};
