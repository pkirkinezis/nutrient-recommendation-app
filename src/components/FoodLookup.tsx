import { useMemo, useState } from "react";
import type { FoodSearchItem, FoodSupplementMatch, Supplement } from "../types";
import { searchOpenFoodFacts } from "../utils/openFoodFacts";
import { buildFoodSupplementMatches } from "../utils/foodLookupConnections";

const formatNumber = (value?: number): string => {
  if (value === undefined) return "—";
  return Number.isFinite(value) ? value.toFixed(1) : "—";
};

interface FoodLookupProps {
  supplements: Supplement[];
  onSelectSupplement: (supplementId: string) => void;
}

export const FoodLookup = ({ supplements, onSelectSupplement }: FoodLookupProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodSearchItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [source, setSource] = useState<string | null>(null);

  const relatedSupplements = useMemo(() => {
    const map: Record<string, FoodSupplementMatch[]> = {};
    results.forEach((item) => {
      map[item.id] = buildFoodSupplementMatches(query, item.name, supplements);
    });
    return map;
  }, [query, results, supplements]);

  const handleSearch = async (): Promise<void> => {
    if (!query.trim()) return;
    setStatus("loading");
    const response = await searchOpenFoodFacts(query);
    setResults(response.items);
    setSource(response.source);
    setStatus("done");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Food Lookup</h3>
          <p className="text-sm text-gray-500">Search Open Food Facts with offline fallback data.</p>
        </div>
        {source && (
          <span className="text-xs text-gray-400 uppercase tracking-wide">Source: {source}</span>
        )}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Search foods (e.g., oats, salmon, yogurt)"
        />
        <button
          type="button"
          onClick={() => void handleSearch()}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
        >
          Search
        </button>
      </div>
      {status === "loading" && (
        <p className="mt-3 text-xs text-gray-400">Searching foods…</p>
      )}
      {status === "done" && results.length === 0 && (
        <p className="mt-3 text-xs text-gray-400">No results found. Try another search.</p>
      )}
      {results.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {results.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-100 p-3">
              <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">{item.brand || "Generic"} • {item.servingSize || "per 100g"}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                <span>Calories: {formatNumber(item.caloriesPer100g)}</span>
                <span>Protein: {formatNumber(item.proteinPer100g)}g</span>
                <span>Carbs: {formatNumber(item.carbsPer100g)}g</span>
                <span>Fat: {formatNumber(item.fatPer100g)}g</span>
              </div>
              {relatedSupplements[item.id]?.length ? (
                <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 p-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Related supplements</p>
                  <div className="mt-2 space-y-2">
                    {relatedSupplements[item.id].map((match) => (
                      <div key={match.id} className="flex items-start justify-between gap-2 text-xs text-emerald-800">
                        <div>
                          <p className="font-semibold text-emerald-900">{match.name}</p>
                          <p className="text-[11px] text-emerald-700">{match.reasons.join(" • ")}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectSupplement(match.id)}
                          className="shrink-0 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-semibold text-emerald-700 hover:border-emerald-300 hover:text-emerald-800"
                        >
                          View details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
