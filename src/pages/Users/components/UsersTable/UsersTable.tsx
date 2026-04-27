import { Pencil, Trash2, KeyRound } from 'lucide-react';
import type { User } from '@api/users';
import RoleBadge from '../RoleBadge/RoleBadge';
import styles from './UsersTable.module.scss';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onPassword: (user: User) => void;
  onDelete: (user: User) => void;
}

const UsersTable = ({ users, onEdit, onPassword, onDelete }: UsersTableProps) => (
  <div className={styles.tableWrap}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Логин</th>
          <th className={styles.roleCol}>Роль</th>
          <th className={styles.actionsCol}>Действия</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.user_uuid}>
            <td className={styles.nameCell}>{u.user_name}</td>
            <td className={styles.roleCol}>
              <RoleBadge roleName={u.role.role_name} />
            </td>
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
                  className={`${styles.iconBtn} ${styles.passwordBtn}`}
                  title="Сменить пароль"
                  onClick={() => onPassword(u)}
                >
                  <KeyRound size={16} />
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
          </tr>
        ))}
        {users.length === 0 && (
          <tr>
            <td colSpan={3} className={styles.empty}>
              Нет пользователей
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default UsersTable;
