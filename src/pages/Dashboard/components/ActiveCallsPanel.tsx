import { memo, useMemo } from "react";
import styles from "../Dashboard.module.scss";
import type { ChartDataItem } from "../lib/chartData";
import { DonutChart } from "./DonutChart";

interface ActiveCallsPanelProps {
  callsCount: number | null;
}

const MAX_CALLS = 10;
const FILLED = "var(--success)";
const EMPTY = "var(--bg-secondary)";

export const ActiveCallsPanel = memo(function ActiveCallsPanel({ callsCount }: ActiveCallsPanelProps) {
  const count = callsCount === null ? 0 : Math.min(callsCount, MAX_CALLS);
  const data = useMemo<ChartDataItem[]>(() => [
    { name: "Активные", value: count, color: FILLED },
    { name: "Свободно", value: MAX_CALLS - count, color: EMPTY },
  ], [count]);

  return (
    <section className={`${styles.panel} ${styles.callsPanel}`}>
      <h2 className={styles.sectionTitle}>Активные вызовы</h2>
      <div className={styles.chartCard}>
        <div className={styles.callsChartContainer}>
          <DonutChart
            data={data}
            centerLabel={
              <span className={styles.callsCount}>
                {callsCount === null ? "—" : count}
              </span>
            }
          />
        </div>
        <p className={styles.chartInfo}>
          {callsCount === null ? "—" : `${count} / ${MAX_CALLS}`}
        </p>
      </div>
    </section>
  );
});
