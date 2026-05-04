import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { useAppSelector } from "@/store/hooks";
import { getServerErrorMessage } from "@lib/getErrorMessage";
import { Search, X } from "lucide-react";
import HistoryCallTable from "./components/HistoryCallTable/HistoryCallTable";
import styles from "./HistoryCall.module.scss";
import { useHistoryCall } from "./hooks/useHistoryCall";

const HistoryCallPage = () => {
  const historyData = useHistoryCall();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const roleName = currentUser?.role?.role_name;
  const canViewRecordings =
    roleName === "superadmin" || roleName === "supervisor";

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>История вызовов</h1>
        {canViewRecordings && (
          <div className={styles.searchWrapper}>
            <div className={styles.inputWrapper}>
              <Input
                label=""
                className={styles.input}
                placeholder="Введите 6 цифр"
                value={historyData.searchNumber}
                onChange={(e) => historyData.handleSearch(e.target.value)}
                maxLength={6}
                type="text"
                inputMode="numeric"
              />
              {historyData.isSearching && (
                <button
                  onClick={historyData.clearSearch}
                  className={styles.clearButton}
                  type="button"
                  aria-label="Очистить поиск"
                >
                  <X />
                </button>
              )}
            </div>
            <Button
              onClick={historyData.handleSubmit}
              disabled={historyData.searchNumber.length !== 6}
              className={styles.searchButton}
            >
              <Search size={16} />
              Поиск
            </Button>
          </div>
        )}
      </div>

      {historyData.isPending ? (
        <p className={styles.loading}>Загрузка…</p>
      ) : historyData.isError ? (
        <p className={styles.error}>
          {getServerErrorMessage(historyData.error) ??
            "Ошибка загрузки вызовов"}
        </p>
      ) : (
        <>
          <HistoryCallTable
            canViewRecordings={canViewRecordings}
            historyCall={historyData.history}
          />
        </>
      )}
    </div>
  );
};

export default HistoryCallPage;
