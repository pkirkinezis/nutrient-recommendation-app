import type { ChartPoint, DailyLog } from "../types";

const toTimestamp = (value: string): number => {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatLabel = (value: string): string => {
  if (!value) return "";
  return value.slice(5);
};

const averageScore = (log: DailyLog): number => {
  return (log.sleepQuality + log.energyLevel + log.mood + log.focus + log.recovery) / 5;
};

export const buildTrackingChartData = (logs: DailyLog[], limit = 7): ChartPoint[] => {
  if (!logs || logs.length === 0) return [];

  const sorted = [...logs]
    .filter((log) => Boolean(log?.date))
    .sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date));

  const sliceStart = Math.max(sorted.length - limit, 0);
  return sorted.slice(sliceStart).map((log) => ({
    date: log.date,
    label: formatLabel(log.date),
    value: Number(averageScore(log).toFixed(1)),
  }));
};

const escapeCsv = (value: string): string => {
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const buildTrackingCsv = (logs: DailyLog[]): string => {
  if (!logs || logs.length === 0) return "";

  const header = [
    "date",
    "sleepQuality",
    "energyLevel",
    "mood",
    "focus",
    "recovery",
    "supplementsTaken",
    "notes",
  ];

  const rows = [...logs]
    .filter((log) => Boolean(log?.date))
    .sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date))
    .map((log) => {
      const supplements = log.supplementsTaken?.length ? log.supplementsTaken.join("; ") : "";
      return [
        log.date,
        String(log.sleepQuality),
        String(log.energyLevel),
        String(log.mood),
        String(log.focus),
        String(log.recovery),
        supplements,
        log.notes ?? "",
      ].map(escapeCsv).join(",");
    });

  return [header.join(","), ...rows].join("\n");
};
