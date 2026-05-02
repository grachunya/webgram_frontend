import {
  BookOpenText,
  Headset as HeadsetIcon,
  History,
  Home as HomeIcon,
  LayoutDashboard,
  Users as UsersIcon,
} from "lucide-react";

export type UserRole = "superadmin" | "supervisor" | "operator";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof HomeIcon;
  allowedRoles?: UserRole[];
}

export const sidebarItems: NavItem[] = [
  {
    to: "/home",
    label: "Главная",
    icon: HomeIcon,
  },
  {
    to: "/dashboard",
    label: "Панель состояния",
    icon: LayoutDashboard,
  },
  {
    to: "/operators",
    label: "Операторы",
    icon: HeadsetIcon,
    allowedRoles: ["superadmin", "supervisor"],
  },
  {
    to: "/users",
    label: "Пользователи",
    icon: UsersIcon,
    allowedRoles: ["superadmin"],
  },
  {
    to: "/history-call",
    label: "История вызовов",
    icon: History,
  },
  {
    to: "/phone-book",
    label: "Телефонная книга",
    icon: BookOpenText,
  },
];