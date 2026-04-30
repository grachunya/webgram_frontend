import styles from "../Dashboard.module.scss";
import type { ChartDataItem } from "../lib/chartData";
import { DonutChart } from "./DonutChart";

interface ActiveCallsPanelProps {
  callsCount: number | null;
}

const ACCENT = "var(--success)";
const EMPTY = "var(--bg-secondary)";

const getCallsData = (count: number): ChartDataItem[] => {
  if (count === 0) {
    return [{ name: "Свободно", value: 1, color: EMPTY }];
  }
  return [{ name: "Активные", value: count, color: ACCENT }];
};

export const ActiveCallsPanel = ({ callsCount }: ActiveCallsPanelProps) => {
  const count = callsCount ?? 0;
  const data = getCallsData(count);

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
        <h2 className={styles.chartInfo}>Активные вызовы: {callsCount}</h2>
      </div>
    </section>
  );
};
