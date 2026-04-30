export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

const FREE_COLOR = "var(--bg-secondary)";

const getUsageColor = (percent: number) => {
  if (percent <= 50) return "var(--success)";
  if (percent <= 80) return "var(--warning)";
  return "var(--danger)";
};

export const createChartData = (
  used: number,
  free: number,
): ChartDataItem[] => {
  const total = used + free;
  const percent = total > 0 ? (used / total) * 100 : 0;

  return [
    { name: "Использовано", value: used, color: getUsageColor(percent) },
    { name: "Свободно", value: free, color: FREE_COLOR },
  ];
};
