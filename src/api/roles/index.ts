import { api } from '@lib/api';

export interface Role {
  role_uuid: string;
  role_name: string;
}

export interface CreateRolePayload {
  role_uuid: string;
  role_name: string;
}

export interface UpdateRolePayload {
  role_uuid: string;
  role_name: string;
}

export const ADMIN_ROLE_COLOR = '#0369a1';

export const USER_ROLE_COLOR = '#059669';

export const getRoleColor = (roleName: string): string => {
  if (roleName === 'superadmin') return ADMIN_ROLE_COLOR;
  return USER_ROLE_COLOR;
};

export const getRoles = () =>
  api.get<Role[]>('/roles').then((r) => r.data);

export const createRole = (payload: CreateRolePayload) =>
  api.post<Role>('/roles', payload).then((r) => r.data);

export const updateRole = (payload: UpdateRolePayload) =>
  api.put<Role>(`/roles/${payload.role_uuid}`, {
    role_uuid: payload.role_uuid,
    role_name: payload.role_name,
  }).then((r) => r.data);

export const deleteRole = (uuid: string) =>
  api.delete(`/roles/${uuid}`);
