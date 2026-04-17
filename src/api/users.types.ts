export interface User {
  user_uuid: string;
  user_name: string;
  user_password: string;
  role_uuid: string;
}

export interface UpdateUserPayload {
  user_uuid: string;
  user_name: string;
  role_uuid: string;
}

export interface UpdatePasswordPayload {
  user_password: string;
}

export const ROLE_COLORS: Record<string, string> = {
  Админ: '#4f46e5',
  Менеджер: '#d97706',
  Пользователь: '#059669',
};

export const DEFAULT_ROLE_COLOR = '#5f6880';
