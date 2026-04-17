import { ROLE_COLORS, DEFAULT_ROLE_COLOR } from '@api/users.types';
import styles from './RoleBadge.module.scss';

interface RoleBadgeProps {
  roleName: string;
}

const RoleBadge = ({ roleName }: RoleBadgeProps) => {
  const color = ROLE_COLORS[roleName] ?? DEFAULT_ROLE_COLOR;

  return (
    <span className={styles.badge} style={{ backgroundColor: `${color}18`, color }}>
      {roleName}
    </span>
  );
};

export default RoleBadge;
