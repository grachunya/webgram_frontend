import { NavLink } from "react-router-dom";
import { Home as HomeIcon, Users as UsersIcon } from "lucide-react";
import styles from "./Sidebar.module.scss";

const navItems = [
  { to: "/home", label: "Главная", icon: HomeIcon },
  { to: "/users", label: "Пользователи", icon: UsersIcon },
] as const;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const handleMouseEnter = () => {
    if (collapsed) onToggle();
  };

  const handleMouseLeave = () => {
    if (!collapsed) onToggle();
  };

  const handleLinkClick = () => {
    if (!collapsed) onToggle();
  };

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
          {navItems.map(({ to, label, icon: Icon }) => (
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