import { getCdrCountByMinute, type CdrMinute } from "@api/dailyCalls";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from "../Dashboard.module.scss";

interface ChartPoint {
  label: string;
  count: number;
}

const toChartPoints = (items: CdrMinute[]): ChartPoint[] =>
  items.map(({ hour_of_day, minute_of_hour, call_count }) => ({
    label: `${hour_of_day.padStart(2, "0")}:${minute_of_hour.padStart(2, "0")}`,
    count: call_count,
  }));

const formatDate = (y: number, m: number, d: number) => {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  return `${d} ${months[m - 1]} ${y}`;
};

const shiftDay = (y: number, m: number, d: number, delta: number) => {
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
};

const isToday = (y: number, m: number, d: number) => {
  const now = new Date();
  return now.getFullYear() === y && now.getMonth() + 1 === m && now.getDate() === d;
};

const MAX_TICKS = 10;

const calcInterval = (len: number): number =>
  len <= MAX_TICKS ? 0 : Math.ceil(len / MAX_TICKS);

const renderTooltip = ({ label, value }: { label?: string | number; value?: number }) => {
  if (label == null) return null;
  return (
    <div className={styles.chartTooltip}>
      <span className={styles.tooltipLabel}>{String(label)}</span>
      <span className={styles.tooltipValue}>{value ?? 0} вызовов</span>
    </div>
  );
};

export const DailyCallsChart = memo(function DailyCallsChart() {
  const today = useMemo(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }, []);

  const [date, setDate] = useState(today);
  const polling = isToday(date.year, date.month, date.day);

  const { data, isError } = useQuery({
    queryKey: ["cdr-minute", date],
    queryFn: () => getCdrCountByMinute(date.year, date.month, date.day),
    refetchInterval: polling ? 10_000 : false,
  });

  const points = useMemo(() => (data ? toChartPoints(data) : []), [data]);
  const interval = useMemo(() => calcInterval(points.length), [points.length]);

  const goBack = useCallback(() => {
    setDate((prev) => shiftDay(prev.year, prev.month, prev.day, -1));
  }, []);

  const goForward = useCallback(() => {
    setDate((prev) => shiftDay(prev.year, prev.month, prev.day, 1));
  }, []);

  return (
    <div className={styles.panel}>
      <div className={styles.dailyHeader}>
        <h2 className={styles.sectionTitle}>Статистика вызовов за день</h2>
        <div className={styles.dateNav}>
          <button className={styles.dateBtn} onClick={goBack}>
            <ChevronLeft size={16} />
          </button>
          <span className={styles.dateLabel}>{formatDate(date.year, date.month, date.day)}</span>
          <button className={styles.dateBtn} onClick={goForward} disabled={polling}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {isError ? (
        <div className={styles.dailyEmpty}>Ошибка загрузки данных</div>
      ) : points.length === 0 ? (
        <div className={styles.dailyEmpty}>Нет данных</div>
      ) : (
        <div className={styles.dailyChartWrapper}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={points} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border-default)" }}
                interval={interval}
                minTickGap={40}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return renderTooltip({ label, value: payload[0].value as number });
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--accent)"
                fill="var(--accent)"
                fillOpacity={0.12}
                strokeWidth={2}
                isAnimationActive={points.length < 200}
                animationDuration={400}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});
