import { memo, type ReactNode } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import styles from "../Dashboard.module.scss";
import type { ChartDataItem } from "../lib/chartData";

type SectorPayload = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  payload?: ChartDataItem;
  fill?: string;
};

const renderSector = (props: SectorPayload) => (
  <Sector
    {...props}
    fill={props.payload?.color ?? props.fill ?? "var(--border)"}
    stroke="none"
    style={{ outline: "none" }}
  />
);

interface DonutChartProps {
  data: ChartDataItem[];
  centerLabel?: ReactNode;
}

export const DonutChart = memo(function DonutChart({ data, centerLabel }: DonutChartProps) {
  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={44}
            outerRadius={62}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            rootTabIndex={-1}
            shape={renderSector}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          />
        </PieChart>
      </ResponsiveContainer>

      <div className={styles.chartCenter}>
        {centerLabel ?? (
          <span className={styles.chartPercent}>{calcPercent(data)}%</span>
        )}
      </div>
    </div>
  );
});

function calcPercent(data: ChartDataItem[]): string {
  const used = data[0]?.value ?? 0;
  const total = data.reduce((s, d) => s + d.value, 0);

  return total > 0 ? ((used / total) * 100).toFixed(1) : "0";
}
