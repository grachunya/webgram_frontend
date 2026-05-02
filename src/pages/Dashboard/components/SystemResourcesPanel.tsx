import { memo } from "react";
import type { SystemResources } from "../hooks/useDashboardSocket";
import { ResourceChartCard } from "./ResourceChartCard";
import styles from "../Dashboard.module.scss";

interface SystemResourcesPanelProps {
  resources: SystemResources | null;
}

export const SystemResourcesPanel = memo(function SystemResourcesPanel({ resources }: SystemResourcesPanelProps) {
  return (
    <section className={`${styles.panel} ${styles.resourcesPanel}`}>
      <h2 className={styles.sectionTitle}>Системные ресурсы</h2>

      <div className={styles.chartsGrid}>
        <ResourceChartCard
          label="RAM"
          used={resources?.ram.used_gb ?? 0}
          free={resources?.ram.free_gb ?? 0}
          infoText={
            resources
              ? `${resources.ram.used_gb} / ${resources.ram.total_gb} ГБ`
              : ""
          }
          noData={!resources}
        />

        <ResourceChartCard
          label="Диск"
          used={resources?.disk.used_gb ?? 0}
          free={resources?.disk.free_gb ?? 0}
          infoText={
            resources
              ? `${resources.disk.used_gb} / ${resources.disk.total_gb} ГБ`
              : ""
          }
          noData={!resources}
        />

        <ResourceChartCard
          label="CPU"
          used={resources?.cpu.cpu_usage_percent ?? 0}
          free={resources?.cpu.cpu_free_percent ?? 0}
          infoText={
            resources
              ? `${resources.cpu.cpu_usage_percent.toFixed(1)}%`
              : ""
          }
          noData={!resources}
        />
      </div>
    </section>
  );
});
