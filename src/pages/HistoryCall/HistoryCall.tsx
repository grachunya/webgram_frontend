import { getServerErrorMessage } from "@lib/getErrorMessage";
import HistoryCallTable from "./components/HistoryCallTable/HistoryCallTable";
import styles from "./HistoryCall.module.scss";
import { useHistoryCall } from "./hooks/useHistoryCall";

const HistoryCallPage = () => {
  const historyData = useHistoryCall();

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>История вызовов</h1>
      </div>

      {historyData.isPending ? (
        <p className={styles.loading}>Загрузка…</p>
      ) : historyData.isError ? (
        <p className={styles.error}>
          {getServerErrorMessage(historyData.error) ??
            "Ошибка загрузки вызовов"}
        </p>
      ) : (
        <HistoryCallTable historyCall={historyData.history} />
      )}
    </div>
  );
};

export default HistoryCallPage;
