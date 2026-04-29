import type { PhoneBook } from "@/api/phoneBook";
import { Pencil, Trash2 } from "lucide-react";
import styles from "./NumbersTable.module.scss";

interface NumbersTableProps {
  numbers: PhoneBook[];
  role: string;
  onEdit: (phoneBook: PhoneBook) => void;
  onDelete: (phoneBook: PhoneBook) => void;
}

const NumbersTable = ({
  numbers,
  role,
  onEdit,
  onDelete,
}: NumbersTableProps) => {
  const isSuperAdmin = role === "superadmin";

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Название</th>
            <th className={styles.numberCol}>Номер</th>
            {isSuperAdmin && <th className={styles.actionsCol}>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {numbers.map((u) => (
            <tr key={u.number_uuid}>
              <td className={styles.nameCell}>{u.number_name}</td>
              <td className={styles.numberCell}>{u.number_number}</td>
              {isSuperAdmin && (
                <td className={styles.actionsCol}>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.iconBtn} ${styles.editBtn}`}
                      title="Изменить"
                      onClick={() => onEdit(u)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className={`${styles.iconBtn} ${styles.dangerBtn}`}
                      title="Удалить"
                      onClick={() => onDelete(u)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          {numbers.length === 0 && (
            <tr>
              <td colSpan={isSuperAdmin ? 3 : 2} className={styles.empty}>
                Нет номеров
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NumbersTable;
