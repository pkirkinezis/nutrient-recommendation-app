import type { ChartPoint } from "../types";

interface TrackingChartProps {
  data: ChartPoint[];
}

export const TrackingChart = ({ data }: TrackingChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        No tracking data yet. Log a few days to see your trend.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Progress Snapshot</h3>
          <p className="text-xs text-slate-500">Average daily score (last {data.length} entries)</p>
        </div>
        <span className="text-xs text-slate-400">0-5 scale</span>
      </div>
      <div className="mt-4 flex items-end gap-3">
        {data.map((point) => (
          <div key={point.date} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-28 w-full items-end">
              <div
                className="w-full rounded-lg bg-emerald-500"
                style={{ height: `${Math.max(point.value / 5, 0.05) * 100}%` }}
                aria-label={`Score ${point.value} on ${point.date}`}
              />
            </div>
            <div className="text-[11px] text-slate-500">{point.label}</div>
            <div className="text-[11px] font-semibold text-slate-700">{point.value.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
