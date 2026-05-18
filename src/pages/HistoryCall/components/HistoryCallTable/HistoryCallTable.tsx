import type { HistoryCall } from "@/api/historyCall";
import { formatDate } from "@/lib/formatDate";
import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { AudioPlayer } from "../AudioPlayer/AudioPlayer";
import styles from "./HistoryCallTable.module.scss";

interface HistoryCallTableProps {
  historyCall: HistoryCall[];
  canViewRecordings: boolean;
}

const DirectionBadge = ({ direction }: { direction: string }) => {
  const isIncoming = direction === "inbound";

  return (
    <span
      className={`${styles.badge} ${isIncoming ? styles.badgeIncoming : styles.badgeOutgoing}`}
    >
      {isIncoming ? (
        <ArrowDownLeft size={14} className={styles.badgeIcon} />
      ) : (
        <ArrowUpRight size={14} className={styles.badgeIcon} />
      )}
      {isIncoming ? "Входящий" : "Исходящий"}
    </span>
  );
};

const HistoryCallTable = ({
  historyCall,
  canViewRecordings,
}: HistoryCallTableProps) => {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Номер звонящего</th>
            <th>Номер получателя</th>
            <th>Тип вызова</th>
            <th>Длительность</th>
            {canViewRecordings && <th>Запись разговора</th>}
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {historyCall.map((u) => (
            <tr key={u.start_stamp}>
              <td className={styles.numberCell}>{u.caller_id_number}</td>
              <td className={styles.numberCell}>{u.destination_number}</td>
              <td className={styles.typeCell}>
                <DirectionBadge direction={u.direction} />
              </td>
              <td className={styles.durationCell}>
                <span className={styles.durationValue}>
                  <Clock size={14} className={styles.durationIcon} />
                  {u.duration}
                </span>
              </td>
              {canViewRecordings && (
                <td className={styles.recordingCell}>
                  {u.call_uuid ? (
                    <AudioPlayer callUuid={u.call_uuid} />
                  ) : (
                    <span className={styles.noRecording}>Нет записи</span>
                  )}
                </td>
              )}
              <td className={styles.dateCell}>{formatDate(u.start_stamp)}</td>
            </tr>
          ))}
          {historyCall.length === 0 && (
            <tr>
              <td colSpan={canViewRecordings ? 6 : 5} className={styles.empty}>
                Нет вызовов
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryCallTable;
