import { ActiveCallsPanel } from "./components/ActiveCallsPanel";
import { DailyCallsChart } from "./components/DailyCallsChart";
import { SystemResourcesPanel } from "./components/SystemResourcesPanel";
import styles from "./Dashboard.module.scss";
import { useDashboardSocket } from "./hooks/useDashboardSocket";

const Dashboard = () => {
  const { resources, callsCount, connectionState } = useDashboardSocket();

  if (connectionState === "error" && !resources && callsCount === null) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.statusError}>Ошибка подключения к серверу</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.grid}>
          <SystemResourcesPanel resources={resources} />
          <ActiveCallsPanel callsCount={callsCount} />
        </div>
        <DailyCallsChart />
      </div>
    </div>
  );
};

export default Dashboard;
