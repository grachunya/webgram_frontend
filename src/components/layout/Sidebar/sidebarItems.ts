import { Home as HomeIcon, Users as UsersIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof HomeIcon;
  requiredRole?: string;
}

export const sidebarItems: NavItem[] = [
  { to: "/home", label: "Главная", icon: HomeIcon },
  { to: "/users", label: "Пользователи", icon: UsersIcon, requiredRole: "superadmin" },
];
