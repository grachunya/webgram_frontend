import { memo, useMemo } from "react";
import styles from "../Dashboard.module.scss";
import { createChartData } from "../lib/chartData";
import { DonutChart } from "./DonutChart";

interface ResourceChartCardProps {
  label: string;
  used: number;
  free: number;
  infoText: string;
  noData?: boolean;
}

export const ResourceChartCard = memo(function ResourceChartCard({
  label,
  used,
  free,
  infoText,
  noData,
}: ResourceChartCardProps) {
  const data = useMemo(
    () => (noData ? createChartData(0, 1) : createChartData(used, free)),
    [noData, used, free],
  );

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartLabel}>{label}</h3>
      <DonutChart data={data} />
      <p className={styles.chartInfo}>{noData ? "—" : infoText}</p>
    </div>
  );
});
