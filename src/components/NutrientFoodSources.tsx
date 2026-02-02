import type { Supplement } from '../types';
import { getFoodSourcesForSupplement, getNutrientReferenceForSupplement } from '../data/nutrientFoodSources';

const normalizeUnit = (unit: string) => unit.replace(/Âµg|µg/g, 'mcg');

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const formatNumber = (value: number) => numberFormatter.format(value);

const formatPercent = (value: number) => {
  if (value > 0 && value < 1) return '<1%';
  return `${Math.round(value)}%`;
};

const getNrvLabel = (source?: string) => {
  if (!source) return 'Reference Intake';
  const normalized = source.toLowerCase();
  if (normalized.includes('eu')) return 'EU Nutrient Reference Value (NRV)';
  if (normalized.includes('efsa')) return 'EFSA Adequate Intake';
  return 'Reference Intake';
};

const getPercentTone = (percent: number) => {
  if (percent >= 100) return 'text-emerald-700';
  if (percent >= 50) return 'text-amber-700';
  return 'text-slate-600';
};

const NutrientFoodSources = ({ supplement }: { supplement: Supplement }) => {
  const sources = getFoodSourcesForSupplement(supplement.id);

  if (sources.length === 0) {
    if (!supplement.foodSources || supplement.foodSources.length === 0) return null;
    return (
      <div className="bg-green-50 rounded-xl p-3">
        <h4 className="text-xs font-semibold text-green-700 mb-1">🥗 Food Sources</h4>
        <p className="text-sm text-green-800">{supplement.foodSources.join(', ')}</p>
      </div>
    );
  }

  const nutrientReference = getNutrientReferenceForSupplement(supplement.id);
  const nutrientName = nutrientReference?.nutrientName ?? supplement.name;
  const nrv = nutrientReference?.nrv;

  return (
    <div className="bg-green-50 rounded-xl p-3 space-y-3">
      <h4 className="text-xs font-semibold text-green-700">
        🥗 Food Sources for {nutrientName}
      </h4>

      {nrv && (
        <div className="bg-white/80 border border-green-100 rounded-lg p-2">
          <p className="text-[11px] font-semibold text-green-700">
            {getNrvLabel(nrv.source)}
          </p>
          <p className="text-sm text-green-900">
            <span className="font-semibold">
              {formatNumber(nrv.amount)} {normalizeUnit(nrv.unit)}
            </span>{' '}
            per day
          </p>
          <p className="text-[11px] text-green-700">Source: {nrv.source}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-green-900">
          <thead className="text-[11px] uppercase tracking-wide text-green-700">
            <tr>
              <th className="py-1 text-left font-semibold">Food</th>
              <th className="py-1 text-left font-semibold">Basis</th>
              <th className="py-1 text-right font-semibold">Amount</th>
              <th className="py-1 text-right font-semibold">% NRV</th>
              <th className="py-1 text-left font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((item, index) => (
              <tr key={`${item.food}-${index}`} className="border-t border-green-100">
                <td className="py-1 pr-2 whitespace-nowrap">{item.food}</td>
                <td className="py-1 pr-2 text-green-800">{item.basis}</td>
                <td className="py-1 pr-2 text-right text-green-800">
                  {formatNumber(item.amount)} {normalizeUnit(item.unit)}
                </td>
                <td className={`py-1 pr-2 text-right font-semibold ${getPercentTone(item.percentNRV)}`}>
                  {formatPercent(item.percentNRV)}
                </td>
                <td className="py-1 text-green-700 whitespace-nowrap">{item.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NutrientFoodSources;
