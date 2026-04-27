import { getRoleColor } from '@api/roles';
import styles from './RoleBadge.module.scss';

interface RoleBadgeProps {
  roleName: string;
}

const RoleBadge = ({ roleName }: RoleBadgeProps) => {
  const color = getRoleColor(roleName);

  return (
    <span className={styles.badge} style={{ backgroundColor: `${color}18`, color }}>
      {roleName}
    </span>
  );
};

export default RoleBadge;
