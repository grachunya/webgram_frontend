import {
  BookOpenText,
  Headset as HeadsetIcon,
  History,
  Home as HomeIcon,
  LayoutDashboard,
  Users as UsersIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof HomeIcon;
  requiredRole?: string;
}

export const sidebarItems: NavItem[] = [
  { to: "/home", label: "Главная", icon: HomeIcon },
  { to: "/dashboard", label: "Панель состояния", icon: LayoutDashboard },
  {
    to: "/operators",
    label: "Операторы",
    icon: HeadsetIcon,
    requiredRole: "superadmin",
  },
  {
    to: "/users",
    label: "Пользователи",
    icon: UsersIcon,
    requiredRole: "superadmin",
  },
  { to: "/history-call", label: "История вызовов", icon: History },
  { to: "/phone-book", label: "Телефонная книга", icon: BookOpenText },
];
