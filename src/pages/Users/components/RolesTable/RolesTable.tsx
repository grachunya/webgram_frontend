import { Pencil, Trash2 } from 'lucide-react';
import type { Role } from '@api/roles';
import styles from './RolesTable.module.scss';
import RoleBadge from '../RoleBadge/RoleBadge';

interface RolesTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

const RolesTable = ({ roles, onEdit, onDelete }: RolesTableProps) => (
  <div className={styles.tableWrap}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Название</th>
          <th className={styles.actionsCol}>Действия</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((r) => (
          <tr key={r.role_uuid}>
            <td ><RoleBadge roleName={r.role_name}/></td>
            <td className={styles.actionsCol}>
              <div className={styles.actions}>
                <button
                  className={`${styles.iconBtn} ${styles.editBtn}`}
                  title="Изменить"
                  onClick={() => onEdit(r)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className={`${styles.iconBtn} ${styles.dangerBtn}`}
                  title="Удалить"
                  onClick={() => onDelete(r)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {roles.length === 0 && (
          <tr>
            <td colSpan={2} className={styles.empty}>
              Нет ролей
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default RolesTable;
