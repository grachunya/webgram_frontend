import type { Role, CreateRolePayload, UpdateRolePayload } from '../roles.types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let roles: Role[] = [
  { role_uuid: '11111111-1111-1111-1111-111111111111', role_name: 'Админ' },
  { role_uuid: '22222222-2222-2222-2222-222222222222', role_name: 'Менеджер' },
  { role_uuid: '33333333-3333-3333-3333-333333333333', role_name: 'Пользователь' },
];

export const mockGetRoles = async (): Promise<Role[]> => {
  await delay(400);
  return [...roles];
};

export const mockGetRole = async (uuid: string): Promise<Role> => {
  await delay(300);
  const role = roles.find((r) => r.role_uuid === uuid);
  if (!role) throw new Error('Роль не найдена');
  return { ...role };
};

export const mockCreateRole = async (payload: CreateRolePayload): Promise<Role> => {
  await delay(500);
  const exists = roles.some((r) => r.role_name === payload.role_name);
  if (exists) throw new Error('Роль с таким названием уже существует');
  const newRole: Role = { role_uuid: crypto.randomUUID(), ...payload };
  roles = [...roles, newRole];
  return { ...newRole };
};

export const mockUpdateRole = async (payload: UpdateRolePayload): Promise<Role> => {
  await delay(500);
  const idx = roles.findIndex((r) => r.role_uuid === payload.role_uuid);
  if (idx === -1) throw new Error('Роль не найдена');
  roles[idx] = { ...roles[idx], role_name: payload.role_name };
  return { ...roles[idx] };
};

export const mockDeleteRole = async (uuid: string): Promise<Role> => {
  await delay(400);
  const idx = roles.findIndex((r) => r.role_uuid === uuid);
  if (idx === -1) throw new Error('Роль не найдена');
  const [deleted] = roles.splice(idx, 1);
  return { ...deleted };
};
