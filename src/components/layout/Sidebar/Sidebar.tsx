import { memo, useCallback, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { sidebarItems } from "./sidebarItems";
import styles from "./Sidebar.module.scss";

const Sidebar = memo(function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const { data: user } = useCurrentUser();
  const userRole = user?.role?.role_name;

  const handleMouseEnter = useCallback(() => {
    setCollapsed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCollapsed(true);
  }, []);

  const handleLinkClick = useCallback(() => {
    setCollapsed(true);
  }, []);

  const visibleItems = useMemo(() => {
    return sidebarItems.filter(
      (item) => !item.requiredRole || item.requiredRole === userRole,
    );
  }, [userRole]);

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
});

export default Sidebar;