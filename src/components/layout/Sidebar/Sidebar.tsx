import { NavLink } from "react-router-dom";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { sidebarItems } from "./sidebarItems";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { data: user } = useCurrentUser();
  const userRole = user?.role?.role_name;

  const handleMouseEnter = () => {
    if (collapsed) onToggle();
  };

  const handleMouseLeave = () => {
    if (!collapsed) onToggle();
  };

  const handleLinkClick = () => {
    if (!collapsed) onToggle();
  };

  const visibleItems = sidebarItems.filter(
    (item) => !item.requiredRole || item.requiredRole === userRole,
  );

  return (
    <div
      className={styles.sidebarWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      >
        <nav className={styles.nav}>
          {visibleItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
