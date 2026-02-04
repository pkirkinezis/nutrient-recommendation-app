import { useEffect, useState } from "react";
import type { FoodSearchItem } from "../types";
import { searchFoodLookup } from "../utils/foodSearch";

interface SupplementFoodLookupProps {
  supplementName: string;
}

const formatNumber = (value?: number): string => {
  if (value === undefined) return "—";
  return Number.isFinite(value) ? value.toFixed(1) : "—";
};

const formatNutrimentName = (value: string): string => {
  return value.replace(/-/g, " ");
};

export const SupplementFoodLookup = ({ supplementName }: SupplementFoodLookupProps) => {
  const [query, setQuery] = useState(supplementName);
  const [results, setResults] = useState<FoodSearchItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [source, setSource] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const syncQuery = (): void => {
      setQuery(supplementName);
    };
    syncQuery();
    if (!supplementName.trim()) return;
    const runSearch = async (): Promise<void> => {
      setStatus("loading");
      const response = await searchFoodLookup(supplementName);
      setResults(response.items.slice(0, 4));
      setSource(response.source);
      setStatus("done");
    };
    void runSearch();
  }, [supplementName]);

  const handleSearch = async (): Promise<void> => {
    if (!query.trim()) return;
    setStatus("loading");
    const response = await searchFoodLookup(query);
    setResults(response.items.slice(0, 4));
    setSource(response.source);
    setStatus("done");
  };

  return (
    <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-emerald-800">Food Lookup (USDA + Open Food Facts)</h3>
          <p className="text-xs text-emerald-600">Find real foods that reference this nutrient.</p>
        </div>
        {source && (
          <span className="text-[11px] uppercase tracking-wide text-emerald-600">Source: {source}</span>
        )}
      </div>
      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder={`Search foods for ${supplementName}`}
        />
        <button
          type="button"
          onClick={() => void handleSearch()}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          Search
        </button>
      </div>
      {status === "loading" && (
        <p className="mt-2 text-[11px] text-emerald-700">Fetching food results…</p>
      )}
      {status === "done" && results.length === 0 && (
        <p className="mt-2 text-[11px] text-emerald-700">No results yet. Try a different food or brand name.</p>
      )}
      {results.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {results.map((item) => (
            <div key={item.id} className="rounded-lg border border-emerald-100 bg-white p-2 text-xs text-emerald-900">
              <p className="font-semibold">{item.name}</p>
              <p className="text-[11px] text-emerald-700">{item.brand || "Generic"} • {item.servingSize || "per 100g"}</p>
              <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] text-emerald-700">
                <span>Calories: {formatNumber(item.caloriesPer100g)}</span>
                <span>Protein: {formatNumber(item.proteinPer100g)}g</span>
                <span>Carbs: {formatNumber(item.carbsPer100g)}g</span>
                <span>Fat: {formatNumber(item.fatPer100g)}g</span>
              </div>
              {item.nutriments && item.nutriments.length > 0 && (
                <div className="mt-2 rounded-md border border-emerald-100 bg-emerald-50 p-2">
                  <div className="flex items-center justify-between text-[10px] text-emerald-700">
                    <span className="font-semibold uppercase tracking-wide">All nutriments</span>
                    <button
                      type="button"
                      onClick={() => setExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className="font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      {expanded[item.id] ? "Hide" : "Show"}
                    </button>
                  </div>
                  {expanded[item.id] && (
                    <div className="mt-2 grid grid-cols-1 gap-1 text-[10px] text-emerald-700">
                      {item.nutriments.map((nutriment) => (
                        <div key={`${item.id}-${nutriment.key}-${nutriment.basis ?? "base"}`}>
                          <span className="font-semibold">{formatNutrimentName(nutriment.key)}</span>
                          : {nutriment.value} {nutriment.unit ?? ""}
                          {nutriment.basis ? ` per ${nutriment.basis}` : ""}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
